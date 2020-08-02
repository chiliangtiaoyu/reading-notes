

## 2 重新认识IOC

### 2.1 什么是IOC?

IOC这个概念在1983年就已经提出，主要是说程序是一个串行执行的，上文到下文的一个关系就形成了一个依赖关系，ioc就是把这种依赖关系进行一个反转的解耦，称之为好莱坞原则，意思是导演跟演员打电话就不需要演员自己打电话了，程序不需要关心怎么去获取数据来源，由第三方来提供数据也就是ioc提供

servlet是IOC容器的一种实现，经过依赖或者反向的通过JNDI的方式进行得到一些外部的资源

### 2.2 IOC的主要实现策略

#### 2.2.1 依赖查找

就是应用程序里面还是要调用容器的bean查找接口查找bean实例 

特征：主动获取，侵入业务逻辑，依赖容器api，可读性良好。

#### 2.2.2 依赖注入(DI)

直接在容器启动时通过构造器,参数,getter setter,接口等形式注入依赖。
优点：被动提供，相对便利，低侵入性，不依赖容器api，可读性一般

#### 2.2.3 上下文查找

#### 2.2.5 模板模式

JdbcTemplate的使用,不需要关心具体callback来源
传统方式,需要自己调用

#### 2.2.5 策略模式

### 2.3 IOC的职责

### 2.4 面试题

#### 依赖查找和依赖注入的区别？

依赖查找是主动或手动的依赖查找方式，通常需要依赖容器或标准API实现。

依赖注入是手动和或自动依赖绑定方式，无需依赖特定的容器和API

#### spring作为IOC容器有什么优势

1. 典型的IOC管理，依赖查找和依赖注入
2. AOP抽象
3. 事件机制
4. SPI扩展
5. 强大的第三方整合
6. 易测试性
7. 更好的面向对象

## 3 IOC容器概述

### 依赖查找

配置文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans
        xmlns="http://www.springframework.org/schema/beans"
        xmlns:context="http://www.springframework.org/schema/context"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">
    <bean id="user" class="zy.spring.ioc.container.domain.User">
        <property name="name" value="张三"/>
        <property name="age" value="18"/>
    </bean>
    <bean id="objectFactory" class="org.springframework.beans.factory.config.ObjectFactoryCreatingFactoryBean">
        <property name="targetBeanName" value="user"/>
    </bean>
    <bean id="superUser" class="zy.spring.ioc.container.domain.SuperUser" parent="user" primary="true">
        <property name="address" value="beijing"/>
    </bean>

</beans>
```

spring加载类的几种方式

```java
public class LookUp {
    public static void main(String[] args) {
        BeanFactory beanFactory = new ClassPathXmlApplicationContext("classpath:/META-INF/dependency-lookup-context.xml");
        //通过名字查找
        lookupRealName(beanFactory);
        //延迟加载
        lookupLazy(beanFactory);
        //通过类型查找
        lookupType(beanFactory);
        //通过类型查找bean集合
        lookupByList(beanFactory);
        //通过注解查找
        lookupByAnnotation(beanFactory);
    }

    private static void lookupByAnnotation(BeanFactory beanFactory) {
        if (beanFactory instanceof ListableBeanFactory){
            ListableBeanFactory listableBeanFactory = (ListableBeanFactory) beanFactory;
            Map<String, User> beansWithAnnotation = (Map)listableBeanFactory.getBeansWithAnnotation(Super.class);
            System.out.println(beansWithAnnotation);
        }
    }

    private static void lookupByList(BeanFactory beanFactory) {
        if (beanFactory instanceof ListableBeanFactory){
            ListableBeanFactory listableBeanFactory = (ListableBeanFactory) beanFactory;
            Map<String, User> beansOfType = listableBeanFactory.getBeansOfType(User.class);
            System.out.println(beansOfType);
        }
    }

    private static void lookupType(BeanFactory beanFactory) {
        User bean = beanFactory.getBean(User.class);
        System.out.println(bean);
    }

    private static void lookupLazy(BeanFactory beanFactory) {
        ObjectFactory<User> objectFactory = (ObjectFactory<User>) beanFactory.getBean("objectFactory");
        System.out.println(objectFactory.getObject());
    }

    private static void lookupRealName(BeanFactory beanFactory) {
        Object user = beanFactory.getBean("user");
        System.out.println(user);
    }
}

```

### 依赖注入

略

Spring IOC依赖来源

- 自定义bean

  自己在配置文件或者注解上写的

- 容器内建bean对象

  容器自己创建的spring bean，但是不能通过getBean查找到

- 容器内建依赖

  容器自己建立的但是不属于容器bean

  

### Spring IOC配置元信息

- Bean定义配置
  - 基于XML文件
  - 基于Properties文件
  - 基于java注解
  - 基于JavaApi（专题讨论）
- IOC容器配置
  - 基于XML文件
  - 基于java注解
  - 基于javaApi
- 外部化属性配置
  - 基于java注解





### 谁才是真正的容器？

BeanFactory和ApplicationContext 后者继承前者是前者的一个超集，前者所有功能后者都有

```java
BeanFactory beanFactory = new ClassPathXmlApplicationContext("classpath:/META-INF/dependency-injection-context.xml");
```

```java
public class UserRepository {

    private Collection<User> users; //自定义bean

