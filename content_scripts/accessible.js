(function () {
  if (window.hasRun) {
    return
  }
  window.hasRun = true

  console.log('>>>', 'Then extension has run!')

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'try') {
      console.log('try message >>>', message)
    }
  })

  function buildPalette() {
    console.log('>>>', 'Building the palette')

    const el = document.createElement('div')
    el.classList.add('accessible-palette')

    const wrap = document.createElement('div')
    wrap.classList.add('wrap')

    const input = document.createElement('input')
    input.addEventListener('input', (event) => {
      console.log('>>>', 'input', event.target.value)
    })
    input.addEventListener('blur', (event) => {
      el.classList.remove('visible')
    })

    wrap.appendChild(input)
    el.appendChild(wrap)
    document.body.appendChild(el)

    // The API of the palette responding to DOM events
    return {
      show() {
        el.classList.add('visible')
        input.focus()
      },
    }
  }

  let palette

  try {
    palette = buildPalette()
  } catch (error) {
    console.error('Could not build the palette:', error.toString())
  }

  window.onkeyup = (e) => {
    if (e.code === 'Comma') {
      browser.runtime.sendMessage('openPalette')

      if (e.target == document.body) {
        palette.show()
      }
    }
  }
})()
