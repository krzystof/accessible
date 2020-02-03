import {Palette} from './palette'

// This script runs in the document context

function mountPalette(doc: Document) {
  const palette = new Palette({
    rootEl: doc.createElement('div'),
    wrap: doc.createElement('div'),
    dropdown: doc.createElement('div'),
    inputWrap: doc.createElement('div'),
    input: doc.createElement('input'),
  })

  palette.addEventListener('getLinks', () => {
    // TODO Select more than just links
    const links = doc.querySelectorAll('a').values()
    palette.setLinks(links)
  })

  doc.body.appendChild(palette.ui.rootEl)

  doc.addEventListener('keyup', palette.handleKeyUp)

  return palette
}

export {mountPalette}
