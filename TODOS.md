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
- [ ] TDD: setup tests with jest and dom testing library
- [ ] Write a test to open the dropdown, select the third element, then the second,  and click it
- [ ] Clear items if query is empty
- [ ] Hide the dropdown if it's empty
- [ ] Enter opens the first link if none selected
- [ ] Press `ctrl-f` to center the page on the highlighted item, and focus it
- [ ] Close the palette on `esc`
- [ ] Return the focus to the element when closing the list
- [ ] Prevent clashes with sites shortcuts
- [ ] Package and install on my instance of Firefox

## v0.2 - Focus Elements (ctrl-f)
## v0.3 - User Focus Styles (settings)
## v0.4 - Inline helps in the UI
## v1.0 - ?

----
# Next

*P1*
* Scope CSS!
* Update filter to show interactive element
* Show a nice description of an element (like what element it is)
* Update README

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
