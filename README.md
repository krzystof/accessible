<div align="center">

# Accessible

<img
  height="80"
  width="80"
  alt="accessible logo"
  src="https://user-images.githubusercontent.com/11472671/74068476-53b35980-49c1-11ea-92c5-a333dd7b195b.png"
/>

<p>A browser extension to interact with the page with the keyboard.</p>

</div>

<hr/>

## ⚠️ Under development, things are unstable!(See TODOS.md)

## Usage

![accessible_demo](https://user-images.githubusercontent.com/11472671/74067079-0386c800-49be-11ea-859e-75915608eaa5.gif)

*Commands:*
- `ctrl-e` to open the palette. Type to filter the links on the page.
- `ctrl-e` clears the input
- `ctrl-n` or arrow down highlight the next result
- `ctrl-p` or arrow up highlight the previous result
- `ctrl-e` on an highlighted item closes the palette and focus the element on the page
- `Enter` on an highlighted item navigates to the link
- `Escape` or `ctrl-c` closes the palette

## Installation

*Coming soon* The extension is not stable enough yet to install it on your Firefox instance (Chromium browsers not tested, coming later).

## Development

Dependencies: Firefox, `npm install --global web-ext` and `yarn install`
Run `yarn dev` to build the code, and `yarn web-ext` to open Firefox with the extension
