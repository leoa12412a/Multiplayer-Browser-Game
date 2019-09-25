# 如何製作一個簡單的多人網頁遊戲

這次的主題是延續上一篇(<a href="https://github.com/leoa12412a/Nodejs-websocket">Nodejs-websocket</a>)，一樣使用nodejs來進行開發，這次還參考了<a href="https://hackernoon.com/how-to-build-a-multiplayer-browser-game-4a793818c29b">坦克大戰製作</a>，這次使用的模組式socket.io和Express框架。

### 首先我們使用npm安裝模組
```
npm install --save express socket.io
```


### 建立一個server.js，並載入模組，記得使用的port需要開啟防火牆

```
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 8888);

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));      //載入index.html
});

server.listen(8888, function() {
  console.log('Starting server on port 8888');                //監聽8888port並console.log訊息
});
```

### 建立一個index.html，並寫入以下代碼，注意!這裡我們還引入/socket.io/socket.io.js，這由剛剛安裝的socket.io提供的
```
<html>
  <head>
    <title>A Multiplayer Game</title>
    <style>
      canvas {
        width: 800px;
        height: 600px;
        border: 5px solid black;
      }
    </style>
    <script src="/socket.io/socket.io.js"></script>
  </head>
  <body>
    <canvas id="canvas"></canvas>
  </body>
</html>
```

到這裡就可以在http://your_domain_name_or_ip:8888看到剛剛寫好的index.html

### socket.io指令

這邊先介紹幾個會用到的指令，方便了解一下面的程式

1.監聽是否有使用者連線，function(socket)裡面的socket帶有許多使用者的資訊，例如:socket.id
```
io.on('connection', function(socket) {

});
```

2.使用io發送訊息，這裡發送key為message、value為hi!的訊息。
```
io.sockets.emit('message', 'hi!');
```

3.監聽指定key傳來的訊息，假設傳來的訊息為['new_player'] = "Hi"，那麼收到的data就會等於Hi，這個function只會監聽key為new_player的訊息
```
socket.on('new_player',function(data){

});
```

4.當有使用者離開時觸發
```
socket.on('disconnect', () => {

});
```

### 告訴server我是新的使用者

在index.html的部分加入以下程式碼

```

```
