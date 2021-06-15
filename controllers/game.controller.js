const State = require('../state/State');
const Game = require('../models/Game');

const baseEndpoint = '/games';
exports.addRoutes = (app) => {
    app.get(`${baseEndpoint}`, function(req, res) {
        const status = req.query.status;

        let games = State.games;
        if (status) {
            games = games.filter(g => g.status === status);
        }

        res.send(games);
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
        if (
            !req.body
            || !req.body.team1
            || !req.body.team2
            || !req.body.numberOfPlayers
            || !req.body.numberOfJokers
            || !req.body.ruleSet
        ) {
            res.status(400).send('Bad request');
        }
        
        let newGame = new Game();
        newGame.numberOfPlayers = req.body.numberOfPlayers;
        newGame.numberOfJokers = req.body.numberOfJokers;
        newGame.teams.push(req.body.team1);
        newGame.teams.push(req.body.team2);

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