# messager

[DEMO地址](http://mx.mirreal.net)

## 功能与使用说明

### 多人聊天及私密对话

![login](public/img/login.jpg)

首次进入需要登陆，输入用户名之后点击[登陆]即可计入主界面。

![main](public/img/main.jpg)

可以看到一个用户列表，显示当前在线的所有用户。

在底部是一个功能选项卡，点击[聊天]则进入聊天界面。

![](public/img/chat1.jpg)

你会看到系统消息，默认是红色字体。

对话默认是公开的，即所有人都能看到，如下，想所有人发送消息。

![](public/img/chat2.jpg)

![](public/img/chat3.jpg)

当要对某一个人对话时，需转到[用户列表]，然后点击想进行对话的人。

![](public/img/chat4.jpg)

私聊对话是蓝色的，其他人也不能看到。

![](public/img/chat5.jpg)

### 多人绘图板

在底部选项卡，点击最右侧的[绘图板]即可进入。

![](public/img/paint1.jpg)

中间是一个带网格的绘图板。往下有三个选项，颜色，线条大小，和一个[clear]按钮。

![](public/img/paint2.jpg)

绘图是实时进行的，当一个用户在一个终端绘制，结果会立刻显示到其他人的绘图板上。

大家玩过你画我猜，应该就很清楚这种效果。

点击[clear]将清除画布所有内容。


## 开发技术与框架说明

### 概述

服务器端使用 Node.js 平台开发，并且使用其库 Socket.io 和 Express。

前端采用 Javascript 库 Jquery Mobile。绘图部分用 HTML5 Canvas 进行绘图控制。

最后用 Android 的 Webview 控件进行封装并打包。

### 1.Node.js

一个事件驱动 I/O 服务端 JavaScript 环境，基于 Google Chrome V8 引擎，近年来最受关注的平台。

### 2.Socket.io

Socket.io 是 Node.js 的一个库，包括 Server 和 Client，对 HTML5 WebSocket 接口封装，提供简洁的 API，能够实现实时响应，还可以对不支持 WebSocket 的进行降级处理，以及对超时等功能的支持。

### 3.Express

Node.js 上最流行的Web框架，也是官方唯一推荐。

### 4.Jquery Mobile

流行 Js 库 Jquery 的移动版，是一个为触控优化的框架，用于创建移动应用程序。

### 5.HTML5 Canvas

HTML5 中最令人兴奋的技术之一，为浏览器提供原生绘图功能，包含一个 2D 上下文和 3D 的 WebGl。

### 6.HTML5 WebSocket

WebSocket 是 HTML5 开始提供的一种浏览器与服务器间进行全双工通讯的网络技术。

## 项目展望

目前还很基础，例如没有保存数据，功能比较简陋。

考虑添加的功能：

- 接入MongoDB，将数据存入数据库中
- 文件传输
- 更完善的私密对话
- 动态表情

...

