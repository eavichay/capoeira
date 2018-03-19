import Capoeira from '../lib'
import SharedStyleMixin from '../lib/share-style-mixin'
import ModelMixin from '../lib/share-model-mixin'
import { Slim } from 'slim-js'
import { tag, template, useShadow } from 'slim-js/Decorators'

require('../lib/model')

@tag('x-x-x')
@template(`
  <h2 bind>Hello {{(model).test.a}}</h2>
  <c-collection ref="myCollection" change="handleChange"></c-collection>
`)
@useShadow(true)
class Demo extends Capoeira(
  SharedStyleMixin,
  ModelMixin('test', {a: 123})
) {

  static get sharedStyles () {
    return ['abc', 'sbootstrap']
  }

  handleChange (e) {
    console.log(e)
  }
  
  get useShadow() { return true }
  
  constructor () {
    super()
    window.x = this
  }

  onRender () {
    this.myCollection.add('hello')
    this.myCollection.add('world')
    this.myCollection.forEach((a, b, c) => {
      console.log(a, b, c)
    });
  }
}