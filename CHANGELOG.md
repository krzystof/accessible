# Changelog

## [Unreleased]
### Changed
- Make the search case insensitive
- Move the logic to create html buttons in the ui class
- Highlight the element on the page related to the highlighted dropdown item

----

## [0.1.0] - 2020-02-11
> The version that I'll dogfood
### Added
- Open the palette with `ctrl-e`
- Search for links or buttons on the page and navigate the matches with `ctrl-n` (next) and `ctrl-p` (previous)
- Clear the search with `ctrl-e` (when search is focused)
- Focus the highlighted element with `ctrl-e` (when an item of the dropdown is focused)
- Close the palette with `ctrl-c` or `Escape`
- Press `Enter` on an highlighted element to clink the element
- Press `Enter` with no highlighted element to click the first element of the matching items
- Use CSS modules to prevent CSS clashes with the page styles

----

[Unreleased]: https://github.com/krzystof/accessible/compare/v0.1.0...HEAD
[0.1]: https://github.com/krzystof/accessible/releases/tag/v0.1.0
