

/* Create the card objec that we will use for the game */

class Card{
    constructor(suit, type, img){
        this.suit = suit
        this.type = type 
        this.img = img
        this.score = getScore(suit)
    }

    createImg(){
        return `<img src="./imgs/${img}" alt = "${suit.toLowerCase()} ${type}">`
    }
}

/* Hanafuda cards do not follow the same convention of ranking as
    french suited playing cards. There are 3 primary indicators of
    a cards value. Whether the card belongs to the "lights", tane,
    or ribbons. The lights and tane are unique to a particular suit */

let light = ["Crane", "Curtain", "Moon", "Rain", "Pheonix"]
let tane = ["Nightingale", "Cuckoo", "Bridge", "Butterflies", "Boar", "Geese", "Sake", "Deer", "Swallow"]
let ribbons = ["Red Poem", "Red", "Blue"]

// Creates an array of each of the flowers that correspon with each month
let flowers = ["Pine", "Plum", "Cherry", "Wisteria", "Iris", "Peony", "Lespedeza", "Pampas", "Chrysantenmum", "Maple", "Willow", "Paulownia"]

// Creates an array of each type per month of card
let types = [["Crane", "Red Poem"], ["Nightinale", "Red Poem"], ["Curtain", "Red Poem"],
             ["Cuckoo", "Red"], ["Bridge", "Red"], ["Butterflies", "Blue"], 
             ["Boar", "Red"], ["Moon", "Geese"], ["Sake", "Blue"],
             ["Deer", "Blue"], ["Rain", "Swallow", "Red"], ["Pheonix"]]


/* ------------------------------------------
 Helper functions - Deck Creation
--------------------------------------------- */

function createFullSuit(array){

    // Get the remaining number of cards to fill out a suit
    let len = 4 - array.length

    for(let i = 0; i < len; i++){
        array.push(`Plain ${1}`)
    }

    return array
}


function getScore(type){

    if(light.includes(type)){
        return 20
    } else if (tane.includes(type)){
        return 10
    } else if (ribbons.includes(type)){
        return 5
    } else {
        return 1
    }

}