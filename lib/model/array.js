import Capoeira from '../index'
import { tag } from 'slim-js/Decorators'
import { Slim } from 'slim-js';

@tag('c-collection')
class CollectionModel extends Capoeira () {

    onBeforeCreated () {
        this.collection = new Set()
        const inbounds = [
            'add',
            'delete',
            'clear'
        ]
        const outbounds = [
            'entries',
            'has',
            'keys',
            'toJSON',
            'values'
        ]

        const self = this

        ;[...inbounds, ...outbounds]
            .forEach(fnName => {
                self[fnName] = function () {
                    const result = self.collection[fnName](...arguments)
                    if (inbounds.includes(fnName)) {
                        self.dispatchEvent(
                            new CustomEvent('change', {
                                detail: {
                                    action: fnName,
                                    data: arguments,
                                    result: result
                                }
                            })
                        )
                    }
                    return result
                }
            })
    }

    onCreated () {
        const ref = this.getAttribute('ref')
        if (ref !== null && ref !== '') {
            Slim._$(this).boundParent[ref] = this
        }
    }

    forEach () {
        this.collection.forEach.call(this.collection, ...arguments)
    }

}
