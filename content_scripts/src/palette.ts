import {PaletteUI, DropdownItem} from './palette-ui'
import {isFocusable, isLink, getPrettyTagName} from './utils'

const MAX_DROPDOWN_ITEMS = 5

type PaletteCallbacks = {
  getInteractiveElements: () => Promise<NodeList>
}

export class Palette {
  ui: PaletteUI
  domCallbacks: PaletteCallbacks

  pageFocusedElement: null | Element = null

  docElements: HTMLElement[] = []
  dropdownItems: DropdownItem[] = []

  highlightedResultIndex: null | number = null

  constructor(rootEl: HTMLDivElement, callbacks: PaletteCallbacks) {
    this.ui = new PaletteUI(rootEl, {
      onSearch: this.filterPageElements.bind(this),
      onClearSearch: this.hideDropdown.bind(this),
      onClose: (element?: HTMLElement) => this.hide(element),
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

    const searchValue = eventTarget.value.toLowerCase()

    let filteredLinks = []
    for (let l of this.docElements) {
      if (l.textContent && l.textContent.toLowerCase().includes(searchValue)) {
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

  showOrFocus(focusedElement: null | Element) {
    if (this.isVisible()) {
      return
    }
    this.pageFocusedElement = focusedElement
    this.highlightedResultIndex = null
    this.ui.showPalette()
  }

  // Private Palette API

  private setInteractiveElements(elements: NodeList) {
    this.docElements = [...elements] as HTMLElement[]
  }

  private isVisible() {
    return this.ui.isVisible()
  }

  private hide(elementToFocus?: HTMLElement) {
    this.ui.hidePalette()

    if (elementToFocus) {
      elementToFocus.focus()
    } else if (isFocusable(this.pageFocusedElement)) {
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
      this.ui.focusItem('input')
      return
    }

    this.highlightedResultIndex -= 1

    this.ui.focusItem(this.highlightedResultIndex)
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

    this.ui.focusItem(this.highlightedResultIndex)
  }

  private validateSelection() {
    if (this.dropdownItems.length === 0) {
      return
    }

    if (this.highlightedResultIndex === null) {
      this.dropdownItems[0].pageElement.click()
      return
    }

    this.dropdownItems[this.highlightedResultIndex].pageElement.click()
  }

  private showDropdown(elements: HTMLElement[]) {
    this.dropdownItems = []

    elements.forEach((element, index) => {
      const dropdownThing: DropdownItem = {
        // TODO  get the title attributes, or the aria, or the href  or the value
        content: element.textContent || 'no content',
        kind: getPrettyTagName(element.tagName),
        action: isLink(element) ? element.href : '',
        pageElement: element,
      }

      this.dropdownItems.push(dropdownThing)
    })

    this.ui.showDropdownItems(this.dropdownItems)
  }

  private hideDropdown() {
    this.ui.hideDropdown()
  }
}
