var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080 || 3003);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});
io.on('connection',function(socket){
    console.log('one user connected '+socket.id);
    socket.on('message',function(data){

       
        Object.keys(io.sockets.sockets).forEach(function(id){
            if(socket.id != id)
            {
                io.to(id).emit('message', data);
               
            }
        });
    });
    socket.on('disconnect',function(){
        console.log('one user disconnected '+socket.id);
    });
});

http.listen(app.get('port'), function(){
    console.log('server listening on at %d', app.get('port'));
});