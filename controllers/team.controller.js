const State = require('../state/State');
const Referee = require('../referee/referee');

const baseEndpoint = '/games/:gameId/teams'
exports.addRoutes = (app) => {
    app.get(baseEndpoint, function(req, res) {
        const gameId = req.params.gameId;
        const game = State.getGame(gameId);
        if (!game) {
            res.status(404).send('Game not found');
        }

        res.send(game.teams);
    });

    app.post(`${baseEndpoint}/:teamId`, function(req, res) {
        const gameId = req.params.gameId;
        const teamId = req.params.teamId;

        const game = State.getGame(gameId);
        if (!game) {
            res.status(404).send('Game not found');
        } else if (!Referee.canAddTeamToGame(game, teamId)) {
            res.status(409).send('Cannot add team to game');
        }

        Referee.addTeamToGame(game, teamId);
        res.send(game);
    });
};