// Because Object is already a thing

import {I} from '../matrix.js'

export default class Thing {
  constructor () {
    this.transform = I
    this.data = []
    this.children = []
  }

  add(thing) {
    this.children.push(thing)
  }
}