    private BeanFactory beanFactory; //内建对象

}
```

```java
System.out.println(beanFactory == userRepository.getObjectFactory().getObject());
```

为什么会出现false，因为组合模式的原因，父类 `AbstractRefreshableApplicationContext`进行了组合

```java
public abstract class AbstractRefreshableApplicationContext extends AbstractApplicationContext {	
	@Nullable
	private DefaultListableBeanFactory beanFactory;
}
```

并且在 `prepareBeanFactory`方法中明确的指明了 `beanFactory.registerResolvableDependency(BeanFactory.class, beanFactory);`，此方法会在创建 `ClassPathXmlApplicationContext`的构造器通过 `refresh()`进行调用

```java
protected void prepareBeanFactory(ConfigurableListableBeanFactory beanFactory) {
		// Tell the internal bean factory to use the context's class loader etc.
		beanFactory.setBeanClassLoader(getClassLoader());
		beanFactory.setBeanExpressionResolver(new StandardBeanExpressionResolver(beanFactory.getBeanClassLoader()));
		beanFactory.addPropertyEditorRegistrar(new ResourceEditorRegistrar(this, getEnvironment()));

		// Configure the bean factory with context callbacks.
		beanFactory.addBeanPostProcessor(new ApplicationContextAwareProcessor(this));
		beanFactory.ignoreDependencyInterface(EnvironmentAware.class);
		beanFactory.ignoreDependencyInterface(EmbeddedValueResolverAware.class);
		beanFactory.ignoreDependencyInterface(ResourceLoaderAware.class);
		beanFactory.ignoreDependencyInterface(ApplicationEventPublisherAware.class);
		beanFactory.ignoreDependencyInterface(MessageSourceAware.class);
		beanFactory.ignoreDependencyInterface(ApplicationContextAware.class);

		// BeanFactory interface not registered as resolvable type in a plain factory.
		// MessageSource registered (and found for autowiring) as a bean.
		beanFactory.registerResolvableDependency(BeanFactory.class, beanFactory);
	}
```

所以说Spring bean的维护和生命周期的管理均在BeanFactory的实现类中，绝大多数是指的`DefaultListableBeanFactory`

而且ApplicationContext是BeanFactory的一个子类，前者还更强，可以通过注解获取bean

### Spring应用上下文

### 面试题

什么是BeanFactory和FactoryBean的区别？

BeanFactory是IOC的底层容器

FactoryBean是创建Bean的一种方式，帮助实现复杂的初始化逻辑，例如我们普通的pojo去实现这个接口，重写getObject()方法，这个方法会被容器调用，也就是说容器getBean的时候获取的是getObject的实现。

但是这种创建Bean的方式已经很少用了一般都被@Bean注解代替了

## 4 spring创建Bean

@Import、@Component方式进行导入组件

```java
@Import(CreateUserBean.Config.class)
public class CreateUserBean {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext();
        annotationConfigApplicationContext.register(CreateUserBean.class);
        //自定义注册
        registerUserBeanDefinition(annotationConfigApplicationContext);
        //启动上下文
        annotationConfigApplicationContext.refresh();
        System.out.println("user的类型:"+annotationConfigApplicationContext.getBeansOfType(User.class));
        System.out.println("user的类型:"+annotationConfigApplicationContext.getBeansOfType(Config.class));
        //关闭应用上下文
        annotationConfigApplicationContext.close();
    }

    public static void registerUserBeanDefinition(BeanDefinitionRegistry registry,String beanName){
        BeanDefinitionBuilder beanDefinitionBuilder = genericBeanDefinition(User.class);
        beanDefinitionBuilder.addPropertyValue("name","张三")
                .addPropertyValue("age",13);
        if (StringUtils.hasText(beanName)){
            registry.registerBeanDefinition(beanName,beanDefinitionBuilder.getBeanDefinition());
        }else {
            BeanDefinitionReaderUtils.registerWithGeneratedName(beanDefinitionBuilder.getBeanDefinition(),registry);
        }
    }
    public static void registerUserBeanDefinition(BeanDefinitionRegistry registry){
        registerUserBeanDefinition(registry,null);
    }
    //注解注入
    @Component
    static class Config {
        @Bean(name = {"user","bieminguser"})
        public User getUser() {
            return new User() {{
                setName("zhangsan");
                setAge(12);
            }};
        }
    }
}

```

spring的初始化与销毁，看代码所示

```java
public class InitBeanDemo {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext();
        applicationContext.register(InitBeanDemo.class);
        applicationContext.refresh();
        System.out.println("启动上下文");
        applicationContext.getBean(UserFactory.class);
        applicationContext.close();
    }
    @Bean(initMethod = "customizeInitMethod",destroyMethod = "customizeDestroy")
    @Lazy
    public UserFactory getUserFactory(){
        return new DefaultUserFactory();
    }
}
```

```java
public class DefaultUserFactory implements UserFactory , InitializingBean, DisposableBean {

    @PostConstruct
    public void initMethod(){
        System.out.println("注解初始化中");
    }

    public void customizeInitMethod(){
        System.out.println("自定义方法初始化");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("接口实现初始化");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("接口是实现注销");
    }

    public void customizeDestroy(){
        System.out.println("自定义方法销毁");
    }

    @PreDestroy
    public void preDestroy(){
        System.out.println("注解方法销毁中");
    }
}

```

`applicationContext.getBeanFactory().registerSingleton();`用于注册外部bean

### 面试题

什么是BeanDefinition?

