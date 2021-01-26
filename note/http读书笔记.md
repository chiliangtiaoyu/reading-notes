## 03

user agent

## 04

### TCP/IP

UDP 

ICMP

ARP

TCP

URL URI区别

HTTPS  HTTP over SSL/TLS 七层模型哪一层

### SSL 

SSL和TLS演变关系

对称加密，非对称加密，摘要算法，数字签名，数字证书

### 代理

透明代理，匿名代理，正向代理，反向代理

#### 代理中间层

负载均衡，数据处理，安全防护，内容缓存

## 05

### TCP

可靠的，字节流的，有序发有序收，有状态的

### HTTP 

HTTP头部组成：起始行，头部字段集合，正文消息

header body之间必须有一空行

#### start line

request:请求方法，请求目标，版本号

response:版本号，状态码，原因



## 10

1.get:获取资源

2.put:类似post，修改资源

3.post:上传资源

4.delete:删除资源

5.head:获取资源原信息

6.trace:追踪请求，链路诊断

7.connect:建立特殊隧道

8.options:列出可以对资源实行的方法

## 12

状态码

1xx:提示信息，表示还在处理，协议处于中间状态

2xx:表示服务端已经成功处理报文

3xx:重定向

4xx:客户端有问题，请求方法不对

5xx:服务端错误



## 13 14

### HTTP特点

1.灵活可扩展 没写死

2.可靠传输

3.应用层协议

4.请求-应答模式 

5.无状态 没有记忆

6.性能 不算差不够好，对头阻塞 对一个域名采用多个

7.不安全 明文

## 15 16

### header

If-Modified-Since:

Content-Length:长度，分段不用，必须准确否则就会截断



Accept: 服务端不用

Content-Type: 



Accept-Encoding: 压缩

Content-Encoding:



Accept-language:

Contet-language:



Accept-charset: 接受的字符集

...Content-Type:charset=utf-8

q=0.9 权重



 Transfer-Encoding：chunked 和 content-length互斥 响应报文里 分几次响应

Range: bytes x-y 多少到多少部分

Accept-Ranges:bytes 表示支持范围请求none表示不支持

Content-Range:bytes 0-10/128

## 17

1.1怎么保持长链接 优势，tcp 慢启动 拥塞控制

怎么防止长链接 几种方式

对头阻塞原因 因为不阻塞不知道是谁的请求 所以只能等待 解决办法



## 20 HTTP缓存

 Cache-Control:  max-age no-store no-cache no-revalidate

If-modified-since last-modified:

 If-None-Match 

expires



## 23

机密性 完整性 身份认证 不可否认

SSL 起源 标准化年份

TLS1.2 1.3

TLS:

## 24

对称加密：AES作为DES的替代者 ChaCha20较为安全

非对称加密：RSA整数分解难题 ECC椭圆曲线离散对数

ECC: ECDHE用于秘钥交换 ECDSA用于数字签名 

160ECC=1024RSA 



## 25

完整性：摘要算法

数字签名：反过来用 私钥加密公钥解密，实现身份认证，不可否认，因为私钥是唯一被拥有的，这个过程叫签名和验签，只需要加密摘要就行了

公钥信任问题，

## 26

RSA pre-master靠客户端算出来

ECC  ECDHE 秘钥交换算法，通过这个ECDHE参数算出来

## 27 TLS1.3

对称AES、ChaCha20 废弃des

摘要 sha256 384

非对称 ECC 废弃RSA

优化：向后兼容，客户端带上多余的1.3信息，客户端能识别就1.3

压缩到1RTT 因为DCDHE公钥参数+A随机数 第一次握手就已经传输了，主密钥的三个材料完成

所以第二次服务端就 Change Cipher Spec 

## 28

计算密集型 内建AES优化

SSL加速卡，加解密时调用

证书用ECDSA签名，客户端解密验证知道谁签发的

 OCSP 装订，由服务端事先访问，一起发给客户端 免去客户端查询CA服务

1RTT:

会话复用 sessionid控制，服务端压力大

 session_ticket 由服务端存储变为，客户端存储，服务端验证有效期

0RTT：

预共享秘钥

发送ticket的时候带上应用数据 pre-shared-key(重放危机)



# 30

http2

HPACK算法 头部压缩算法 建立字典 哈夫曼编码压缩

二进制好处？

二进制分帧，虚拟的流 每个消息帧会有个流id，为了多路复用多核请求可合并一个，解决了线头阻塞

为什么是虚拟流

一个id就是一个请求 并行 根据流id分组 每个分组里的帧有严格先后顺序

流id不同乱序 流id相同顺序

 语法有状态，语义无状态 

