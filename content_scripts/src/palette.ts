import {PaletteUI, PaletteDOMElements, DropdownItem} from './palette-ui'
import {isFocusable, isLink, getPrettyTagName} from './utils'

const MAX_DROPDOWN_ITEMS = 5

type PaletteCallbacks = {
  getInteractiveElements: () => Promise<NodeList>
}

export class Palette {
  nextui: PaletteUI
  domCallbacks: PaletteCallbacks

  pageFocusedElement: null | Element = null

  docElements: HTMLElement[] = []
  dropdownItems: DropdownItem[] = []

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

    this.nextui.showDropdownItems(this.dropdownItems)
  }

  private hideDropdown() {
    this.nextui.hideDropdown()
  }
}
