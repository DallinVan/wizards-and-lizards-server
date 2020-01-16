class State {
    constructor() {
        this.games = [];
        this.io = null;
    }

    getGame(gameId) {
        return this.games.find(g => g.id === gameId);
    }

    broadcastGameState(gameId) {
        const game = this.getGame(gameId);
        this.io.to(gameId.toString()).emit('game_state', game);
    }
}

module.exports = new State();