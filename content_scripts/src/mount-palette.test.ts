import {queries, wait, within, fireEvent} from '@testing-library/dom'
import {mountPalette} from './mount-palette'
import '@testing-library/jest-dom'

function testPalette(doc: Document) {
  mountPalette(doc)

  return {
    body: doc.body,
    palette: {
      getSearchInput() {
        return queries.getByTitle(doc.body, 'search-input')
      },
      getDropdown() {
        return within(queries.getByTestId(doc.body, 'accessible-palette-dropdown'))
      },
    },
  }
}

describe('click interactive element with the keyboard', () => {
  test('shows the palette when pressing ctrl-f', () => {
    const {body} = testPalette(document)

    expect(queries.getByTestId(body, 'accessible-palette')).not.toHaveClass('visible')

    fireEvent.keyUp(body, {key: 'f', ctrlKey: true})

    expect(queries.getByTestId(body, 'accessible-palette')).toHaveClass('visible')
    expect(queries.getByTitle(body, 'search-input')).toHaveFocus()
  })

  test('filters the document links by their href on input and show them in the dropdown', async () => {
    document.body.innerHTML = `
      <div>
        <a href="#javascript">javascript</a>
        <a href="#java">java</a>
        <a href="#php">php</a>
      </div>
    `

    const {body, palette} = testPalette(document)

    fireEvent.keyUp(body, {key: 'f', ctrlKey: true})

    await wait(() => expect(palette.getSearchInput()).toBeInTheDocument())

    fireEvent.input(palette.getSearchInput(), {target: {value: 'jav'}})

    const dropdown = palette.getDropdown()

    expect(dropdown.getByText('javascript')).toBeInTheDocument()
    expect(dropdown.getByText('java')).toBeInTheDocument()
    expect(dropdown.queryByText('php')).toBeNull()
  })

  test('highlight an item, then press enter to navigate to it', async () => {
    const spyClick = jest.fn()
    document.body.innerHTML = `
      <div>
        <a href="#javascript">javascript</a>
        <a href="#java" class="java">java</a>
        <a href="#php">php</a>
      </div>
    `
    const javaLink = document.querySelector('.java')!
    javaLink.addEventListener('click', spyClick)

    const {body, palette} = testPalette(document)

    fireEvent.keyUp(body, {key: 'f', ctrlKey: true})

    await wait(() => expect(palette.getSearchInput()).toBeInTheDocument())

    fireEvent.input(palette.getSearchInput(), {target: {value: 'jav'}})

    const dropdown = palette.getDropdown()

    fireEvent.keyUp(body, {key: 'n', ctrlKey: true})
    expect(dropdown.getByText('javascript')).toHaveFocus()

    fireEvent.keyUp(body, {key: 'n', ctrlKey: true})
    expect(dropdown.getByText('java')).toHaveFocus()

    expect(spyClick).not.toHaveBeenCalled()

    fireEvent.keyUp(body, {key: 'Enter'})

    expect(spyClick).toHaveBeenCalled()
  })

  test('navigate the list up and down', async () => {
    document.body.innerHTML = `
      <div>
        <a href="#javascript">javascript</a>
        <a href="#java">java</a>
        <a href="#php">php</a>
      </div>
    `

    const {body, palette} = testPalette(document)

    fireEvent.keyUp(body, {key: 'f', ctrlKey: true})

    await wait(() => expect(palette.getSearchInput()).toBeInTheDocument())

    fireEvent.input(palette.getSearchInput(), {target: {value: 'jav'}})

    const dropdown = palette.getDropdown()
    expect(queries.getByTitle(body, 'search-input')).toHaveFocus()

    fireEvent.keyUp(body, {key: 'n', ctrlKey: true})
    expect(dropdown.getByText('javascript')).toHaveFocus()

    fireEvent.keyUp(body, {key: 'n', ctrlKey: true})
    expect(dropdown.getByText('java')).toHaveFocus()

    // End of the list, we stay on "java"
    fireEvent.keyUp(body, {key: 'n', ctrlKey: true})
    expect(dropdown.getByText('java')).toHaveFocus()

    fireEvent.keyUp(body, {key: 'p', ctrlKey: true})
    expect(dropdown.getByText('javascript')).toHaveFocus()

    fireEvent.keyUp(body, {key: 'p', ctrlKey: true})
    expect(queries.getByTitle(body, 'search-input')).toHaveFocus()

    // Beginning of the list, stay on the input
    fireEvent.keyUp(body, {key: 'p', ctrlKey: true})
    expect(queries.getByTitle(body, 'search-input')).toHaveFocus()
  })
})
