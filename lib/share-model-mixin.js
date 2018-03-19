function SharedModelMixin (name, model) {
    return function () {
        const self = this
        const $ = Slim._$(self)
        const superOnBeforeCreated = this.onBeforeCreated
        self.onBeforeCreated = function () {
            superOnBeforeCreated.call(self)
            self['(model)'] = self['(model)'] || {}
            self['(model)'][name] = new Proxy(model, {
                set: function (obj, prop, value) {
                    obj[prop] = value
                    Slim.commit(self, `(model)`)
                },
                get: function (obj, prop) {
                    return obj[prop]
                }
            })
        }
    }
}
export default SharedModelMixin