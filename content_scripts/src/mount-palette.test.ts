import {queries, fireEvent} from '@testing-library/dom'
import {mountPalette} from './mount-palette'
import '@testing-library/jest-dom'

function mountTestPalette(doc: Document) {
  mountPalette(doc)
}

describe('mountPalette', () => {
  test('shows the palette when pressing ctrl-f', () => {
    mountPalette(document)

    expect(queries.getByTestId(document.body, 'accessible-palette')).not.toHaveClass('visible')

    fireEvent.keyUp(document.body, { key: 'f', ctrlKey: true })

    expect(queries.getByTestId(document.body, 'accessible-palette')).toHaveClass('visible')
  })
})
