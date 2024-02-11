/*
Module:  screen.js
Exports: 'TextScreen' (class)

There is onlu one (singleton) instance of the TextScreen class. It provides
a simple interface to dsplaying text.

The class provides no "event handler" hooks and only one callable "method":
   - setContent: method (called to change the text)
*/

export class TextScreen {
  // constructor
  //    Finds and stores a reference to the text screen element, by means of
  // its "id" attribute.

  constructor() {
    this.element = document.getElementById('text-screen')
  }

  // setContent
  //    Replaces the content of the text screen element with a new string.
  // This should be a simple text string but may also include the <em>
  // element, to indicate "large" text.

  setContent(str) {
    this.element.innerHTML = str
  }
}
