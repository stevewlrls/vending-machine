/*
Module:  sorter.js
Exports: 'CoinSorter' (class)

There is only one (singleton) instance of this class, which manages the coin
sorter assembly, including the coin slot and return button. These latter
elements are found in the HTML DOM via the id "coin-mechanism".

The class provides one "event handler" hook and one callable "method":
   - onAmount: event hook (used when amount paid changes)
   - deduct: method (called to pay for a drink)

The coin mechanism element is set up as a "drop" site for HTML 5 drag & drop,
by handling the 'dragover' and 'drop' events. We use the former of these events
to check that the source of the operation is indeed a Coin element and the
latter to simulate inserting the coin.
*/

const names = new Map([
  [1, '1p'],
  [2, '2p'],
  [5, '5p'],
  [10, '10p'],
  [20, '20p'],
  [50, '50p'],
  [100, '£1'],
  [200, '£2']
])

export class CoinSorter {
  // constructor
  //    Sets up the internal state, using the given array to define the
  // initial stock levels. This provides a list of tuples comprising coin value
  // (in pence) and count.

  constructor(change) {
    this.coins = new Map()
    this.stock = new Map(change)
    this.amountPaid = 0
    this.onAmount = null

    // Attach handlers for drag & drop
    const element = document.getElementById('coin-mechanism')
    element.ondragover = this.dragOver.bind(this)
    element.ondrop = this.dropCoin.bind(this)

    // Attach coin return button
    const coinReturn = element.getElementsByClassName('coin-return').item(0)
    coinReturn.onclick = this.giveRefund.bind(this)
  }

  // dragOver
  //    Handles the 'dragover' event. Checks that there is a suitable data
  // value in the data transfer store, then returns 'false' to prevent the
  // default behaviour of blocking drag & drop.

  dragOver(ev) {
    if (ev.dataTransfer.types.includes('application/json')) {
      ev.dataTransfer.dropEffect = 'copy'
      return false
    }
    return true
  }

  // dropCoin
  //    Handles the 'drop' event of HTML drag & drop. Extracts the coin value
  // and simulates insertion of that coin.

  dropCoin(ev) {
    const data = JSON.parse(ev.dataTransfer.getData('application/json'))
    const had = this.coins.get(data.value) || 0
    this.coins.set(data.value, had + 1)
    this.amountPaid += data.value
    if (this.onAmount) this.onAmount(this.amountPaid)
    return false
  }

  // deduct
  //    Called to deduct the price of a drink (after it has been dispensed
  // successfully). Note that we keep all coins in the 'input' tray if there
  // is any excess because we want to use those for change, before using
  // previous stock.

  deduct(price) {
    this.amountPaid -= price
    if (this.amountPaid === 0) {
      this.sendInputToStock()
    }
    if (this.onAmount) this.onAmount(this.amountPaid)
  }

  // giveRefund
  //    Handles a "button press" event on the coin return button. If any
  // change is due, this routine first uses the coins that the customer
  // inserted and only then uses its stock of change. We don't actually
  // give change: we instead display an alert listing the coins we would
  // return.

  giveRefund() {
    // If nothing due, bail out now
    if (this.amountPaid === 0) {
      alert('Coin tray is empty')
      return
    }

    // First use the coins already paid in, to try to reduce the amount paid
    // but unused to zero
    const change = this.getChange(this.coins)

    // Put all the remaining coins into stock
    this.sendInputToStock()

    // Then use the stock to try to provide any remaining change needed
    this.getChange(this.stock).forEach((count, value) => {
      change.set(value, (change.get(value) || 0) + count)
    })

    // If the customer has still overpaid, find the lowest value coin in stock
    // that redresses that and add it to the change.
    if (this.amountPaid > 0) {
      const lowest = Array.from(this.stock.keys())
          .sort((a, b) => a - b)
          .find((c) => c >= this.amountPaid),
        count = this.stock.get(lowest)
      change.set(lowest, (change.get(lowest) || 0) + 1)
      if (count === 1) this.stock.delete(lowest)
      else this.stock.set(lowest, count - 1)
    }

    // Now produce a string value that lists the remaining coins, in ascending
    // order of value
    const returned = Array.from(change.keys())
      .sort((a, b) => a - b)
      .map((c) => `${change.get(c)} x ${names.get(c)}`)
      .join('\n')
    alert('Coins returned:\n' + returned)

    // Reset internal state and trigger an update, as the amount paid is
    // now zero
    this.amountPaid = 0
    if (this.onAmount) this.onAmount(this.amountPaid)
  }

  // getChange
  //    Helper function for 'giveRefund' above. The 'source' parameter will
  // be either the coin input tray (this.coins) or the stock tray (this.stock).
  // Each of these is a Javascript Map, in which the 'key' is a coin value (in
  // pence) and the corresponding 'value' is the count of such coins.

  getChange(source) {
    const change = []

    // Sort the coins in the source (input tray or stock) into ascending
    // order of value
    const coins = Array.from(source.keys()).sort((a, b) => a - b)

    // Starting with the highest value, remove coins from the source as long
    // as their value is less than the amount still unused, and deduct their
    // value from the remaining amount
    while (this.amountPaid > 0 && coins.length > 0) {
      const value = coins.pop(),
        count = source.get(value),
        taken = Math.floor(this.amountPaid / value)
      if (taken > 0) {
        this.amountPaid -= value * taken
        change.unshift([value, taken])
        if (taken === count) source.delete(value)
        else source.set(value, count - taken)
      }
    }

    // Return the set of change as a Map, for simpler processing
    return new Map(change)
  }

  // sendInputToStock
  //    Sends all coins in the 'input' tray to the 'stock' tray. Both are
  // modelled as Javascrip Maps.

  sendInputToStock() {
    this.coins.forEach((count, value) => {
      this.stock.set(value, (this.stock.get(value) || 0) + count)
    })
    this.coins = new Map()
  }
}
