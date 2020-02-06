import css from './palette.module.css'

const MAX_DROPDOWN_ITEMS = 5

type FocusableElement = Element & {focus: () => void}

function isFocusable(element: null | Element): element is FocusableElement {
  return element ? 'focus' in element : false
}

type PaletteDOMElements = {
  rootEl: HTMLDivElement
  wrap: HTMLDivElement
  dropdown: HTMLDivElement
  inputWrap: HTMLDivElement
  input: HTMLInputElement
}

type PaletteCallbacks = {
  getLinks: () => Promise<IterableIterator<HTMLAnchorElement>>
}

export class Palette {
  ui: PaletteDOMElements // TODO extract to a separate class that handles DOM updates
  domCallbacks: PaletteCallbacks

  pageFocusedElement: null | Element = null

  docLinks: HTMLAnchorElement[] = []
  dropdownItems: HTMLButtonElement[] = []

  highlightedResultIndex: null | number = null

  constructor(elements: PaletteDOMElements, callbacks: PaletteCallbacks) {
    this.ui = elements
    this.domCallbacks = callbacks

    this.initUi()
    this.bindEventHandlers()

    this.domCallbacks.getLinks().then(links => this.setLinks(links))
  }

  // Initial state of the palette

  private initUi() {
    this.ui.rootEl.classList.add(css['accessible-palette'])
    this.ui.rootEl.dataset.testid = 'accessible-palette'

    this.ui.wrap.classList.add(css['wrap'])
    this.ui.dropdown.classList.add(css['dropdown'])
    this.ui.dropdown.hidden = true
    this.ui.dropdown.dataset.testid = 'accessible-palette-dropdown'

    this.ui.inputWrap.classList.add(css['input-wrap'])

    this.ui.input.title = 'search-input'

    this.ui.inputWrap.appendChild(this.ui.input)
    this.ui.wrap.appendChild(this.ui.inputWrap)
    this.ui.wrap.appendChild(this.ui.dropdown)
    this.ui.rootEl.appendChild(this.ui.wrap)
  }

  private bindEventHandlers() {
    this.ui.input.addEventListener('input', (event: Event) => {
      const eventTarget = event.target as HTMLInputElement

      if (eventTarget.value === '') {
        this.hideDropdown()
        return
      }

      let filteredLinks = []
      for (let l of this.docLinks) {
        // TODO make it case insensitive
        if (l.textContent && l.textContent.includes(eventTarget.value)) {
          filteredLinks.push(l)
        }
      }

      const items = filteredLinks.slice(0, MAX_DROPDOWN_ITEMS)

      // TODO reconcile the ui instead
      if (items.length === 0) {
        this.hideDropdown()
      } else {
        this.showDropdown(items)
      }
    })

    this.ui.input.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'e') {
        this.ui.input.value = ''
        this.hideDropdown()
        event.stopPropagation()
        event.preventDefault()
        return
      }
    })

    this.ui.rootEl.addEventListener('click', (event: Event) => {
      const eventTarget = event.target as HTMLElement
      if (eventTarget && !this.ui.wrap.contains(eventTarget)) {
        this.hide()
      }
    })

    this.ui.rootEl.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) {
        this.hide()
        event.stopPropagation()
        return
      }

      if (event.ctrlKey && event.key === 'n') {
        this.highlightNextResult()
        event.stopPropagation()
        return
      }

      if (event.ctrlKey && event.key === 'p') {
        this.highlightPreviousResult()
        event.stopPropagation()
        return
      }

      if (event.key === 'Enter') {
        this.validateSelection()
        event.stopPropagation()
        return
      }
    })
  }

  // Public Palette API

  showOrFocus(focusedElement: null | Element) {
    if (this.isHidden()) {
      this.pageFocusedElement = focusedElement
      this.ui.rootEl.classList.add(css['visible'])
      this.highlightedResultIndex = null
      this.ui.input.focus()
      return
    }
  }

  // Private Palette API

  private setLinks(links: IterableIterator<HTMLAnchorElement>) {
    this.docLinks = Array.from(links)
  }

  private isVisible() {
    // TODO use the "hidden" attribute
    return this.ui.rootEl.classList.contains(css['visible'])
  }

  private isHidden() {
    return !this.isVisible()
  }

  private hide() {
    this.ui.rootEl.classList.remove(css['visible'])

    if (isFocusable(this.pageFocusedElement)) {
      this.pageFocusedElement.focus()
    }
  }

  private highlightPreviousResult() {
    const shownItems = this.dropdownItems.length

    if (shownItems === 0) {
      this.highlightedResultIndex = null
      return
    }

    if (this.highlightedResultIndex === null) {
      return
    }

    if (this.highlightedResultIndex === 0) {
      this.highlightedResultIndex = null
      this.ui.input.focus()
      return
    }

    this.highlightedResultIndex -= 1

    this.dropdownItems[this.highlightedResultIndex].focus()
  }

  private highlightNextResult() {
    const shownItems = this.dropdownItems.length

    if (shownItems === 0) {
      this.highlightedResultIndex = null
      return
    }

    if (this.highlightedResultIndex === null) {
      this.highlightedResultIndex = 0
    } else if (this.highlightedResultIndex + 1 === shownItems) {
      // We are at the end of the list, don't do anything
      return
    } else {
      this.highlightedResultIndex += 1
    }

    this.dropdownItems[this.highlightedResultIndex].focus()
  }

  private validateSelection() {
    if (this.dropdownItems.length === 0) {
      return
    }

    if (this.highlightedResultIndex === null) {
      this.dropdownItems[0].click()
      return
    }

    this.dropdownItems[this.highlightedResultIndex].click()
  }

  private showDropdown(links: HTMLAnchorElement[]) {
    this.ui.dropdown.innerHTML = ''

    // TODO don't throw away items here
    this.dropdownItems = []
    this.ui.dropdown.hidden = false

    links.forEach((link, index) => {
      const node = document.createElement('button')
      // const itemClass = `dropdown-result-num-${index}`
      node.classList.add(css['dropdown-result'])
      // node.classList.add(itemClass)
      node.addEventListener('click', () => {
        link.click()
      })
      node.addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'e') {
          event.stopPropagation()
          this.pageFocusedElement = null
          this.hide()
          link.focus()
        }
      })
      let t = link.textContent
      node.textContent = t || 'no content for this link'

      // TODO this is duplicated, should happen when reconciling DOM
      this.dropdownItems.push(node)
      this.ui.dropdown.appendChild(node)
    })
  }

  private hideDropdown() {
    this.ui.dropdown.innerHTML = ''
    this.ui.dropdown.hidden = true
    this.dropdownItems = []
  }
}
