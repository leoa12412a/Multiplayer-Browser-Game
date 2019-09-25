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

![image](https://github.com/leoa12412a/Multiplayer-Browser-Game/blob/master/1.PNG)</br>

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

在index.html的部分加入以下程式碼，傳送new_player給server

```
<script>
  var socket = io();    //宣告io

  socket.emit('new_player');
</script>
```

在server.js加入以下程式碼，監聽有沒有使用者連線 且 傳送new_player，然後輸出使用者的id，並將初始位置存到players陣列內

```
var players = {};

io.on('connection', function(socket) {
	
	socket.on('new_player',function(){
		
    console.log(socket.id);
    
		players[socket.id] = {x:300,y:300};

  });
});
```

重啟server.js且重新整理http://your_domain_name_or_ip:8888，就可以看到server端輸出使用者id

![image](https://github.com/leoa12412a/Multiplayer-Browser-Game/blob/master/2.PNG)</br>

### 監聽使用者端的案件控制 及 server廣播所有人位置 

index.html 下面js以下，先宣告一個movement陣列來儲存是否有移動，當按下去就是ture，拿起來則是false，且使用setInterval函數每1秒鐘送出60次

```
<script>
	var socket = io();    //宣告io

	socket.emit('new_player');
	
	var movement = {
		up: false,
		down: false,
		left: false,
		right: false
	}
	
	document.addEventListener('keydown', function(event) {
		switch (event.keyCode) {
			case 65: // A
				movement.left = true;
				break;
			case 87: // W
				movement.up = true;
				break;
			case 68: // D
				movement.right = true;
				break;
			case 83: // S
				movement.down = true;
				break;
		}
	});
	
	document.addEventListener('keyup', function(event) {
		switch (event.keyCode) {
			case 65: // A
				movement.left = false;
				break;
			case 87: // W
				movement.up = false;
				break;
			case 68: // D
				movement.right = false;
				break;
			case 83: // S
				movement.down = false;
				break;
		}
	});
	
	setInterval(function() {
		socket.emit('movement', movement);
	}, 1000/60);
</script>
```

在server.js就要負責接收，且根據id把對應使用者的位置計算後重新存入陣列，並每秒傳送60給所有使用者，所以接收程式會變成下方的樣子

```
io.on('connection', function(socket) {
	
	socket.on('new_player',function(){
		
		players[socket.id] = {x:300,y:300};

	});
	
	socket.on('movement',function(data){
		
		var player = players[socket.id];
		
		if(data.left) 
		{
			if(player.x!= 10)
			{
				player.x -= 5;
			}
		}
		if(data.up) 
		{
			if(player.y!= 10)
			{
				player.y -= 5;
			}
		}
		if(data.right) 
		{
			if(player.x!= 790)
			{
				player.x += 5;
			}
		}
		if(data.down) 
		{
			if(player.y!= 590)
			{
				player.y += 5;
			}
		}
		
	});

});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
```

在index.html裡加上監聽server回傳值可以輸出所有
```
socket.on('state',function(players_data){

	for(var id in players_data) {
		var play_pos = players_data[id];
		
		console.log('x:' + play_pos.x + '| y:' + play_pos.y);
	}

});
```

![image](https://github.com/leoa12412a/Multiplayer-Browser-Game/blob/master/3.PNG)</br>

### 把接收到的參數全部畫成球

這邊會用到js繪圖api<a href="https://www.w3school.com.cn/html5/html_5_canvas.asp">canvas</a>這邊我們使用畫成圓形的方法，修改原本接收所有使用者位置的function

```
var canvas = document.getElementById('canvas');
				
canvas.width = 800;

canvas.height = 600;

var context = canvas.getContext('2d');

socket.on('state',function(players_data){

	context.clearRect(0, 0, canvas.width, canvas.height);	//清除上一次畫面
	
	for(var id in players_data) {
		var play_pos = players_data[id];
		context.fillStyle = "red";
		context.beginPath();
		context.arc(play_pos.x, play_pos.y, 15, 0, Math.PI*2);
		context.fill();
	}

});
```

在server.js可以把離開的玩家陣列給刪除
```
socket.on('disconnect', () => {
	delete players[socket.id];
});
```

順利運作得話，會看到螢幕上有一顆圓球

![image](https://github.com/leoa12412a/Multiplayer-Browser-Game/blob/master/4.PNG)</br>
