import {mountPalette} from './mount-palette'

// This script runs in the context of the Browser extension.

(function () {
  if (window.hasRun) {
    return
  }
  window.hasRun = true

  console.log('The extension is running')


  // TODO example
  // browser.runtime.onMessage.addListener((message) => {
  //   if (message.command === 'try') {
  //     console.log('try message >>>', message)
  //   }
  // })


  try {
    mountPalette(document)
  } catch (error) {
    console.error('Could not mount the palette:', error.toString())
    return
  }
})()
