import {Palette} from './palette'

// This script runs in the document context

function mountPalette(doc: Document) {
  function getLinks() {
    // TODO Select more than just links
    const links = doc.querySelectorAll('a')
    return Promise.resolve(links.values())
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
      getLinks,
    }
  )

  doc.body.appendChild(palette.ui.rootEl)

  function showOrFocus(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'e') {
      const activeElement = doc.activeElement
      palette.showOrFocus(activeElement)
      return
    }
  }

  doc.removeEventListener('keyup', showOrFocus)

  doc.addEventListener('keyup', showOrFocus)

  return palette
}

export {mountPalette}
