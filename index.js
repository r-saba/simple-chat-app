var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
})

io.on('connection', function(socket){
	socket.name = 'Anonymous';
	socket.broadcast.emit('chat message','user connected');
	socket.on('chat message', function(msg){
		if(msg.includes('/name')){
			let nickName = msg.substring(5).trim();
			socket.name = nickName
			console.log(socket.name);
		} else {
			let chatMessage = socket.name + ': ' + msg;
			io.emit('chat message', chatMessage);
		}
	});
	socket.on('disconnect', function(){
		socket.broadcast.emit('chat message','user disconnected');
	})
})

http.listen(3000, function(){
	console.log('listening on *:3000');
})