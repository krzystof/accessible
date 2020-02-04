import {screen, queries, wait, within, fireEvent} from '@testing-library/dom'
import {mountPalette} from './mount-palette'
import '@testing-library/jest-dom'

function testPalette(doc: Document) {
  mountPalette(doc)

  return {
    body: doc.body,
    palette: {
      getRoot() {
        return queries.getByTestId(doc.body, 'accessible-palette')
      },
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

  test('clears the dropdown if the search query is empty', async () => {
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

    fireEvent.input(palette.getSearchInput(), {target: {value: 'php'}})

    const dropdown = palette.getDropdown()
    expect(dropdown.queryByText('php')).toHaveTextContent('php')
    expect(queries.getByTestId(body, 'accessible-palette-dropdown')).toBeVisible()

    fireEvent.input(palette.getSearchInput(), {target: {value: ''}})

    expect(dropdown.queryByText('php')).toBeNull()
    expect(queries.getByTestId(body, 'accessible-palette-dropdown')).not.toBeVisible()
  })

  test('click on the first item of the dropdown when pressing enter and focus is on the input', async () => {
    const spyJavascriptClick = jest.fn()
    const spyJavaClick = jest.fn()
    const spyPhpClick = jest.fn()
    document.body.innerHTML = `
      <div>
        <a href="#javascript">javascript</a>
        <a href="#java">java</a>
        <a href="#php">php</a>
      </div>
    `
    document.querySelector('[href="#javascript"]')!.addEventListener('click', spyJavascriptClick)
    document.querySelector('[href="#java"]')!.addEventListener('click', spyJavaClick)
    document.querySelector('[href="#php"]')!.addEventListener('click', spyPhpClick)

    const {body, palette} = testPalette(document)

    fireEvent.keyUp(body, {key: 'f', ctrlKey: true})

    await wait(() => expect(palette.getSearchInput()).toBeInTheDocument())

    fireEvent.keyUp(body, {key: 'Enter'})

    expect(spyJavascriptClick).not.toHaveBeenCalled()
    expect(spyJavaClick).not.toHaveBeenCalled()
    expect(spyPhpClick).not.toHaveBeenCalled()

    fireEvent.input(palette.getSearchInput(), {target: {value: 'jav'}})
    fireEvent.keyUp(body, {key: 'Enter'})

    expect(spyJavascriptClick).toHaveBeenCalled()
    expect(spyJavaClick).not.toHaveBeenCalled()
    expect(spyPhpClick).not.toHaveBeenCalled()
  })

  test('type Esc or ctrl-c to close the palette', async () => {
    document.body.innerHTML = `
      <div>
        <a href="#javascript">javascript</a>
        <a href="#java">java</a>
        <a href="#php">php</a>
      </div>
    `

    const {body, palette} = testPalette(document)

    expect(palette.getRoot()).not.toHaveClass('visible')

    fireEvent.keyUp(body, {key: 'f', ctrlKey: true})
    expect(palette.getRoot()).toHaveClass('visible')

    fireEvent.keyUp(body, {key: 'Esc'})
    expect(palette.getRoot()).not.toHaveClass('visible')

    fireEvent.keyUp(body, {key: 'f', ctrlKey: true})
    expect(palette.getRoot()).toHaveClass('visible')

    fireEvent.keyUp(body, {key: 'c', ctrlKey: true})
    expect(palette.getRoot()).not.toHaveClass('visible')
  })
})
