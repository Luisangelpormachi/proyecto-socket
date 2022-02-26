var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var messages = [];
var usuarios = [];

var messages_private = [{

    text: 'Bienvenido te saluda el servidor',
    author: 'Servidor socket',
    user_id: 0,

}];

app.use(express.static('public'));

// app.get('/hello', function(req, resp){
//     resp.status(200).send('Hello word!');
// });

io.on('connection', function(socket){
    console.log('Alguien se a conectado con Sockets \n Id: '+socket.id);
    //agregar usuarios
    usuarios.push(socket.id);
    //enviar usuarios a todos los usuarios conectados
    io.sockets.emit('usuarios', usuarios);

    //enviar mensaje privado de bienvenida a usuario nuevo
    messages_private[0]['user_id'] = socket.id;
    io.to(socket.id).emit('message_private', messages_private);


    socket.on('new-message', function(data, selected){
        
        if(selected == 'todos'){
            messages.push(data);
            io.sockets.emit('messages', messages, 'todos');
        }else{
            io.to(selected).emit('messages', data, 'private');
        }
    });

    socket.on("disconnect", () => {
        console.log("se desconecto el socket: "+socket.id);//devolvemos el  id del usuario desconectado
        //quitar los id del usuario desconectado
        usuarios.forEach(function(usuario, index, object) {
            if(usuario == socket.id){
                usuarios.splice(index, 1);
            }
        });
        //enviar usuarios a todos los usuarios conectados
        io.sockets.emit('usuarios', usuarios);
    });
});



server.listen(8080, function(){
    console.log('El servidor esta corriendo en el puerto http://localhost/8080');
});