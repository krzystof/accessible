# WIP - Unreleased

- [X] Press `ctrl-e` to center the page on the highlighted item, close the palette and focus the item
- [X] Press `ctrl-e` on the search input to clear it
- [X] Attach keyboard event listeners to the palette rather than the body
- [X] Scope CSS using CSS modules
- [X] Show a nice description of an element (like what element it is)
- [X] Focus more than just links (button)
- [ ] Extract the UI to a separate class (this will separate state/dom, breaking things in smaller pieces. is it worth it?)
- [ ] Fix tests
- [ ] Add demo video to the readme
- [ ] Package and install on my instance of Firefox
- [ ] Highlight the highlighted element in the dom
- [ ] If it's open and I type `ctrl-e`, focus the search
- [ ] Update logo
- [ ] Update README
- [ ] Focus all interactive element (aria role)
- [ ] Allow to list all links or button or inputs on the page
- [ ] Case insensitive search
- [ ] Performance test the querySelector and links filtering

## v0.X - User Focus Styles (settings)
## v0.Y - Inline helps in the UI
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
