import {isFocusable} from './utils'
import css from './palette.module.css'

type PaletteHandlers = {
  onSearch: (event: Event) => void
  onClearSearch: () => void
  onClose: (element?: HTMLElement) => void
  onPrevious: () => void
  onNext: () => void
  onValidate: () => void
}

export type DropdownItem = {
  content: string
  kind: 'link' | 'button' | 'unknown'
  action: string
  pageElement: HTMLElement
}

export class PaletteUI {
  rootEl: HTMLDivElement
  wrap: HTMLDivElement
  input: HTMLInputElement
  dropdown: HTMLDivElement

  onClose: (element?: HTMLElement) => void

  constructor(rootEl: HTMLDivElement, eventHandlers: PaletteHandlers) {
    this.rootEl = rootEl
    this.rootEl.className = css['accessible-palette']
    this.rootEl.dataset.testid = 'accessible-palette'

    this.rootEl.innerHTML = `
      <div class="${css['wrap']}">
        <div class="${css['input-wrap']}">
          <input id="search-input" title="search-input" />
        </div>
        <div class="${css['dropdown']}" hidden="true" data-testid="accessible-palette-dropdown"></div>
      </div>
    `

    this.input = this.rootEl.querySelector('#search-input') as HTMLInputElement
    this.wrap = this.rootEl.querySelector(`.${css['wrap']}`) as HTMLDivElement
    this.dropdown = this.rootEl.querySelector(`.${css['dropdown']}`) as HTMLDivElement

    // this.els = els

    // Initialise the elements
    // this.els.rootEl.classList.add(css['accessible-palette'])
    // this.els.rootEl.dataset.testid = 'accessible-palette'

    // this.els.wrap.classList.add(css['wrap'])
    // this.els.dropdown.classList.add(css['dropdown'])
    // this.els.dropdown.hidden = true
    // this.els.dropdown.dataset.testid = 'accessible-palette-dropdown'

    // this.els.inputWrap.classList.add(css['input-wrap'])

    // this.els.input.title = 'search-input'

    // this.els.inputWrap.appendChild(this.els.input)
    // this.els.wrap.appendChild(this.els.inputWrap)
    // this.els.wrap.appendChild(this.els.dropdown)
    // this.els.rootEl.appendChild(this.els.wrap)

    this.onClose = eventHandlers.onClose

    // Attach event handlers
    this.input.addEventListener('input', eventHandlers.onSearch)

    this.input.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'e') {
        this.input.value = ''
        eventHandlers.onClearSearch()
        event.preventDefault()
        return
      }
    })

    this.rootEl.addEventListener('click', (event: Event) => {
      const eventTarget = event.target as HTMLElement
      if (eventTarget && !this.wrap.contains(eventTarget)) {
        eventHandlers.onClose()
      }
    })

    this.wrap.addEventListener('keydown', (event: KeyboardEvent) => {
      // Prevent the page from scrolling
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()
      }
    })

    this.wrap.addEventListener('keyup', (event: KeyboardEvent) => {
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
    return this.rootEl.classList.contains(css['visible'])
  }

  showPalette() {
    this.rootEl.classList.add(css['visible'])
    this.input.focus()
  }

  hidePalette() {
    this.rootEl.classList.remove(css['visible'])
  }

  hideDropdown() {
    this.dropdown.innerHTML = ''
    this.dropdown.hidden = true
  }

  showDropdownItems(items: DropdownItem[]) {
    this.dropdown.innerHTML = ''
    this.dropdown.hidden = items.length === 0

    items.forEach(item => {
      const button = this.createButtonFromItem(item)
      this.dropdown.appendChild(button)
    })
  }

  focusItem(item: 'input' | number) {
    if (item === 'input') {
      this.input.focus()
    } else {
      const button = this.dropdown.children[item]
      if (isFocusable(button)) {
        button.focus()
      }
    }
  }

  // Maybe extract this to a factory function bound in the constructor
  private createButtonFromItem(item: DropdownItem) {
    const dropdownButton = document.createElement('button')
    dropdownButton.classList.add(css['dropdown-result'])

    dropdownButton.title = `Reference to ${item.kind} with content ${item.content}`

    dropdownButton.innerHTML = `
      <div class="${css['dropdown-result__text']}">${item.content}</div>
      <div class="${css['dropdown-result__node']}">
        <span class="${css['dropdown-result__node-type']}">${item.kind}</span>
        <span>${item.action}</span>
      </div>
    `

    dropdownButton.addEventListener('click', (event: Event) => {
      item.pageElement.click()
      this.onClose()
      event.stopPropagation()
    })

    dropdownButton.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'e') {
        this.onClose(item.pageElement)
        event.stopPropagation()
      }
    })

    dropdownButton.addEventListener('focus', () => {
      item.pageElement.classList.add(css['highlighted-target'])
    })

    dropdownButton.addEventListener('blur', () => {
      item.pageElement.classList.remove(css['highlighted-target'])
    })

    return dropdownButton
  }
}
