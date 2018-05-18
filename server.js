var express = require('express'),
  app = express(),
  http = require('http'),
  socketIO = require('socket.io'),
  server, io;

app.get('/', function (req,res){
	res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(5000);

io = socketIO(server);

io.on('connection', function(socket){
    
    // need io.sockets.emit because all clients need this info
    io.sockets.emit('socket.joined', {
    	userId: socket.id,
    	room: socket.rooms[0]
    });

    socket.on('message.send', function(data){
    	// send messages to our new room and exposed itself to broadcasts
    	// messages sent to the room specified below are only delivered to socket members of newly created room
    	socket.broadcast.to(data.id).emit('message.sent', {
    		id:socket.id,
    		message:data.message
    	});
    });

	setInterval(function(){
		
		socket.emit('seconds.update', {
			time: new Date()
		});
	},2000);
});	