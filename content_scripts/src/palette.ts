import css from './palette.module.css'

const MAX_DROPDOWN_ITEMS = 5

type FocusableElement = HTMLElement & {focus: () => void}

function isFocusable(element: null | Element): element is FocusableElement {
  return element ? 'focus' in element : false
}

function isLink(element: HTMLElement): element is HTMLAnchorElement {
  return 'href' in element
}

function getPrettyTagName(tagName: string) {
  if (tagName === 'A') {
    return 'link'
  } else if (tagName === 'BUTTON') {
    return 'button'
  } else {
    console.log('>>>', tagName)
    return 'unknown'
  }
}

type PaletteDOMElements = {
  rootEl: HTMLDivElement
  wrap: HTMLDivElement
  dropdown: HTMLDivElement
  inputWrap: HTMLDivElement
  input: HTMLInputElement
}

type PaletteHandlers = {
  onSearch: (event: Event) => void
  onClearSearch: () => void
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  onValidate: () => void
}

type PaletteCallbacks = {
  getInteractiveElements: () => Promise<NodeList>
}

class PaletteUI {
  els: PaletteDOMElements
  constructor(els: PaletteDOMElements, eventHandlers: PaletteHandlers) {
    this.els = els

    // Initialise the elements
    this.els.rootEl.classList.add(css['accessible-palette'])
    this.els.rootEl.dataset.testid = 'accessible-palette'

    this.els.wrap.classList.add(css['wrap'])
    this.els.dropdown.classList.add(css['dropdown'])
    this.els.dropdown.hidden = true
    this.els.dropdown.dataset.testid = 'accessible-palette-dropdown'

    this.els.inputWrap.classList.add(css['input-wrap'])

    this.els.input.title = 'search-input'

    this.els.inputWrap.appendChild(this.els.input)
    this.els.wrap.appendChild(this.els.inputWrap)
    this.els.wrap.appendChild(this.els.dropdown)
    this.els.rootEl.appendChild(this.els.wrap)

    // Attach event handlers
    this.els.input.addEventListener('input', eventHandlers.onSearch)

    this.els.input.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'e') {
        this.els.input.value = ''
        eventHandlers.onClearSearch()
        event.preventDefault()
        return
      }
    })

    this.els.rootEl.addEventListener('click', (event: Event) => {
      const eventTarget = event.target as HTMLElement
      if (eventTarget && !this.els.wrap.contains(eventTarget)) {
        eventHandlers.onClose()
      }
    })

    this.els.wrap.addEventListener('keydown', (event: KeyboardEvent) => {
      // Prevent the page from scrolling
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()
      }
    })

    this.els.wrap.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) {
        eventHandlers.onClose()
        event.preventDefault()
        return
      }

      // FIXME this opens a new window in firefox on linux
      if ((event.ctrlKey && event.key === 'n') || event.key === 'ArrowDown') {
        eventHandlers.onNext()
        event.preventDefault()
        return
      }

      // FIXME this prints the page in firefox on linux
      if ((event.ctrlKey && event.key === 'p') || event.key === 'ArrowUp') {
        eventHandlers.onPrevious()
        event.preventDefault()
        return
      }

      if (event.key === 'Enter') {
        eventHandlers.onValidate()
        event.preventDefault()
        return
      }
    })
  }

  isVisible() {
    // TODO use the "hidden" attribute
    return this.els.rootEl.classList.contains(css['visible'])
  }

  showPalette() {
    this.els.rootEl.classList.add(css['visible'])
    this.els.input.focus()
  }

  hidePalette() {
    this.els.rootEl.classList.remove(css['visible'])
  }

  hideDropdown() {
    this.els.dropdown.innerHTML = ''
    this.els.dropdown.hidden = true
  }

  showDropdownItems(buttons: HTMLButtonElement[]) {
    this.els.dropdown.innerHTML = ''
    this.els.dropdown.hidden = buttons.length === 0

    buttons.forEach(button => this.els.dropdown.appendChild(button))
  }

  focusItem(item: 'input' | number) {
    if (item === 'input') {
      this.els.input.focus()
    } else {
      const button = this.els.dropdown.children[item]
      if (isFocusable(button)) {
        button.focus()
      }
    }
  }
}

