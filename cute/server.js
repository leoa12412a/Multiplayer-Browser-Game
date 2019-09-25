var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 8888);

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(8888, function() {
  console.log('Starting server on port 8888');
});

var players = {};

io.on('connection', function(socket) {
	
	socket.on('new_player',function(user_color){
		
		players[socket.id] = {x:300,y:300,color:user_color};
		
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
	
	socket.on('disconnect', () => {
		delete players[socket.id];
	});
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);