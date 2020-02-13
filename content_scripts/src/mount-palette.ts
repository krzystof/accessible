import {Palette} from './palette'

// This script runs in the document context

function mountPalette(doc: Document) {
  function getInteractiveElements() {
    // TODO Select more than just links
    const elements = doc.querySelectorAll('a, button')
    return Promise.resolve(elements)
  }

  const rootEl = doc.createElement('div')

  const palette = new Palette(rootEl, {
    getInteractiveElements,
  })

  doc.body.appendChild(rootEl)

  doc.body.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'e') {
      palette.showOrFocus(doc.activeElement)
    }
  })

  return palette
}

export {mountPalette}
