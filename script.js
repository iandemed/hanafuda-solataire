

/* Create the card objec that we will use for the game */

class Card{
    constructor(suit, type, score, img){
        this.suit = suit
        this.type = type
        this.score = score
        this.img = img
    }

    createImg(){
        return `<img src="./imgs/${img}" alt = "${Suit} ${type}">`
    }
}

let pine_crane = new Card("Pine", "Crane", 20, "pine-crane.png")

console.log(pine_crane)