# WIP

## v0.2 - Focus Elements (ctrl-e)

Scenario: When I'm highlighting an item in the dropdown, I can see where it is on the page.

- [ ] Press `ctrl-e` to center the page on the highlighted item, and focus it
- [ ] UX: focus an item when highlighting it, or when pressing ctrl-f again? What if it's behind the palette ui?
- [ ] Prevent clashes with sites shortcuts

----

## v0.3 - Clean up all the things

- [ ] Extract the UI to a separate class
- [ ] Attach keyboard event listeners to the palette rather than the body
- [ ] Focus more than just links
- [ ] Scope CSS!
- [ ] Update filter to show interactive element
- [ ] Show a nice description of an element (like what element it is)
- [ ] Add demo video to the readme
- [ ] Add linting
- [ ] Package and install on my instance of Firefox
- [ ] Update README

## v0.X - User Focus Styles (settings)
## v0.Y - Inline helps in the UI
## v1.0 - ?

----
# Open ideas

* Updated highlighted items when pressing `tab` and `shift-tab`
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
