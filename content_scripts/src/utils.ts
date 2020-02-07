type FocusableElement = HTMLElement & {focus: () => void}

export function isFocusable(element: null | Element): element is FocusableElement {
  return element ? 'focus' in element : false
}

export function isLink(element: HTMLElement): element is HTMLAnchorElement {
  return 'href' in element
}

export function getPrettyTagName(tagName: string) {
  if (tagName === 'A') {
    return 'link'
  } else if (tagName === 'BUTTON') {
    return 'button'
  } else {
    console.log('>>>', tagName)
    return 'unknown'
  }
}
