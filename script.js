

/* ------------------------------------------
 Create Card object
--------------------------------------------- */

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

/* ------------------------------------------
 Create Game object
--------------------------------------------- */

class Game{
    constructor(deck){
        this.deck = deck
        this.stock = createStock(deck)
        this.gameOn = true
        this.cardsLaid = 0
        this.deckLength = this.deck.length
    }

    swapCards(pos){
        let stockCard = this.stock.shift()
       
        this.stock.push(deck[pos])
        this.deck[pos] = stockCard
   }

   /* Discard a card and decrease the size of the stock pile */
    removeCard(){
        this.stock.shift()
        console.log("A card has been removed")
    }
    
    /* Upon drawing a willow card, we remove that card from the stock pile then
    draw the next card to check if it is a willow card. If it is, we repeat this
    process until we have no more cards in the stock pile, or we draw a card that
    is not a willow*/

    drewWillow(){
        let isWillow = true 
        
        console.log("You drew a Willow")


        this.removeCard()
    
        console.log(`${this.stock.length} cards remain`)
        console.log("Current Stock Card:")
        console.log(this.stock[0])

        while(isWillow){

            /* I check to see if our stock has any cards remaining first to prevent
            our conditional from checking for an undefined value */
            if (this.stock.length === 0 ){
                isWillow = false
                this.gameOn = false
            } else if(this.stock[0].suit === "Willow"){
                this.removeCard()
                console.log(`${this.stock.length} cards remain`)
                console.log("Current Stock Card:")
                console.log(this.stock[0])
            } else {
                isWillow = false 
            }
        }

        /* We only have to check the game once we begin to draw Willow cards.
        Either we run out of cards in our stock pile before completing the tableau,
        or we only have willow cards remaining in our stock pile causing us to
        discard them all */

        this.checkGame()
    }

    checkGame(){
        console.log("Checking the game!")
        if (this.gameOn === false){
            if(this.cardsLaid === this.deckLength){
                console.log("CONGRATULATIONS, YOU WIN")
            } else{
                console.log("YOU LOSE")
            }
        }
    }

    checkColumnPlacement(suit, pos){
       return flowers[pos%2] === suit
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
let flowers = ["Maple", "Paulownia", "Willow"]

// Creates an array of each type per month of card
let types = [// ["Crane", "Red Poem"], ["Nightingale", "Red Poem"], ["Curtain", "Red Poem"],
             // ["Cuckoo", "Red"], ["Bridge", "Red"], ["Butterflies", "Blue"], 
             // ["Boar", "Red"], ["Moon", "Geese"], ["Sake", "Blue"],
             ["Deer", "Blue"], ["Pheonix"], ["Rain", "Swallow", "Red"]]


let deck = []

/*Create the deck using the suits of the cards as the foundation*/
for(let i = 0; i < flowers.length; i++){
    let fullTypes = types.map(createFullSuit)

    deck.push(...createCardsBySuit(flowers[i], fullTypes[i]))
    shuffle(deck)

}

let game = new Game(deck)

let tableau = document.querySelector(".tableau")

/* Create the squares */
for (let i = 0; i < deck.length; i++){
    let cardSquare = createCardSquare(i)
    tableau.appendChild(cardSquare)
}

console.log("Current Stock Card:")
console.log(game.stock[0])

if (game.stock[0].suit === "Willow"){
    game.drewWillow()
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
    return game.deck[pos]
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

/* ------------------------------------------
 Helper functions - Gameplay
--------------------------------------------- */

function clickedCard(e) {

    /* Get the position of the clicked card */
    let pos = getPosition(e.target)
    let suit = game.stock[0].suit

    if (game.checkColumnPlacement(suit, pos)){
        placeCard(e,pos)
    } else{
        console.log(`The ${suit} cards don't go there!`)
    }
}

function placeCard(e, pos){
    /* Place the card from the top of the stock pile 
    and add the face-down card to the bottom */
    game.swapCards(pos)

    /* Get the card that was swapped from the stock pile
    to the tableau and add the corresponding image file*/
    let placedCard = correspondingCard(pos)
    addCardImage(e.target, placedCard)
    game.cardsLaid++

    /* Let the user know what their new card is */
    console.log("Current Stock Card:")
    console.log(game.stock[0])

    /* When a user draws a willow card they must discard it
    and reduce their hand-size by one */
    if(game.stock[0].suit === "Willow"){
        game.drewWillow()
    }
}