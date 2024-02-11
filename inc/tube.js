/*
Module:  tube.js
Exports: 'Tube' (class)

The instances of the Tube class correspond to the can dispenser tubes that are
hidden inside the vending machine. Their only user interface is to show an
'alert' popup when asked to dispense a can.

The class provides no "event handler" hooks and only one, callable "method":
   - dispenseCan: method (called to dispense a single can)
*/

var tubes;        // Array of Tube class instances

export class Tube {

   // constructor
   //    Simply stores the initial stock level and the type of drink that has
   // been loaded.

   constructor(drink, cans) {
      this.drink = drink
      this.count = cans
   }

   // contains
   //    Checks whether the tube is assigned to the given drink type and is
   // not yet empty.

   contains(drink) {
      return (this.drink === drink) && (this.count > 0)
   }

   // dispenseCan
   //    Called to dispense one can from the tube. Returns "true" if this
   // succeeds, else "false".

   dispenseCan() {
      if (this.count > 0) {
         this.count -= 1
         alert('Dispensed one can of ' + this.drink)
         return true
      }
      return false
   }

   // loadStock
   //    Called on application startup, to load an initial stock into the
   // dispensing tubes. The stock levels are given as an array of tuples,
   // consisting of drink index (used to look up the name) and quantity
   // loaded.

   static loadStock(stock, drinks) {
      tubes = stock.map(s => new Tube(drinks[s[0]].name, s[1]))
   }

   // find
   //    Returns the first Tube containing at least one can of the given
   // drink.

   static find(drink) {
      return tubes.find(t => t.contains(drink))
   }
}
