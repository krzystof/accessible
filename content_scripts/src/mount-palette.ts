import {Palette} from './palette'

// This script runs in the document context

function mountPalette(doc: Document) {
  function getInteractiveElements() {
    // TODO Select more than just links
    const elements = doc.querySelectorAll('a, button')
    return Promise.resolve(elements.values())
  }

  const palette = new Palette(
    {
      rootEl: doc.createElement('div'),
      wrap: doc.createElement('div'),
      dropdown: doc.createElement('div'),
      inputWrap: doc.createElement('div'),
      input: doc.createElement('input'),
    },
    {
      getInteractiveElements,
    }
  )

  doc.body.appendChild(palette.ui.rootEl)

  doc.body.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'e') {
      const activeElement = doc.activeElement
      palette.showOrFocus(activeElement)
      return
    }
  })

  return palette
}

export {mountPalette}
