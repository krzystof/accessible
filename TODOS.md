# WIP

## v0.1 - Click Elements

Keys: ctrl-f, ctrl-n, ctrl-p, enter
Scenario: When I press `ctrl-f`, a popup shows in the center of the screen.
When I type, it shows a dropdown which contains the links / buttons I
can click on the page.

- [X] Create basic input box, show it when pressing `,`
- [X] Box styles
- [X] Close on blur
- [X] Index the interactive elements
- [X] If content is not empty, show a dropdown with the matching links
- [X] Ctrl-n and ctrl-p navigates the list
- [X] Enter opens the selected link
- [X] Switch to ts
- [X] Update styles to make it a bit nicer
- [X] Refactor the palette as a class
- [X] TDD: setup tests with jest and dom testing library
- [X] Write a test to open the dropdown, select the third element, then the second,  and click it
- [X] Setup CI
- [X] Clear items if query is empty
- [X] Hide the dropdown if it's empty
- [X] Enter opens the first link if none selected
- [X] Close the palette on `esc` or `ctrl-c`
- [X] Hide the palette on blur
- [X] Return the focus to the body element that had the focus when closing the list
- [X] Change from `ctrl-f` to `ctrl-e`
- [ ] Prevent clashes with sites shortcuts
- [ ] Remove debug css styles
- [ ] Extract the UI to a separate class
- [ ] Package and install on my instance of Firefox

----

## v0.2 - Focus Elements (ctrl-e)

Scenario: When I'm highlighting an item in the dropdown, I can see where it is on the page.

- [ ] Press `ctrl-e` to center the page on the highlighted item, and focus it
- [ ] UX: focus an item when highlighting it, or when pressing ctrl-f again? What if it's behind the palette ui?

----

## v0.3 - Clean up all the things

- [ ] Focus more than just links
- [ ] Scope CSS!
- [ ] Update filter to show interactive element
- [ ] Show a nice description of an element (like what element it is)
- [ ] Update README
- [ ] Add demo video to the readme
- [ ] Add linting
- [ ] Add github actions for CI

## v0.X - User Focus Styles (settings)
## v0.Y - Inline helps in the UI
## v1.0 - ?

----
# Open ideas

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