export class Palette {
  nextui: PaletteUI
  domCallbacks: PaletteCallbacks

  pageFocusedElement: null | Element = null

  docElements: HTMLElement[] = []
  dropdownItems: HTMLButtonElement[] = []

  highlightedResultIndex: null | number = null

  constructor(elements: PaletteDOMElements, callbacks: PaletteCallbacks) {
    this.nextui = new PaletteUI(elements, {
      onSearch: this.filterPageElements.bind(this),
      onClearSearch: this.hideDropdown.bind(this),
      onClose: this.hide.bind(this),
      onPrevious: this.highlightPreviousResult.bind(this),
      onNext: this.highlightNextResult.bind(this),
      onValidate: this.validateSelection.bind(this),
    })

    this.domCallbacks = callbacks

    // TODO run this each time when showing the palette
    this.domCallbacks.getInteractiveElements().then(elements => this.setInteractiveElements(elements))
  }

  private filterPageElements(event: Event) {
    const eventTarget = event.target as HTMLInputElement

    if (eventTarget.value === '') {
      this.hideDropdown()
      return
    }

    let filteredLinks = []
    for (let l of this.docElements) {
      // TODO make it fuzzy and case insensitive
      if (l.textContent && l.textContent.includes(eventTarget.value)) {
        filteredLinks.push(l)
      }
    }

    const items = filteredLinks.slice(0, MAX_DROPDOWN_ITEMS)

    if (items.length === 0) {
      this.hideDropdown()
    } else {
      this.showDropdown(items)
    }
  }

  // Public Palette API

  rootEl() {
    return this.nextui.els.rootEl
  }

  showOrFocus(focusedElement: null | Element) {
    if (this.isVisible()) {
      return
    }
    this.pageFocusedElement = focusedElement
    this.highlightedResultIndex = null
    this.nextui.showPalette()
  }

  // Private Palette API

  private setInteractiveElements(elements: NodeList) {
    console.log('setInteractiveElements >>>', elements)
    console.log('as array >>>', [...elements])
    this.docElements = [...elements] as HTMLElement[]
  }

  private isVisible() {
    return this.nextui.isVisible()
  }

  private hide() {
    this.nextui.hidePalette()

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
      this.nextui.focusItem('input')
      return
    }

    this.highlightedResultIndex -= 1

    this.nextui.focusItem(this.highlightedResultIndex)
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

    this.nextui.focusItem(this.highlightedResultIndex)
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

  private showDropdown(elements: HTMLElement[]) {
    // TODO don't throw away items here
    this.dropdownItems = []
    elements.forEach((element, index) => {
      const dropdownButton = document.createElement('button')
      dropdownButton.classList.add(css['dropdown-result'])

      const t = element.textContent || 'no content' // TODO  get the title attributes, or the aria, or the href  or the value

      const elementType = getPrettyTagName(element.tagName)

      dropdownButton.title = `Reference to ${elementType} with content ${t}`

      dropdownButton.innerHTML = `
        <div class="${css['dropdown-result__text']}">${t}</div>
        <div class="${css['dropdown-result__node']}">
          <span class="${css['dropdown-result__node-type']}">${elementType}</span>
          <span>${isLink(element) ? element.href : ''}</span>
        </div>
      `

      dropdownButton.addEventListener('click', (event: Event) => {
        element.click()
        this.hide()
        event.stopPropagation()
      })

      dropdownButton.addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'e') {
          this.pageFocusedElement = null
          element.focus()
          this.hide()
          event.stopPropagation()
        }
      })

      this.dropdownItems.push(dropdownButton)
    })

    this.nextui.showDropdownItems(this.dropdownItems)
  }

  private hideDropdown() {
    // TODO don't throw away items here
    this.dropdownItems = []
    this.nextui.hideDropdown()
  }
}
