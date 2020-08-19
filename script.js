

/* Create the card objec that we will use for the game */

class Card{
    constructor(suit, type){
        this.suit = suit
        this.type = type 
        this.score = getScore(type)
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


let deck = []

// Create the deck
for(let i = 0; i < 12; i++){
    let fullTypes = types.map(createFullSuit)

    deck.push(...createCardsBySuit(flowers[i], fullTypes[i]))
    shuffle(deck)

}

let stock = createStock(deck)

let tableau = document.querySelector(".tableau")


for (let i = 0; i < 44; i++){
    let cardSquare = createCardSquare(i)
    tableau.appendChild(cardSquare)
}



/* ------------------------------------------
 Helper functions - Deck Creation
--------------------------------------------- */

function createFullSuit(array){

    // Get the remaining number of cards to fill out a suit
    let len = 4 - array.length

    for(let i = 0; i < len; i++){
        array.push(`Plain ${i}`)
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

function createCardsBySuit(suit, types){
    
    let fullSuit = []
    
    for(let i = 0; i < types.length; i++){
        fullSuit[i] = new Card(suit, types[i])
    }

    return fullSuit
}

// Implement the Fisher-Yates shuffle algorithm
function shuffle(deck){
    let j, temp = null
  
        for (let i = deck.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i+1))
          temp = deck[i]
          deck[i] = deck[j]
          deck[j] = temp
        }
}

/* ------------------------------------------
 Helper functions - Tableau Creation
--------------------------------------------- */

function createCardSquare(pos){
    let cardSquare = document.createElement("div")
    cardSquare.classList.add("card-square")
    cardSquare.dataset.position = pos

    cardSquare.addEventListener('click', (e) => {
        console.log("Stock Card: ")
        console.log(stock[0])
        console.log("Clicked Card: ")

        let pos = getPosition(e.target)
        console.log(correspondingCard(pos))
        swapCards(pos)
    })

    return cardSquare
}

function getPosition(cardSquare){
    return parseInt(cardSquare.dataset.position)
}

function correspondingCard(pos){
    return deck[pos]
}

/* ------------------------------------------
 Helper functions - Stock Pile
--------------------------------------------- */

function createStock(deck){
    
    // Get the last 4 cards of the deck
    pos = (deck.length - 1) - 4

    return deck.splice(pos, 4)
}


/* ------------------------------------------
 Helper functions - Gameplay
--------------------------------------------- */

function swapCards(pos){
     let stockCard = stock.shift()
    
     stock.push(deck[pos])
     deck[pos] = stockCard
}