const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io', {
    pingTimeout: 60000,
})(http);

app.get('/', function(req, res) {
    // res.send('Hello Manda!');
    res.sendFile('/Users/DallinVan/Projects/wizards-and-lizards-server/index.html');
});

var gameState = {
    players: []
};
const connections = [];

// io.sockets.on('connection', function(socket) {
//     console.log('a user connected');
    
//     socket.on('disconnect', function(){
//         console.log('user disconnected');
//     });

//     socket.on('message', function(message) {
//         console.log('message recieved: ' + message);
//         socket.emit('new_message', message);
//     });

    // ---------------------------------------------------------
    // socket.on('join', function(username) {
    //     socket.username = username;
    //     gameState.players.push(username);
    //     io.emit('game_state', gameState);
    // });

    // socket.on('leave', function(username) {
    //     console.log(username + ' disconnected');
    //     gameState.players = gameState.players.filter(player => player !== username);

    //     io.emit('game_state', gameState);
    // });

    // socket.on('take_turn', function(message) {
    //     io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    // });
// });

// io.on('connection', function(socket){
io.sockets.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('message', function(message) {
        console.log('message recieved: ' + message);
        io.sockets.emit('new_message', message);
    });
});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});