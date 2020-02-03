import {queries, wait, within, fireEvent} from '@testing-library/dom'
import {mountPalette} from './mount-palette'
import '@testing-library/jest-dom'

function testPalette(doc: Document) {
  mountPalette(doc)
  return {
    body: doc.body,
  }
}

describe('click interactive element with the keyboard', () => {
  test('shows the palette when pressing ctrl-f', () => {
    mountPalette(document)

    expect(queries.getByTestId(document.body, 'accessible-palette')).not.toHaveClass('visible')

    fireEvent.keyUp(document.body, { key: 'f', ctrlKey: true })

    expect(queries.getByTestId(document.body, 'accessible-palette')).toHaveClass('visible')
  })

  test('filters the document links by their href on input and show them in the dropdown', async () => {
    document.body.innerHTML = `
      <div>
        <a href="javascript">javascript</a>
        <a href="java">java</a>
        <a href="php">php</a>
      </div>
    `

    const { body } = testPalette(document)

    fireEvent.keyUp(document.body, { key: 'f', ctrlKey: true })

    await wait(() =>
      expect(queries.getByTitle(body, 'search-input')).toBeInTheDocument()
    )

    fireEvent.input(queries.getByTitle(body, 'search-input'), {target: {value: 'jav'}});

    const dropdown = within(queries.getByTestId(body, 'accessible-palette-dropdown'))

    expect(dropdown.getByText('javascript')).toBeInTheDocument()
    expect(dropdown.getByText('java')).toBeInTheDocument()
    expect(dropdown.queryByText('php')).toBeNull()
  })

  test('highlight an item, then press enter to navigate to it', async () => {
    document.body.innerHTML = `
      <div>
        <a href="javascript">javascript</a>
        <a href="java">java</a>
        <a href="php">php</a>
      </div>
    `

    const { body } = testPalette(document)

    fireEvent.keyUp(document.body, { key: 'f', ctrlKey: true })

    await wait(() =>
      expect(queries.getByTitle(body, 'search-input')).toBeInTheDocument()
    )

    fireEvent.input(queries.getByTitle(body, 'search-input'), {target: {value: 'jav'}});

    fireEvent.keyUp(document.body, { key: 'n', ctrlKey: true })

    const dropdown = within(queries.getByTestId(body, 'accessible-palette-dropdown'))
    expect(dropdown.getByText('javascript')).toHaveFocus()

    fireEvent.keyUp(document.body, { key: 'n', ctrlKey: true })
    expect(dropdown.getByText('java')).toHaveFocus()

    const spyClick = jest.fn()
    dropdown.getByText('java').addEventListener('click', spyClick)
    expect(spyClick).not.toHaveBeenCalled()

    fireEvent.keyUp(document.body, { key: 'Enter' })

    expect(spyClick).toHaveBeenCalled()
  })

  test.todo('navigate the list up and down')
})
