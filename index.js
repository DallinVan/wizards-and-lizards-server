// Express imports
const express = require('express');
const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Http and Socket.io imports
const http = require('http').Server(app);
const io = require('socket.io', {
    pingTimeout: 60000,
})(http);

// const Referee = require('./referee/referee');
// const Game = require('./models/Game');
// const Player = require('./models/Player');
const State = require('./state/State');
State.io = io;

// Bootstrap controllers to app
require('./controllers/game.controller').addRoutes(app);
require('./controllers/player.controller').addRoutes(app);
require('./controllers/team.controller').addRoutes(app);

// app.get('/', function(req, res) {
//     // res.send('Hello Manda!');
//     res.sendFile('/Users/DallinVan/Projects/wizards-and-lizards-server/index.html');
// });

// Socket.IO ----------------------------------------
io.sockets.on('connection', function(socket) {

    socket.on('join_game', function(gameId) {
        console.log(gameId);
        const game = getGame(gameId);
        if (!game) {
            socket.emit('join_game_result', false);
        }
        // Join channel specified by the gameId
        socket.join(gameId.toString());
        socket.emit('join_game_result', true);
    });

    socket.on('leave_game', function(gameId) {
        const game = getGame(gameId);
        if (!game) {
            socket.emit('leave_game_result', false);
        }
        socket.leave(gameId.toString());
        socket.emit('leave_game_result', true);
    });

    socket.on('disconnect', function() {
        // TODO
    });
});

// 404 catch all routed
app.all('*', (req, res) => {
    res.status(404).send('Not found.');
});

const server = http.listen(process.env.PORT || 8080, function() {
    console.log('listening on *:8080');
});

// Helper methods ----------------------------

function getGame(gameId) {
    const game = State.games.find(g => g.id === gameId);
    return game;
}