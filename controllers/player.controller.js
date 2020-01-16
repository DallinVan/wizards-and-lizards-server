const Referee = require('../referee/referee');
const State = require('../state/State');
const Player = require('../models/Player');

const baseEndpoint = '/games/:gameId/players';
exports.addRoutes = (app) => {
    // Add player to game
    app.post(`${baseEndpoint}/:playerId`, function(req, res) {
        const gameId = req.params.gameId;
        const playerId = req.params.playerId;
        const teamId = req.query.teamId; // Query param (optional)
        
        // Get the game associated with this gameId
        const game = State.getGame(gameId);
        if (!game) {
            res.status(404).send(`No game found with ID of '${gameId}'`);
            return;
        } else if (!Referee.canAddPlayerToGame(game, playerId)) {
            res.status(409).send(`Player ID '${playerId}' is already in use.`);
            return;
        } else if (teamId && !Referee.canAddPlayerToTeam(game, playerId, teamId)) {
            res.status(409).send(`Cannot add player '${playerId}' to team '${teamId}'`);
            return;
        }

        // Create new player
        const player = new Player(playerId);

        Referee.addPlayerToGame(game, player);
        
        if (teamId) {
            Referee.addPlayerToTeam(game, playerId, teamId);
        }

        if (Referee.readyToStartGame(game)) {
            Referee.startGame(game);
        }

        res.send(game);
        State.broadcastGameState(gameId);
        return;
    });

    // Remove player from game
    app.delete(`${baseEndpoint}/:playerId`, function(req, res) {
        const gameId = req.params.gameId;
        const playerId = req.params.playerId;

        // Get the game associated with this gameId
        const game = State.getGame(gameId);
        console.log(game);
        if (!game) {
            res.status(404).send(`No game found with ID of '${gameId}'`);
            return;
        } else if (!game.getPlayer(playerId)) {
            res.status(404).send(`Player with ID '${playerId}' is not associated with this game. Cannot remove.`);
            return;
        }

        Referee.removePlayerFromGame(game, playerId);
        res.send(game);
        return;
    });

    app.post(`${baseEndpoint}/:playerId/turn`, function(req, res) {
        const gameId = req.params.gameId;
        const playerId = req.params.playerId;
    
        const game = getGame(gameId);
        if (!game) {
            res.status(404).send('Game not found.');
            return;
        }
        if (game.whosTurn !== playerId) {
            res.status(409).send(`Not your turn. It's ${game.whosTurn}'s turn.`);
            return;
        }
    
        const player = game.getPlayer(playerId);
        game.whosTurn = player.nextPlayer;
        res.send(game);
        State.broadcastGameState(gameId);
    });
};