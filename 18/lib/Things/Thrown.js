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

    const d = this.data

    const delta = {
      x: (d.v.x) * Math.pow(0.6,t) * t,
      y: (d.v.y + (this.g * t)) * Math.pow(0.6,t) * t,
      z: (d.v.z) * Math.pow(0.6,t) * t
    }

    this.transform = translate(
      d.p.x + delta.x,
      d.p.y + delta.y,
      d.p.z + delta.z
    )

  }

}
