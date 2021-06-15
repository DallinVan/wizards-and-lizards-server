const Referee = require('../referee/referee');
const State = require('../state/State');
const Player = require('../models/Player');

const baseEndpoint = '/games/:gameId/players';
exports.addRoutes = (app) => {
    // Add player to game
    app.post(`${baseEndpoint}/:playerId`, function(req, res) {
        const gameId = req.params.gameId;
        const playerId = req.params.playerId;
        
        // Get the game associated with this gameId
        const game = State.getGame(gameId);
        if (!game) {
            res.status(404).send(`No game found with ID of '${gameId}'`);
            return;
        } else if (!Referee.canAddPlayerToGame(game, playerId)) {
            res.status(409).send(`Cannot add player '${playerId}' to the game.`);
            return;
        } else if (req.body.teamId && !Referee.canAddPlayerToTeam(game, playerId, req.body.teamId)) {
            res.status(409).send(`Cannot add player '${playerId}' to team '${teamId}'`);
            return;
        } else if (req.body.color && !Referee.canAssignColorToPlayer(game, playerId, req.body.color)) {
            res.status(409).send('Cannot update player\'s color.');
            return;
        }

        // Create new player
        const player = new Player(playerId);

        Referee.addPlayerToGame(game, player);
        
        if (req.body.teamId) {
            Referee.addPlayerToTeam(game, playerId, req.body.teamId);
        }
        if (req.body.color) {
            player.color = req.body.color;
        }

        if (Referee.readyToStartGame(game)) {
            Referee.startGame(game);
        }

        res.send(game);
        State.broadcastGameState(gameId);
        return;
    });

    app.put(`${baseEndpoint}/:playerId`, function(req, res) {
        const gameId = req.params.gameId;
        const playerId = req.params.playerId;

        // Get the game associated with this gameId
        const game = State.getGame(gameId);
        if (!req.body) {
            res.status(400).send('Bad request. No payload.');
            return;
        } else if (!game) {
            res.status(404).send(`No game found with ID of '${gameId}'`);
            return;
        } else if (!game.players.find(p => p.id === playerId)) {
            res.status(404).send(`No player with id ${playerId} associated with this game.`);
            return;
        } else if (req.body.teamId && !Referee.canAddPlayerToTeam(game, playerId, req.body.teamId)) {
            res.status(409).send(`Cannot add player '${playerId}' to team '${req.body.teamId}'`);
            return;
        } else if (req.body.color && !Referee.canAssignColorToPlayer(game, playerId, req.body.color)) {
            res.status(409).send('Cannot update player\'s color.');
            return;
        }

        // Find and update the player
        const player = game.players.find(p => p.id === playerId);
        if (req.body.teamId) {
            player.teamId = req.body.teamId;
        }
        if (req.body.color) {
            player.color = req.body.color;
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
    
        const game = State.getGame(gameId);
        if (!game) {
            res.status(404).send('Game not found.');
            return;
        }
        if (game.whosTurn !== playerId) {
            res.status(409).send(`Not your turn. It's ${game.whosTurn}'s turn.`);
            return;
        }
        if (!req.body.cardToPlay || !req.body.cardToPlay.suit || !req.body.cardToPlay.value) {
            res.status(400).send('Must play a card to take your turn.');
            return;
        }

        // TODO: check with referee if card can be played

        // Play the card and draw a new one (TODO: make the referee do this)
        const player = game.getPlayer(playerId);
        const cardToPlay = req.body.cardToPlay;
        player.deck.discardCard(cardToPlay);
        player.deck.draw(1);
    
        // Set the turn to be the next player 
        game.whosTurn = player.nextPlayer;
        State.broadcastGameState(gameId);
        res.send(game);
    });
};