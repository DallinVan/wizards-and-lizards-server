const Moniker = require('moniker');

class Game {
    constructor() {
        this.id = Math.floor(100000 + Math.random() * 900000).toString();
        this.name = Moniker.choose(); // Random name
        this.status = 'created';
        this.numberOfPlayers = 4;
        this.numberOfJokers = 3;
        this.players = [];
        this.teams = [];
        this.whosTurn = null;
        this.firstPlayer = null;
        this.colors = [
            'red',
            'orange',
            'yellow',
            'green',
            'blue',
            'purple',
            'black',
            'white'
        ];
        // this.colors = [
        //     '#e60000',
        //     '#ff6600',
        //     '#ffcc00',
        //     '#33cc33',
        //     '#0066ff',
        //     '#cc00cc',
        //     'black',
        //     'white'
        // ];
    }

    getPlayer(playerId) {
        return this.players.find(p => p.id === playerId);
    }

    getTeam(teamId) {
        return this.teams.find(id => id === teamId);
    }
}

module.exports = Game;