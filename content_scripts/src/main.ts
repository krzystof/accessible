(function () {
  if (window.hasRun) {
    return
  }
  window.hasRun = true
  console.log('>>>', 'The extension is running')

  const MAX_DROPDOWN_ITEMS = 5

  // browser.runtime.onMessage.addListener((message) => {
  //   if (message.command === 'try') {
  //     console.log('try message >>>', message)
  //   }
  // })

  function buildPalette() {
    console.log('>>>', 'Building the palette')

    const links = document.querySelectorAll('a')

    console.log('>>>', 'Links on the page: ', links)

    // Model
    let filteredLinks = []
    let highlightedResultIndex: null | number = null
    let dropdownItems: HTMLButtonElement[] = []
    // end model

    // begin Initialise the node elements
    const el = document.createElement('div')
    el.classList.add('accessible-palette')

    const wrap = document.createElement('div')
    wrap.classList.add('wrap')

    const dropdown = document.createElement('div')
    dropdown.classList.add('dropdown')

    const inputWrap = document.createElement('div')
    inputWrap.classList.add('input-wrap')

    const input = document.createElement('input')
    // end

    function showDropdown(items: HTMLAnchorElement[]) {
      dropdown.innerHTML = ''
      dropdownItems = []

      items.forEach((item, index) => {
        const result = document.createElement('button')
        const itemClass = `dropdown-result-num-${index}`
        result.classList.add('dropdown-result')
        result.classList.add(itemClass)
        result.addEventListener('click', () => {
          item.click()
        })
        let t = item.textContent
        result.textContent = t || 'no content for this link'
        // result.referencedNode = item
        dropdownItems.push(result)
        dropdown.appendChild(result)
      })
    }

    input.addEventListener('input', (event: Event) => {
      try {
        const eventTarget = event.target as HTMLInputElement
        console.log('input:', eventTarget.value)

        let newFilteredLinks = []
        for (let l of links.values()) {
          // make it case insensitive
          if (l && l.textContent && l.textContent.includes(eventTarget.value)) {
            newFilteredLinks.push(l)
          }
        }
        filteredLinks = newFilteredLinks

        const items = filteredLinks.slice(0, MAX_DROPDOWN_ITEMS)

        showDropdown(items)
      } catch (e) {
        console.error('Err on input handler:', e)
      }
    })

    input.addEventListener('blur', (event) => {
      // el.classList.remove('visible')
    })

    // begin append to the DOM
    inputWrap.appendChild(input)
    wrap.appendChild(inputWrap)
    wrap.appendChild(dropdown)
    el.appendChild(wrap)
    document.body.appendChild(el)
    // end

    // The API of the palette responding to DOM events
    return {
      isHidden() {
        return !el.classList.contains('visible')
      },
      show() {
        console.log('>>>', 'showing the palette')
        el.classList.add('visible')
        input.focus()
      },
      highlightPreviousResult() {
        const shownItems = filteredLinks.length

        if (shownItems === 0) {
          highlightedResultIndex = null
          return
        }

        if (highlightedResultIndex === null) {
          return
        }

        if (highlightedResultIndex === 0) {
          highlightedResultIndex = null
          input.focus()
          return
        }

        highlightedResultIndex -= 1

        dropdownItems[highlightedResultIndex].focus()
      },
      highlightNextResult() {
        const shownItems = filteredLinks.length

        if (shownItems === 0) {
          highlightedResultIndex = null
          return
        }

        if (highlightedResultIndex === null) {
          highlightedResultIndex = 0
        } else if (highlightedResultIndex + 1 === shownItems) {
          return // because we're at the end of the list
        } else {
          highlightedResultIndex += 1
        }

        console.log('>>>', 'highlightedResultIndex', highlightedResultIndex)

        dropdownItems[highlightedResultIndex].focus()
      },
      validateSelection() {
        if (filteredLinks.length === 0) {
          return
        }

        if (highlightedResultIndex === null) {
          // dropdown.childNodes[0].referencedNode.click()
          return
        }
      },
    }
  }

  let palette: any

  try {
    palette = buildPalette()
  } catch (error) {
    console.error('Could not build the palette:', error.toString())
    return
  }

  window.onkeyup = (e: KeyboardEvent) => {
    console.log('Keylog>>>', e)

    if (e.ctrlKey && e.key === 'f') {
      // browser.runtime.sendMessage('openPalette')

      palette.show()
    }

    if (palette.isHidden()) {
      return
    }

    if (e.ctrlKey && e.key === 'n') {
      console.log('>>>', 'show next')
      palette.highlightNextResult()
    }

    if (e.ctrlKey && e.key === 'p') {
      palette.highlightPreviousResult()
    }

    if (e.key === 'Enter') {
      palette.validateSelection()
    }

  }
})()
