# spring编程模型

## 1 面向对象编程

### 1.1 spring契约接口

#### 1.1.1 Aware接口

继承于**Aware**接口的接口都有一个set方法用于接口回调 

#### 1.1.2 BeanPostProcessor

```java
//spring的一个后置处理器，默认不做任何处理
public interface BeanPostProcessor {
    @Nullable
    default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }
    @Nullable
    default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }
}
```

### 1.2 设计模式

#### 1.2.1 观察者模式

`SimpleApplicationEventMulticaster`主要通过`multicastEvent` 方法获取事件进行一个通知其他观察者

```java
//基于java的标准事件
public class SimpleApplicationEventMulticaster extends AbstractApplicationEventMulticaster {
	@Override
	public void multicastEvent(ApplicationEvent event) {
		multicastEvent(event, resolveDefaultEventType(event));
	}

	@Override
	public void multicastEvent(final ApplicationEvent event, @Nullable ResolvableType eventType) {
		ResolvableType type = (eventType != null ? eventType : resolveDefaultEventType(event));
		Executor executor = getTaskExecutor();
		for (ApplicationListener<?> listener : getApplicationListeners(event, type)) {
			if (executor != null) {
				executor.execute(() -> invokeListener(listener, event));
			}
			else {
				invokeListener(listener, event);
			}
		}
	}

}
```

#### 1.2.1 组合模式 

```java
public class CompositeCacheManager implements CacheManager, InitializingBean {
	//自己进行了一个CacheManager的一个实现，并且组合了其他缓存实现	
   private final List<CacheManager> cacheManagers = new ArrayList<>();
}
```

#### 1.2.2 模板模式

例如：`JdbcTemplate`、`RestTemplate` 

