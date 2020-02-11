# WIP - Unreleased

- [X] Case insensitive search
- [X] Move the logic to create dropdown buttons in the UI
- [.] Highlight the highlighted element in the dom with a dashed line
- [ ] Use an arrow if the highlighted element is off the viewport
- [ ] Focus all interactive element (aria role, input)
- [ ] Fuzzy search
- [ ] Allow to list all links or button or inputs on the page
- [ ] Reset clashing styles on the palette
- [ ] Force the focus style on the page using CSS
- [ ] Performance test the querySelector and links filtering
- [ ] Add license
- [ ] Package and install on my instance of Firefox
- [ ] Add instructions to the readme to install on Firefox

## v0.X - User Focus Styles (settings)
## v0.Y - Inline help in the UI
## v1.0 - Release on Firefox add-ons and Chrome store

----

# Ideas

## Bugs

* Update the list of interactive elements when the DOM changes
* Prevent clashes with sites shortcuts
* Updated highlighted items when pressing `tab` and `shift-tab`

## Refactor

* Add linting?

## Features

* Update filter to show interactive element while cycling the list
* Highlight the selected node when browsing the list
* Use postcss
* navigate focus with arrows or hjkl
* case insensitive search
* fuzzy search
* Command: help or ?: show help menu
* copy: copy the html or text of an element
* search or /: search text in page
* Commands accepts a CSS selector, a text selector, or the focused element
* ctrl p-n navigate the list
* tab: preview the highlighted element
* list is sorted in a clever way
* open the palette with a key (,)
* trigger the focus mode with a key (;)
* complete based on the position on the page
* make triggers configurable
* lint the current page using pa11y
* highlight pa11y error on the page
* text based accessibility mode: try what it looks like (with the code of the element beeing read shown on the screen)
* offer a pluggin system API?
* Debounce the filtering
* Allow theming
