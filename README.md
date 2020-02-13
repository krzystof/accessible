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

![demo](https://user-images.githubusercontent.com/11472671/74071492-a98bff80-49c9-11ea-84fa-815c7546be07.gif)

*Commands:*
- `ctrl-e` to open the palette. Type to filter the links on the page.
- `ctrl-e` clears the input
- `ctrl-n` or arrow down highlight the next result
- `ctrl-p` or arrow up highlight the previous result
- `ctrl-e` on an highlighted item closes the palette and focus the element on the page
- `Enter` on an highlighted item navigates to the link
- `Escape` or `ctrl-c` closes the palette

The extension will also override the focus state on the page with a big red border.
Focus states are too often overriden and it can be hard to know which element is focused on the page. I believe that users should be able to define their own preferred focus state as a browser setting. (Coming later: define your custom styles for the focus state)

## Installation

The extension is not stable enough yet to install it on your Firefox instance via the addon store (Chromium browsers not tested, coming later).

You can install it manually (until Firefox is restarted) using the following steps:
- run `yarn dev` to build the javascript assets
- run `web-ext build` to generate the artifact in `./web-ext-artifacts/accessible-vX.X.X.zip`
- open `about:debugging` in Firefox
- click "This Firefox", "Load Temporary Add-On" and select generated zip file

## Development

Install dependencies: Firefox, `npm install --global web-ext` and `yarn install`

Run `yarn dev` to build the code, and `yarn web-ext` to open Firefox with the extension
