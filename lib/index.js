import { Slim } from 'slim-js'

const Capoeira = (...extensions) => {
  if (!extensions.length) return Slim

  return class CapoeiraMixin extends Slim {
    constructor () {
      super()
      const self = this
      ;[...extensions].forEach(ext => {
        ext.apply(self)
      })   
    }
  }
}

if (window) {
  window.Capoeira = Capoeira
}

customElements.define('shared-styles-container', class extends Capoeira() {
  constructor () {
    super()
    const root = this.attachShadow({mode: 'open'})
  }
})

customElements
  .whenDefined('shared-styles-container')
  .then( () => {
    document.body.appendChild(document.createElement('shared-styles-container'))
  })

export default Capoeira
