class Game {
    constructor() {
        this.id = Math.floor(100000 + Math.random() * 900000).toString();
        this.status = 'created';
        this.numberOfPlayers = 4;
        this.numberOfJokers = 3;
        this.players = [];
        this.teams = [];
        this.whosTurn = null;
    }

    getPlayer(playerId) {
        return this.players.find(p => p.id === playerId);
    }

    getTeam(teamId) {
        return this.teams.find(id => id === teamId);
    }
}

module.exports = Game;