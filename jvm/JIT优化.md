# JIT优化技术

## 即时编译

### 分层编译模式

在java7以前hotspot虚拟机，我们根据程序的特性选择相应的编译器，对启动性能有要求的程序选择编译较快的C1编译器，对程序峰值性能有要求的程序 我们可以选择生成代码执行速度比较快的C2编译器。

java7引入了分层编译的概念，综合了峰值性能和启动性能，分为五个层次：

**0：解释执行**

**1：执行不带profile的C1代码**

**2：执行带方法调用次数和循坏回边次数的C2代码**

**3：执行所有profile的代码**

**4：执行C2代码**

通常情况下C2代码执行效率要比C1高30%，C1代码的三种状态1>2>3,其中一层比二层性能稍高，二层比三层高30%，因为profile越多开销越大。

1层和4层是终止状态，如果代码没有失效是不会发起编译请求的。

**一般情况**：0层会把热点方法给3层编译，然后给4层C2

**profile少**：会把3层热点方法给C1，因为认为两者效率区别不大

**C1忙碌下**：会在解释执行的时候就手机profile直接把热点方法给C2

**C2忙碌下**：会把热点方法给1层先编译在给2层减少编译时间，然后在给C2

所以说第一层只有类似set/get方法profile少的时候才会交给C1

### 即时编译的触发

其实在0、2、3层执行的时候就在手机profile其中就包括循环次数和方法调用次数。

**关闭分层编译**的情况下循环次数和方法次数之和，C1阈值达到1500就开启，C2达到10000次就会开启。

**开启分层编译**会采用另外一套阈值系统，这套系统是动态开启的，java虚拟机会将阈值与某个系数相乘，这个系数与当前等待编译的方法数成正比，与编译线程数成反比。

java虚拟机给C1和C2分配的编译线程数为1：2

### profiling

在分层编译中0层2、3层都会进行收集profile，其中最基础的profile就是方法调用次数和循环次数，他们被用于触发即时编译。

其中第0层和3层还会收集4层需要的profile，这又包括字节码分支，类型测试，跳转次数和不跳转次数等等。

因为3层收集了这些信息导致性能下降了30%，那么花费这么大力气收集这些信息有什么用处呢？当然就是给C2进行编译优化，肯定是优化的结果性能有个质的提升不然也不用浪费这么多资源进行收集。

C2采用的是比较激进的一种编译优化。

#### 基于分支的profile的优化

通过假设精简分支，比如说为true的分支跳转次数很多，那么就可以假设下一次也是true，那么就可以只优化true的分支，基于这个假设就不会去编译false的分支了。

即时编译器可以把从未执行过的分支进行减掉，避免编译用不到的代码，从而节省编译时间以及部署代码所需要消耗的内内存，而且减掉分支可以精简控制流从而触发更多的优化。

当然现实情况中减掉的情况并不多，但这也是即时编译器的作用之一，即时编译器还可以计算每一条分支的执行几率，通过前面收集profile，从而优先编译执行几率较大的分支

#### 基于类型测试的profile的优化

跟分支的优化类似，也是基于假设的前提，对方法调用进行内联去虚化，但是不同点，基于分支的优化是优化单一分支，而类型测试可能会假设对象类型为profile里的几种（默认两种）

### 去优化

既然是假设为前提，那么肯定有假设失败的情况，在假设失败的分支上都会进行创建一个陷阱（trap），这个陷阱其实是一条call指令，这条指令实际上会更改栈上的返回地址，不会在返回即时编译器生成的机器码中。

首先会去还原当前执行到机器码对应的字节码状态，这个过程非常的复杂，因为编译器采用了很多优化方式导致机器码和原本的字节码差异会很大，比如说经过逃逸分析的对象，这些字段经过标量替换都放在寄存器里面了，还得把这些对象给还原回来。这些映射关系必须记录好才能还原成原本的字节码，然后通过OSR技术动态替换栈上的内容在目标字节码处解释执行。

既然是假设失败说明profile收集得不准确，需要实时更正profile。

当然如果去优化原因与优化无关，机器码也会保留。



## 方法内联

指在编译过程中遇到方法调用，把目标方法体**纳入编译范围**，并取代原方法调用的优化手段。

方法内联不仅可以消除方法调用本身的开销进而还可以触发更多的优化。

拿常见的set/get举例子，访问的时候需要保存方法当前执行的位置，创建并压入用于set/get的栈帧，访问字段，弹出栈帧，如果进行了内联只剩下访问字段操作了。

### 方法内联的条件

在C2中方法内联是在解析字节码阶段进行的，每当碰到方法调用的时候都会决定是否进行内联，@ForceInline会被强制内联

内联越多编译时间越长，代码生成执行的效率越高。

内联越多导致生成的机器码越长，编译生成的机器码是有内存限制的，部署在Code Cache中。

不会内联的情况：

1.@DontInline

2.调用字节码的引用未被解析，方法是native，目标方法所在类未被被初始化

3.C2内联最多不超过9层，以及一层的直接调用

### 去虚化

#### 完全去虚化

通过类型推或类层次分析导识别虚方法调用的唯一方法，从而转为直接调用，关键在于确定此虚方法是唯一的目标方法。

**类型推导**的完全去虚化是通过数据流的分析出调用者的动态类型，从而确定目标方法进行内联。

```java
public static void typeInference(List list){
        list = new ArrayList();
        list.add("tyep");
}
```

像这样的就可以直接的推导出来。

```java
public static int notInline(List list){
        if (list instanceof ArrayList){
            list.add("1");
        }
        return 0;
}
```

这种的话其实也可以推导出来，但是类型推导属于全局优化比较浪费时间，没必要太麻烦了。并且下面还有类层次分析和条件去虚化兜底。

**类层次分析**的完全去虚化，就是通过jvm现加载的类分析，判断某个**抽象方法**是否只有唯一的实现或者继承，如果是就可以确定唯一的方法进行去虚化。

因为无法保证以后会不会加载新的实现类，所以jvm会在当前编译结果注册一个假设每次加载新的类都会重新验证这些假设，如果假设不成立就重新进行编译优化

#### 条件去虚化

指把虚方法调用转换为若干个类型测试后的直接调用。比如List的add虚方法调用。

```java
public static int conditionDeblurring(List list){
        if (list instanceof ArrayList) {
            return 1;
        } else if (list instanceof LinkedList) {
            return 1;
        } else {
            // 没匹配上...
        }
}
```

这就需要需要前面收集得profile来作为类型测试依据了，方法调用的时候回去匹配这些profile，如果配上就直接调用类型记录目标方法，没匹配上有两种结果

1.如果收集的profile是完整的，那么即时编译器可以继续收集，继续优化。（前提没超过profile收集数量限制）

2.如果不完整，在重新收集意义不大，就算重新搜集也是不完整的，就会触发**去优化**，就会走原本的方法调用流程，去找内联缓存找不到找方法表

## 逃逸分析

在java虚拟机的即时编译环境中，逃逸分析指**新建**对象没有被逃逸的情况，什么是没有被逃逸呢。一种是对象没有被在堆中创建（比如说静态字段或者堆中的实例字段），第二种就是没有被传入未知代码块。

第一种很好理解因为堆中的线程共享的，所有线程都能获取，编译器不能知道所有引用此对象代码块的位置。

第二种呢就是没有进行内联的方法就属于未知代码块，所以新建对象的作用域就算超出了本方法，只要没超出方法内联的层数也是可以进行逃逸优化掉。