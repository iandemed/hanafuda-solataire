

/* Create the card objec that we will use for the game */

class Card{
    constructor(suit, type){
        this.suit = suit
        this.type = type 
        this.score = getScore(type)
    }

    prepareImgPath()
    {
        let suit = this.suit.toLowerCase()
        // Replaces any white space inside the string with a -
        let type = this.type.toLowerCase().replace(/\s/g, "-")


        return `./imgs/${[suit, type].join("-")}.png`
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
//let flowers = ["Pine", "Plum", "Cherry", "Wisteria", "Iris", "Peony", "Lespedeza", "Pampas", "Chrysanthemum", "Maple", "Willow", "Paulownia"]
let flowers = ["Maple", "Willow", "Paulownia"]

// Creates an array of each type per month of card
let types = [// ["Crane", "Red Poem"], ["Nightingale", "Red Poem"], ["Curtain", "Red Poem"],
             // ["Cuckoo", "Red"], ["Bridge", "Red"], ["Butterflies", "Blue"], 
             // ["Boar", "Red"], ["Moon", "Geese"], ["Sake", "Blue"],
             ["Deer", "Blue"], ["Rain", "Swallow", "Red"], ["Pheonix"]]


let deck = []

/*Create the deck using the suits of the cards as the foundation*/
for(let i = 0; i < flowers.length; i++){
    let fullTypes = types.map(createFullSuit)

    deck.push(...createCardsBySuit(flowers[i], fullTypes[i]))
    shuffle(deck)

}

let stock = createStock(deck)

let tableau = document.querySelector(".tableau")

/* Create the squares */
for (let i = 0; i < deck.length; i++){
    let cardSquare = createCardSquare(i)
    tableau.appendChild(cardSquare)
}

console.log("Current Stock Card:")
console.log(stock[0])

if (stock[0].suit === "Willow"){
    drewWillow()
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

    cardSquare.addEventListener('click', clickedCard)

    return cardSquare
}

function getPosition(cardSquare){
    return parseInt(cardSquare.dataset.position)
}

function correspondingCard(pos){
    return deck[pos]
}

function addCardImage(cardSquare, placedCard){

    let imgURL = placedCard.prepareImgPath()
    cardSquare.style.backgroundImage = `url(${imgURL})`

}

/* ------------------------------------------
 Helper functions - Stock Pile
--------------------------------------------- */

function createStock(deck){
    
    // Get the last 4 cards of the deck
    pos = (deck.length - 1) - 4

    return deck.splice(pos, 4)
}

// Discard a card and decrase the size of the stock pile
function removeCard(){
    stock.shift()

    if(stock.length == 0){
        console.log("YOU LOSE! Would you like to restart?")
    }

    console.log("Current Stock Card:")
    console.log(stock[0])
}


/* ------------------------------------------
 Helper functions - Gameplay
--------------------------------------------- */

function swapCards(pos){
     let stockCard = stock.shift()
    
     stock.push(deck[pos])
     deck[pos] = stockCard
}

/* Upon drawing a willow card, we remove that card from the stock pile then
draw the next card to check if it is a willow card. If it is, we repeat this
process until we have no more cards in the stock pile, or we draw a card that
is not a willow*/

function drewWillow(){
    let isWillow = true 

    console.log(isWillow)

    removeCard()

    while(isWillow){
        if(stock[0].suit === "Willow"){
            console.log("Triggered the loop!")
            removeCard()
        } else {
            isWillow = false
        }
    }

}

function clickedCard(e){

    /* Get the position of the clicked card */
    let pos = getPosition(e.target)
     
    /* Place the card from the top of the stock pile 
    and add the face-down card to the bottom */
    swapCards(pos)

    /* Get the card that was swapped from the stock pile
    to the tableau and add the corresponding image file*/
    let placedCard = correspondingCard(pos)
    addCardImage(e.target, placedCard)

    /* Let the user know what their new card is */
    console.log("Current Stock Card:")
    console.log(stock[0])

    /* When a user draws a willow card they must discard it
    and reduce their hand-size by one */
    if(stock[0].suit === "Willow"){
        drewWillow()
    }
}