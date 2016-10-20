// A thing that has been thrown about

import Thing from './Thing.js'
import {translate} from '../matrix.js'


export default class Thrown extends Thing {

  constructor(data) {
    super()

    this.data = data

    this.g = 6

  }

  time (t) {

    const damp = Math.pow(0.6,t) * t

    const d = this.data

    const delta = {
      x: d.p.x + d.v.x * damp,
      y: d.p.y + (d.v.y + this.g * t) * damp,
      z: d.p.z + d.v.z * damp
    }

    this.transform = translate(
      delta.x,
      delta.y,
      delta.z
    )

  }

}
