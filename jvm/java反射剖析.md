# java反射剖析

既然要说反射，那么就必须要先搞懂java的方法是怎样的一个调用过程。

## java方法调用

### 方法绑定

分为静态绑定和动态绑定，首先方法调用编译成汇编指令的时候，对应五种方法调用类型分别是：

**invokestatic** ：静态方法调用指令

**invokespecial** ：特殊方法调用指令例如构造方法super方法

**invokevirtual**  ：实例化对象的非私有方法

**invokeinterface** ：接口方法

**invokedynamic**：方法句柄指令

前两者属于静态绑定，因为在调用的时候不需要进行判断直接可以确定方法本身

后面三个属于动态绑定需要根据调用者类型进行确定方法地址，所以实际上动态绑定实际上绑定的不是方法本身而是一个方法表的索引值，每次就需要拿着调用者的类型去方法表里去找。

什么是方法表的索引值呢？

先说下索引值是什么，方法表其实就是一个数组，数组的索引位就是指令所绑定的值。

子类重写父类的方法索引位与父类相同，给一个例子：

```java
class Person {

    public void getName() {
        System.out.println("我是一个人");
    }

    @Override
    public String toString() {
        return super.toString();
    }
}
class SuperPerson extends Person{

    @Override
    public void getName() {
        System.out.println("我是一个超人");
    }

    @Override
    public String toString() {
        return super.toString();
    }

    public void feature(){
        System.out.println("我会飞");
    }
}
```

​									Object的方法表

| 索引位 | 方法名     |
| :----- | ---------- |
| 0      | toString() |

​									Person的方法表

| 索引位 | 方法名     |
| :----- | ---------- |
| 0      | toString() |
| 1      | getName()  |

​								SuperPerson的方法表

| 索引位 | 方法名     |
| :----- | ---------- |
| 0      | toString() |
| 1      | getName()  |
| 2      | feature()  |

现在可以看到索引值相同方法名字也相同，所以当做虚方法调用的时候只需要拿到索引值进行类型匹配就行了，这样看来好像虚调用和静态绑定比起来只多了几个引用操作，这点消耗忽略不计，但其实不是这样的。

因为这种情况只有解释执行和即时编译器中情况最差的情况效率差不多，在即时编译器中，存在内联缓存和方法内联两种情况，由于方法内联比较复杂涉及的东西比较多，所以现在只介绍一下内联缓存，方法内联在后面在介绍

内联缓存的实现比较简单，就是判断调用者类型是否被缓存起来，如果命中缓存直接调用缓存目标方法

内联缓存又分为

**单态内联**：缓存一个调用者类型

**多态内联**：缓存多个，按照热点方法排序

**超态内联**：不缓存

也不是说缓存一定就好，比如单态缓存调用者类型不断变更，那还不如不缓存直接查表，还增加了刷新缓存的消耗。这章主要讨论反射，这里不做过多的解释

## 反射调用

`method.invoke()`我们直接看这个方法是怎么实现的吧，可以invoke方法其实进行了一个委派。

```java
 public Object invoke(Object obj, Object... args) {
        MethodAccessor ma = methodAccessor;         
        if (ma == null) {
            ma = acquireMethodAccessor();
        }
        return ma.invoke(obj, args);
  }
```

而 `MethodAccessor`只是一个接口，里面有两个实现 `DelegatingMethodAccessorImpl` 和 `NativeMethodAccessorImpl` 前者实际上也是一个委派模式，委派给本地实现也就是最终调用本地native方法，那为什么要进行一个委派这么麻烦呢，直接调用本地实现不好吗？

那是因为jvm还会有个动态生成字节码的优化，当调用次数达到15次的时候就会被优化成动态实现，根据官方的解释动态实现运行效率比本地实现高20倍（因为无需java到C++到java的转换），但是由于字节码生成非常的耗时，单词调用的话效率会差上3-4倍，所以需要一个阈值（ Dsun.reflect.inflationThreshold= ），达到这个阈值就进行开启这个过程就叫做 Inflation 。

我们可以来模拟一下这个Inflation过程，看是否进行了动态生成

```java
class Scratch {
    public static void test(int i) {
        new Exception("times:" + i).printStackTrace();
    }

    public static void main(String[] args) throws Exception {
        Class<?> scratch = Class.forName("Scratch");
        Method method = scratch.getMethod("test", int.class);
        for (int i = 0; i < 20; i++) {
            method.invoke(null, i+1);
        }
    }

}
```

利用`java -verbose:class Scratch`进行打印

```java
java.lang.Exception: times:15
        at Scratch.test(scratch_3.java:5)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)
        at java.lang.reflect.Method.invoke(Unknown Source)
        at Scratch.main(scratch_3.java:10)
java.lang.Exception: times:16
        at Scratch.test(scratch_3.java:5)
        at sun.reflect.GeneratedMethodAccessor1.invoke(Unknown Source)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)
        at java.lang.reflect.Method.invoke(Unknown Source)
        at Scratch.main(scratch_3.java:10)    
```

可以看到在第16次的时候由 `NativeMethodAccessorImpl` 本地实现 切换到了 `GeneratedMethodAccessor1`动态生成的实现

### 反射的开销

像getMethods和getFields这些都是要调用c++方法的所以开销是不小的，一般来说你只调用你需要那个方法就行了，因为的话getMethod方法虽然也会进行一个软引用缓存，但是每次获取都是进行的一个结果copy而不是引用拷贝。

再来谈一下invoke方法本身的开销，反射性能的瓶颈是内联困难，**invokespecial** ，**invokevirtual** 这两个指令的profile默认只能记录两个调用点类型（profile：指的是jvm在做优化的时候，记录调用者的类型，这个叫做profile，具体的会在以后的即时编译器里面讲）。