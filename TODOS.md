# WIP - Unreleased

- [X] Case insensitive search
- [X] Move the logic to create dropdown buttons in the UI
- [X] Highlight the highlighted element in the dom with a dashed line
- [X] Refactor the ui to add a template rather than imperative js
- [X] Add test for the related element style
- [X] Use postcss
- [ ] Use an arrow if the highlighted element is off the viewport
- [ ] Re-run the node querySelector when the palette opens
- [ ] --- Reinstall locally
- [ ] Focus all interactive element (aria role, inputs)
- [ ] Fuzzy search
- [ ] --- Reinstall locally
- [ ] Allow to list all links or button or inputs on the page
- [ ] Reset clashing styles on the palette
- [ ] --- Prep for release
- [ ] Sign the extension using `web-ext`
- [ ] Package and install on my instance of Firefox
- [ ] Add instructions to the readme to install on Firefox
- [ ] Add artifacts on github
- [ ] --- Release

## v0.X - User Focus Styles (settings)
## v0.Y - Inline help in the UI
## v1.0 - Release on Firefox add-ons and Chrome store

----

# Ideas

## Bugs

* Update the list of interactive elements when the DOM changes
* Prevent clashes with sites shortcuts
* Update highlighted item when pressing `tab` and `shift-tab` in the dropdown

## Refactor

* Add linting?

## Features

* --- more important
* Optimize the node selection when the pages change (use MutationObserver)
* Debounce the filtering
* Make shortcuts configurable
* Performance test the querySelector and links filtering
* User defined focus styles
* --- less important
* navigate focus with arrows or hjkl
* use a more accessible color on dark / red websites
* Command: help or ?: show help menu
* copy: copy the html or text of an element
* search or /: search text in page
* Commands accepts a CSS selector, a text selector, or the focused element
* list is sorted in a clever way (page positions?)
* lint the current page using pa11y
* highlight pa11y error on the page
* text based accessibility mode: try what it looks like (with the code of the element beeing read shown on the screen)
* Expose a plugin API?
* Allow theming
