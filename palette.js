console.log('>>>', 'Now from the palette!')

// browser.tabs.sendMessage(tabs[0].id, {
//   command: 'try',
// })

browser.runtime.onMessage.addListener((e) => {
  console.log('>>>', 'runtime.onMessage')
})

// var createData = {
//   type: "detached_panel",
//   url: "palette.html",
//   width: 250,
//   height: 100
// };
// var creating = browser.windows.create(createData);
