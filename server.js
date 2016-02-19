var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

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

http.listen(app.get('port'), app.get('ip'), function(){
    console.log('server listening on at %s:%d', app.get('ip'), app.get('port'));
});