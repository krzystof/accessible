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

  doc.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'e') {
      palette.showOrFocus(doc.activeElement)
      return
    }

    if (palette.isHidden()) {
      return
    }

    if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) {
      palette.hide()
    }

    if (event.ctrlKey && event.key === 'n') {
      palette.highlightNextResult()
    }

    if (event.ctrlKey && event.key === 'p') {
      palette.highlightPreviousResult()
    }

    if (event.key === 'Enter') {
      palette.validateSelection()
    }
  })

  return palette
}

export {mountPalette}
