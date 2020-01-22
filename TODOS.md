# WIP

## v0.1 - Click Elements

Scenario: When I press `f`, a popup shows in the center of the screen.
When I type, it shows a dropdown which contains the links / buttons I
can click on the page.

- [X] Create basic input box, show it when pressing `,`
- [X] Box styles
- [X] Close on blur
- [ ] Switch to ts
- [ ] Index the interactive elements
- [ ] If content is not empty, show a dropdown with the matching links
- [ ] Ctrl-n and ctrl-p navigates the list
- [ ] Enter opens the selected link
- [ ] Ctrl+enter opens the first link if none selected
- [ ] Shift+enter focus the element and center the page
- [ ] Highlight the selected node when browsing the list
- [ ] Don't open the box if the user is focused on the original website
- [ ] Return the focus to the element when closing the list

----

## v0.2 - Focus Elements
## v0.3 - User Focus Styles
## v1.0 - ?

----

# Open ideas

* navigate focus with arrows or hjkl
* fuzzy search
* commands:
  * help or ?: show help menu
  * go or open: list links, open links
  * click: click a button or an interactive element
  * copy: copy the html or text of an element
  * search or /: search text in page
  * focus: focus an element
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
