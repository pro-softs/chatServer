var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});
io.on('connection',function(socket){
    console.log('one user connected '+socket.id);
    socket.on('message',function(data){
        var sockets = io.sockets.sockets;
        sockets.forEach(function(sock){
            if(sock.id != socket.id)
            {
                sock.emit('message',data);
            }
        });
    });
    socket.on('disconnect',function(){
        console.log('one user disconnected '+socket.id);
    });
});

http.listen(server_port,function(){
    console.log('server listening on port ' + server_port + 'ip_address' + server_ip_address);
});