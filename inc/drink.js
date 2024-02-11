/*
Module:  drink.js
Exports: 'DrinkButton' (class)

The instances of the DrinkButton class correspond to and manage the drink
selection buttons on the front panel of the vending machine. Each drink has
a name and a price. From the former, we compute an "id" string by converting
the name to lower case and then replacing any spaces by a hyphen (-). The "id"
is then used to select a background image file for the button.

The class provides one event handler hook and two callable "methods":
   - onPressed: event hook (used when the button is 'active' and pressed)
   - lightOn: method (called to turn the LED "light" on or off)
   - mapDrinks: static method (called to create the button elements)
*/

let buttonArea = null, // Reference to container (div)
  template = null // Reference to button template

export class DrinkButton {
  // constructor
  //    Sets up the initial state of the button instance and then creates and
  // inserts a new copy of the template (DOM fragment). In doing the latter,
  // sets up the drink image property to override the default in the CSS.

  constructor(name, cost) {
    // Initialise state
    this.drink = name
    this.price = cost
    this.id = name.toLowerCase().split(' ').join('-')
    this.ledState = 'off'
    this.onPressed = null

    // Create and insert new button element
    this.element = template.cloneNode(true)
    this.element.classList.add(this.id)
    this.element.style.backgroundImage = `url(images/${this.id}.svg)`
    const nameArea = this.element.getElementsByClassName('drink-name').item(0)
    nameArea.innerText = name
    this.element.onclick = this.pressed.bind(this)
    buttonArea.appendChild(this.element)
  }

  // lightOn
  //    Turns the "LED light" on or off. This is done by adding the class
  // name "on" to the button container, or removing same.

  lightOn(turnOn) {
    const newState = turnOn ? 'on' : 'off'
    if (newState !== this.ledState) {
      if (turnOn) this.element.classList.add('on')
      else this.element.classList.remove('on')
      this.ledState = newState
    }
  }

  // pressed
  //    Handles the mouse "click" event for the container, which signals that
  // the button has been pressed. This only generates an event to the main
  // code if the "LED light" is currently turned on.

  pressed() {
    if (this.onPressed && this.ledState === 'on') this.onPressed()
  }

  // mapDrinks
  //    Called during application startup, to create and insert an instance
  // of the DrinkButton class for each supported drink type.

  static mapDrinks(drinks) {
    // Get template
    buttonArea = document.getElementById('button-area')
    template = buttonArea.getElementsByClassName('drink-button').item(0)
    buttonArea.removeChild(template)

    // Create buttons
    return drinks.map((d) => new DrinkButton(d.name, d.price))
  }
}
