const State = require('../state/State');
const Game = require('../models/Game');

const baseEndpoint = '/games';
exports.addRoutes = (app) => {
    app.get(`${baseEndpoint}`, function(req, res) {
        res.send(State.games);
    });
    
    app.get(`${baseEndpoint}/:gameId`, function(req, res) {
        const gameId = req.params.gameId;
        const game = State.getGame(gameId);
        if (!game) {
            res.status(404).send(`Game with ID ${gameId} not found.`);
        }
        res.send(game);
    });
    
    app.post(`${baseEndpoint}`, function(req, res) {
        const numberOfPlayers = req.query.numberOfPlayers;
        
        let newGame = new Game();
        if (numberOfPlayers && !isNaN(numberOfPlayers)) {
            newGame.numberOfPlayers = numberOfPlayers;
        }

        State.games.push(newGame);
        res.send(newGame);
    });
    
    app.delete(`${baseEndpoint}/:gameId`, function(req, res) {
        const gameId = req.params.gameId;
        const gameToDelete = State.getGame(gameId);
        if (!gameToDelete) {
            res.status(404).send('Game not found, cannot delete.');
            return;
        }
    
        // Remove the game with gameId from the array of games
        State.games = State.games.filter(g => g.id !== gameId);
        res.send(gameToDelete);
    });
};