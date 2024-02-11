/*
Module:  coin.js
Exports: 'Coin' (class)

The instances of the Coin class correspond to the coin images to the left of
the vending machine, in a container (div) with id="coin-area". The initial
content of the container is taken as a template for each instance, which has
a unique class name added, to distinguish it from others (and to pick up the
correct image from the CSS).

Each element is made a 'source' for HTML 5 drag & drop, by setting the
"draggable" attribute (to "true") and adding a handler for the "dragstart"
event. This latter sets the value of the coin as the "data" for the
operation, using a JSON string to carry it.

Note that we keep a reference to each Coin object that is created, because
otherwise the Javascript system could delete them and mess up the drag & drop
functionality. Better safe than sorry.

The Coin class provides no "event handler" hooks and only one callable "method":
   - mapCoins: static method (called to create the coin elements)
*/

let coinArea = null,       // Reference to container (div)
    template = null,       // Template DOM tree fragment
    coins = []             // Array of Coin class instances

export class Coin {

   // constructor
   //    Creates a new DOM element, using the template, and connects it up for
   // drag & drop.

   constructor(id, value) {
      this.id = id
      this.value = value
      this.element = template.cloneNode(true)
      this.element.classList.add('coin-' + id)
      this.element.draggable = true
      this.element.ondragstart = this.dragStart.bind(this)
      coinArea.appendChild(this.element)
   }

   // dragStart
   //    Handles the 'dragstart' event (passed as a parameter). Adds the coin
   // value to the data transfer store associated with this event. This data
   // will then be available to any "drop" site (such as the coin slot).

   dragStart(ev) {
      ev.dataTransfer.setData(
         'application/json',
         JSON.stringify({source: 'coin', value: this.value})
      )
   }

   // mapCoins
   //    Called during page load (when the DOM has been created), to set up the
   // array of Coin elements. We extract the template and then build the
   // required number of copies.

   static mapCoins() {
      coinArea = document.getElementById('coin-area')
      template = coinArea.getElementsByClassName('coin').item(0)
      coinArea.removeChild(template)

      coins.push(
         new Coin('1p', 1),
         new Coin('2p', 2),
         new Coin('5p', 5),
         new Coin('10p', 10),
         new Coin('20p', 20),
         new Coin('50p', 50),
         new Coin('pound', 100),
         new Coin('2pound', 200)
      )
   }
}
