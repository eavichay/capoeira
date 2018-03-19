const initializedStyles = {}


const createFromStyleNode = node => {
  const content = node.innerText.trim()
  if (content.length) {
    return `<style>${content}</style>`
  }
  return ''
}

const createFromSharedStyleNode = node => {
  const src = node.getAttribute('src')
  return `<style>@import url(${src})</style>`
}

const createFromLinkNode = node => {
  const src = node.getAttribute('href')
  return `<style>@import url(${src})</style>`
}

const convertSharedStyleNodes = () => {
  const container = document.querySelector('shared-styles-container')
  ;[...document.querySelectorAll('shared-style')].forEach(node => {
    const e = document.createElement('link')
    const src = node.getAttribute('src')
    const name = node.getAttribute('name') || ''
    e.rel = 'stylesheet'
    e.href = src
    e.setAttribute('shared', name)
    container.shadowRoot.appendChild(e)
  })
}

// document.addEventListener('DOMContentLoaded', convertSharedStyleNodes)

const injectSharedStyles = function () {
  if (!this.shadowRoot) return

  const sharedStylesContainer = document.querySelector('shared-styles-container')
  const sharedStylesId = ['', ...this.constructor.sharedStyles]
  const html = [
    ...document.querySelectorAll('shared-style'),
    ...sharedStylesContainer.shadowRoot.querySelectorAll('link[rel="stylesheet"][shared]'),
    ...document.querySelectorAll('link[rel="stylesheet"][shared]'),
    ...document.querySelectorAll('style[shared]')
  ].map(node => {
    const sharedId = node.localName === 'shared-style'
      ? node.getAttribute('name') || ''
      : node.getAttribute('shared')
    console.log(sharedId)
    if (sharedStylesId.includes(sharedId)) {
      switch (node.localName) {
        case 'shared-style':
          return createFromSharedStyleNode(node)
        case 'style':
          return createFromStyleNode(node)
        case 'link':
          return createFromLinkNode(node)
        default:
          return ''
      }
    }
  }).join('')
  const range = document.createRange()
  range.setStart(this.shadowRoot, 0)
  const frag = range.createContextualFragment(html)
  this.shadowRoot.appendChild(frag)
} 

function SharedStyleMixin () {
  this.constructor.sharedStyles && this.addEventListener('afterRender', () => {
    injectSharedStyles.call(this)
  })
}

export default SharedStyleMixin