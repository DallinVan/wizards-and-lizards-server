const Deck = require('./Deck');

class Player {
    constructor(playerId) {
        this.id = playerId;
        this.teamId = null;
        this.nextPlayer = null;
        this.deck = null; // new Deck(3); // Hardcoded to 3 jokers for now
    }
}

module.exports = Player;