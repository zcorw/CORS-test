# CORS 演示
## 快速开始
这里默认各位已经安装好了 git 和 nodejs。首先找个空白文件夹执行下面命令

```
git clone https://github.com/zcorw/CORS-test.git
```
执行完毕后

```
cd CORS-test
node server.js
```
测试案例就运行起来。这里使用了 3000 和 4000 两个端口，3000 为服务端，4000 为客户端。打开浏览器，在浏览器中输入 127.0.0.1:4000，就能打开本次案例网页。

## 案例分析
![CORS](https://i.postimg.cc/bNBZH5NC/CORS.png "案例页面")

我在这里列出了 CORS 请求中大概会遇上的几种情况，具体关于 CORS 的内容，可以查看 [该文档](https://github.com/zcorw/zcorw.github.io/blob/master/HTTP%E8%B7%A8%E5%9F%9F%E8%AE%BF%E9%97%AE.md)。

### 简单请求没有返回 Access-Control-Allow-Origin 请求头
```
GET /simple/fail HTTP/1.1
Host: 127.0.0.1:3000
Origin: http://127.0.0.1:4000/
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36
Accept: */*
Referer: http://127.0.0.1:4000/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Connection: keep-alive


HTTP/1.1 200 OK
Content-Type: text/plain
Date: Sun, 10 Mar 2019 05:47:52 GMT
Transfer-Encoding: chunked
Proxy-Connection: keep-alive

Hello, World
```
在响应报文中未传 `Access-Control-Allow-Origin` 首部字段，查看浏览器控制台 console 栏目会看到一条 Error 信息：

*No 'Access-Control-Allow-Origin' header is present on the requested resource.*

### 简单请求返回 Access-Control-Allow-Origin 请求头
```
GET /simple/success HTTP/1.1
Host: 127.0.0.1:3000
Origin: http://127.0.0.1:4000/
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36
Accept: */*
Referer: http://127.0.0.1:4000/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Connection: keep-alive


HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: text/plain
Date: Sun, 10 Mar 2019 06:20:49 GMT
Transfer-Encoding: chunked
Proxy-Connection: keep-alive

Hello, World
```
在响应报文中增加第2行的 `Access-Control-Allow-Origin: *` 后，返回的 Hellow, World 终于被浏览器放行，弹出表示成功的弹窗。

### 预检请求正常返回
```
//预检请求
OPTIONS /preflighted/success HTTP/1.1
Host: 127.0.0.1:3000
Access-Control-Request-Method: POST
Origin: http://127.0.0.1:4000/
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36
Access-Control-Request-Headers: content-type
Accept: */*
Referer: http://127.0.0.1:4000/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Connection: keep-alive


HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Origin: *
Content-Type: text/plain
Date: Sun, 10 Mar 2019 07:16:01 GMT
Transfer-Encoding: chunked
Proxy-Connection: keep-alive
```
在本次请求，尝试上传一条 JSON 数据，浏览器自动帮我们发起一个预检请求，请求报文中增加两个首部字段：`Access-Control-Request-Method` 和 `Access-Control-Request-Headers`。这两个字段告知服务器正式请求将使用的方法和将携带的首部字段。

服务端在检查过请求报文中的字段后，允许跨域请求的话要在响应报文中加入 `Access-Control-Allow-Methods`、`Access-Control-Allow-Headers` 和 `Access-Control-Allow-Origin`。

```
//正式请求
POST /preflighted/success HTTP/1.1
Host: 127.0.0.1:3000
Content-Length: 6
Origin: http://127.0.0.1:4000/
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36
CONTENT-TYPE: application/json
Accept: */*
Referer: http://127.0.0.1:4000/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Connection: keep-alive

{a: 1}


HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: text/plain
Date: Sun, 10 Mar 2019 08:24:04 GMT
Transfer-Encoding: chunked
Proxy-Connection: keep-alive

Hello, World
```
完成预检请求后，浏览器会帮我们发出正式请求，通过浏览器检查成功通过。

### 预检请求没有返回请求头
```
OPTIONS /preflighted/fail HTTP/1.1
Host: 127.0.0.1:3000
Access-Control-Request-Method: POST
Origin: http://127.0.0.1:4000/
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36
Access-Control-Request-Headers: content-type
Accept: */*
Referer: http://127.0.0.1:4000/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Connection: keep-alive

HTTP/1.1 200 OK
Content-Type: text/plain
Date: Sun, 10 Mar 2019 06:29:22 GMT
Transfer-Encoding: chunked
Proxy-Connection: keep-alive

Hello, World
```
当浏览器发送 `OPTIONS` 预检请求后，服务端在响应报文中未做任何处理，在控制台可以看到一条 Error 信息：

*Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.*

### 预检请求新增加一个字段，服务端未允许该字段
```
OPTIONS /preflighted/fail/field HTTP/1.1
Host: 127.0.0.1:3000
Access-Control-Request-Method: POST
Origin: http://127.0.0.1:4000/
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36
Access-Control-Request-Headers: content-type,x-field
Accept: */*
Referer: http://127.0.0.1:4000/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Connection: keep-alive

HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Origin: *
Content-Type: text/plain
Date: Sun, 10 Mar 2019 06:49:55 GMT
Transfer-Encoding: chunked
Proxy-Connection: keep-alive

Hello, World
```

在本次请求报文中 `Access-Control-Request-Headers` 增加了一个 "x-field" 字段，这是本次请求增加的一个首部字段。服务端在响应报文中 `Access-Control-Allow-Headers` 未加入 "x-field" 这条，响应被浏览器拦截，在控制台我们可以看到：

*Request header field x-field is not allowed by Access-Control-Allow-Headers in preflight response.*

### 请求携带Cookies正常返回
CORS 请求默认不会携带 Cookie，想要让浏览器带上 Cookie 必须在 AJAX 设置: 

```
var invocation = new XMLHttpRequest();
invocation.withCredentials = true;
```

```
GET /cookies/success HTTP/1.1
Host: 127.0.0.1:3000
Origin: http://127.0.0.1:4000/
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36
Accept: */*
Referer: http://127.0.0.1:4000/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Cookie: server=123
Connection: keep-alive


HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Origin: http://127.0.0.1:4000
Access-Control-Allow-Credentials: true
Content-Type: text/plain
Date: Sun, 10 Mar 2019 15:12:42 GMT
Transfer-Encoding: chunked
Proxy-Connection: keep-alive

123
```
在设置了 `withCredentials=true` 后请求报文中就会带上 Cookie，响应报文中要带上 `Access-Control-Allow-Credentials: true`，浏览器就能正常收到消息，弹出之前设置的 cookie 值。

### 请求携带Cookies, Access-Control-Allow-Origin 值为 *
```
GET /cookies/fail/origin HTTP/1.1
Host: server.com
Origin: http://client.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36
Accept: */*
Referer: http://client.com/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Cookie: server=123
Connection: keep-alive


HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Content-Type: text/plain
Date: Sun, 10 Mar 2019 15:31:35 GMT
Transfer-Encoding: chunked
Proxy-Connection: keep-alive
```

服务端返回的 `Access-Control-Allow-Origin` 的值为通配符 "*"，响应会被浏览器拦截，查看控制台的 Error 信息：

*The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '\*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.*

### 请求携带Cookies, 响应未携带Access-Control-Allow-Credentials
```
GET /cookies/fail/credentials HTTP/1.1
Host: server.com
Origin: http://client.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36
Accept: */*
Referer: http://client.com/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Cookie: server=123
Connection: keep-alive


HTTP/1.1 200 OK
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Origin: http://client.com
Content-Type: text/plain
Date: Sun, 10 Mar 2019 15:44:58 GMT
Transfer-Encoding: chunked
Proxy-Connection: keep-alive
```

服务端响应请求未携带 `Access-Control-Allow-Credentials`，响应会被浏览器拦截，查看控制台的 Error 信息：

*The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.*