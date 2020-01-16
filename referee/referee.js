const Deck = require('../models/Deck');

// The referee is stateless. Enforces game rules.

exports.canAddPlayerToGame = (game, playerId) => {
    return !game.getPlayer(playerId);
}

exports.addPlayerToGame = (game, player) => {
    // Add the new player to the game
    game.players.push(player);

    if (game.players.length > 1) {
        game.players[game.players.length - 2].nextPlayer = game.players[game.players.length - 1].id
        player.nextPlayer = game.players[0].id;
    }

    // If this is the first player to join the game, set it to be their turn
    if (game.players.length === 1) {
        game.whosTurn = game.players[0].id;
    }
}

exports.canAddTeamToGame = (game, teamId) => {
    return game.teams.indexOf(teamId) < 0;
}

exports.addTeamToGame = (game, teamId) => {
    game.teams.push(teamId);
}

exports.removePlayerFromGame = (game, playerId) => {
    if (game.players.length === 0) {
        return;
    }

    const i = game.players.findIndex(p => p.id === playerId);
    const playerToRemove = game.players[i];
    if (game.players.length === 1) {
        game.players.splice(0, 1);
    } else if (game.players.length === 2) {
        game.players.splice(i, 1);
        game.players[0].nextPlayer = null;
    } else {
        // Get previous player
        const prevPlayer = game.players.find(p => p.nextPlayer === playerToRemove.id);

        // Get next player
        const nextPlayer = game.players.find(p => p.id === playerToRemove.nextPlayer);

        prevPlayer.nextPlayer = nextPlayer.id;

        game.players.splice(i, 1);
    }

    if (playerToRemove.id === game.whosTurn) {
        game.whosTurn = playerToRemove.nextPlayer;
    }
}

exports.canAddPlayerToTeam = (game, playerId, teamId) => {
    const team = game.teams.find(t => t === teamId);
    const player = game.players.find(p => p.id === playerId);
    
    // If the team exists and either the player doesn't exist or the player isn't assigned to a team yet
    return team && (!player || !player.team);
}

exports.addPlayerToTeam = (game, playerId, teamId) => {
    const player = game.players.find(p => p.id === playerId)
    if (!exports.canAddPlayerToTeam(game, playerId, teamId) || !player) {
        throw new Error('Invalid operation, cannot add player to team.');
    }

    player.teamId = teamId;
}

exports.readyToStartGame = (game) => {
    // Basic checks to ensure game is ready to begin
    if (
        !game
        || game.teams.length !== 2
        || game.numberOfPlayers !== game.players.length
    ) {
        return false;
    }

    // More in depth checks to ensure game is ready to begin
    const team1 = game.players.filter(p => p.teamId === game.teams[0]);
    const team2 = game.players.filter(p => p.teamId === game.teams[1]);
    if (team1.length !== team2.length || team1.length + team2.length !== game.numberOfPlayers) {
        return false;
    }

    // If all checks pass, return true
    return true;
}

exports.startGame = (game) => {
    if (!exports.readyToStartGame(game)) {
        throw new Error('Unable to start game.');
    }

    // Shuffle each players deck
    game.players.forEach(p => {
        p.deck = new Deck(game.numberOfJokers);
        p.deck.shuffle();
        p.deck.draw(6);
    });

    // Randomize who goes first
    const i = Math.floor(Math.random() * game.players.length);
    let player = game.players[i];
    game.whosTurn = player.id;

    // Set each player's 'nextPlayer' property to ensure every other player is on a different team
    const playersNotAssignedATurn = game.players.filter(p => p.id !== player.id);
    let nextTeamToAssign = game.teams.find(t => t !== player.teamId);
    while (playersNotAssignedATurn.length > 0) {
        const assignablePlayers = playersNotAssignedATurn.filter(p => p.teamId === nextTeamToAssign);
        const i = Math.floor(Math.random() * assignablePlayers.length);
        const nextPlayer = assignablePlayers[i];

        // Assign next player to current player's 'nextPlayer' property
        player.nextPlayer = nextPlayer.id;
        player = nextPlayer;

        // Toggle the next team to be assigned so turns are every other
        nextTeamToAssign = game.teams.find(t => t !== player.teamId);

        // Remove player that was just assigned
        const j = playersNotAssignedATurn.findIndex(p => p.id === player.id);
        playersNotAssignedATurn.splice(j, 1);
    }
    // Assign the last player's nextPlayer property to be the first player, so it will loop
    player.nextPlayer = game.whosTurn;

    // TODO: set up the game board

    // Set game status to 'in-progress'
    game.status = 'in-progress';
}
