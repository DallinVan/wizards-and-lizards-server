const Card = require('./Card');

const cardSuits = ['spades', 'hearts', 'clubs', 'diamonds'];
const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

class Deck {
    constructor(numberOfJokers = 0) {
        this.cards = this.createDeck(numberOfJokers);
        this.hand = [];
        this.discard = [];
    }

    // Static
    createDeck(numberOfJokers = 0) {
        const newDeck = [];

        for (let i = 0; i < cardSuits.length; i++) {
            for (let j = 0; j < cardValues.length; j++) {
                newDeck.push(new Card(cardSuits[i], cardValues[j]));
            }
        }

        // Add however many jokers specified
        for (let i = 0; i < numberOfJokers; i++) {
            newDeck.push(new Card('joker', 'joker'));
        }

        return newDeck;
    }

    shuffle() {
        const shuffledCards = [];
        while (this.cards.length > 0) {
            const i = Math.floor(Math.random() * this.cards.length);
            shuffledCards.push(this.cards[i]);
            this.cards.splice(i, 1);
        }
        this.cards = shuffledCards;
    }

    draw(cardsToDraw = 1) {
        for (let i = 0; i < cardsToDraw; i++) {
            this.hand.push(this.cards.pop());
        }
    }

    discard(cardInHand) {
        const i = this.hand.findIndex(c => c.suit === cardInHand.suit && c.value === cardInHand.value);
        if (i < 0) {
            throw new Error('Card not found in hand, cannot discard.');
        }

        this.discard.push(this.hand[i]);
        this.hand.splice(i, 1);
    }
}

module.exports = Deck;