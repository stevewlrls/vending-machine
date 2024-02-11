/*
Module:  vend.js

This is the application "root" module and it imports a class definition from
each of the other modules.
*/

import {Coin} from './coin.js'
import {TextScreen} from './screen.js'
import {CoinSorter} from './sorter.js'
import {DrinkButton} from './drink.js'
import {Tube} from './tube.js'

// change
//    Lists the initial state of the coin sorter's cash stock. Each entry is a
// tuple comprising coin value and quantity.

const change = [
   [1, 20], [2, 10], [5, 20], [10, 10], [20, 10], [50, 6]
]

// drinks
//    Lists the drink types that are supported by the machine. Each entry is an
// object with "name" and "price" properties.

const drinks = [
   {name: 'Apple Spritz', price: 150},
   {name: 'Blueberry Buzz', price: 150},
   {name: 'Cola Roller', price: 150},
   {name: 'Tropical Sun', price: 150}
]

// stock
//    Lists the initial contents of the six can dispensing tubes. Each entry is
// a tuple comprising drink type (index number) and quantity.

const stock = [
   [0,1], [0,3], [1,4], [2,3], [2,1], [3,6]
]

//---------------------------------------------------------------------------
// Application entrypoint
//---------------------------------------------------------------------------

// The following code runs when all imported modules have finished their
// initialisation. It hooks an (anonymous) event handler function to the
// "DOMContentLoaded" event, which signals that all HTML DOM elements have been
// created. This function initialises all of the objects required for the
// simulation and links their event handler hooks to functions that provide
// the required behaviour.

document.addEventListener('DOMContentLoaded', function() {
   const initialText = 'Insert coins and then select a product. All drinks cost £1.50';
   var textScreen, sorter, buttons

   Coin.mapCoins()
   Tube.loadStock(stock, drinks)

   textScreen = new TextScreen()
   textScreen.setContent(initialText)

   sorter = new CoinSorter(change)
   sorter.onAmount = function (amount) {
      textScreen.setContent(
         (amount === 0) ? initialText :
            `Amount paid:<br><em>£${(amount / 100).toFixed(2)}</em>`
      )
      for (const b of buttons) {
         const lit = (amount >= b.price) && Tube.find(b.drink)
         b.lightOn(lit)
      }
   }

   buttons = DrinkButton.mapDrinks(drinks)
   for (const b of buttons) b.onPressed = function () {
      const tube = Tube.find(b.drink)
      if (tube && tube.dispenseCan()) {
         sorter.deduct(b.price)
         if (! Tube.find(b.drink)) b.lightOn(false) // none left
      }
      else alert('Dispense failed!')
   }
})
