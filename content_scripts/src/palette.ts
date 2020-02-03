const MAX_DROPDOWN_ITEMS = 5

type PaletteDOMElements = {
  rootEl: HTMLDivElement
  wrap: HTMLDivElement
  dropdown: HTMLDivElement
  inputWrap: HTMLDivElement
  input: HTMLInputElement
}

export class Palette extends EventTarget {
  ui: PaletteDOMElements

  docLinks: HTMLAnchorElement[] = []
  dropdownItems: HTMLButtonElement[] = []

  highlightedResultIndex: null | number = null

  constructor(elements: PaletteDOMElements) {
    super()
    this.ui = elements

    this.initUi()
    this.bindEventHandlers()

    this.dispatchEvent(new CustomEvent('getLinks'))
  }

  // Public Palette API

  setLinks(links: IterableIterator<HTMLAnchorElement>) {
    this.docLinks = Array.from(links)
  }

  isHidden() {
    return !this.ui.rootEl.classList.contains('visible')
  }

  show() {
    this.ui.rootEl.classList.add('visible')
    this.ui.input.focus()
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
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'f') {
      this.show()
    }

    if (this.isHidden()) {
      return
    }

    if (event.ctrlKey && event.key === 'n') {
      this.highlightNextResult()
    }

    if (event.ctrlKey && event.key === 'p') {
      this.highlightPreviousResult()
    }

    if (event.key === 'Enter') {
      this.validateSelection()
    }
  }

  // Initial state of the palette

  private initUi() {
    this.ui.rootEl.classList.add('accessible-palette')
    this.ui.wrap.classList.add('wrap')
    this.ui.dropdown.classList.add('dropdown')
    this.ui.dropdown.classList.add('display-none')
    this.ui.inputWrap.classList.add('input-wrap')


    this.ui.inputWrap.appendChild(this.ui.input)
    this.ui.wrap.appendChild(this.ui.inputWrap)
    this.ui.wrap.appendChild(this.ui.dropdown)
    this.ui.rootEl.appendChild(this.ui.wrap)
  }

  private bindEventHandlers() {
    this.ui.input.addEventListener('input', (event: Event) => {
        const eventTarget = event.target as HTMLInputElement
        console.log('handle input on input', eventTarget.value)

        let filteredLinks = []
        for (let l of this.docLinks) {
          // TODO make it case insensitive
          if (l.textContent && l.textContent.includes(eventTarget.value)) {
            filteredLinks.push(l)
          }
        }

        const items = filteredLinks.slice(0, MAX_DROPDOWN_ITEMS)

        // TODO reconcile the ui instead
        this.showDropdown(items)
    })
    // TODO onblur closes the palette
  }

  // Private Palette API

  private showDropdown(links: HTMLAnchorElement[]) {
      this.ui.dropdown.innerHTML = ''

      // TODO don't throw away items here
      this.dropdownItems = []

      links.forEach((link, index) => {
        const node = document.createElement('button')
        const itemClass = `dropdown-result-num-${index}`
        node.classList.add('dropdown-result')
        node.classList.add(itemClass)
        node.addEventListener('click', () => {
          link.click()
        })
        let t = link.textContent
        node.textContent = t || 'no content for this link'

        // TODO this is duplicated, should happen when reconciling DOM
        this.dropdownItems.push(node)
        this.ui.dropdown.appendChild(node)
      })
  }
}
