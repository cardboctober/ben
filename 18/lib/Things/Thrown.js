// A thing that has been thrown about

import Thing from './Thing.js'
import {translate} from '../matrix.js'


export default class Thrown extends Thing {

  constructor() {
    super()

    this.p = $V([0,0,0])
    this.v = $V([0,0,0])
    this.g = $V([0,6,0])
    
  }

  time (t) {

    const delta =
      this.v
        .add(
          this.g.x(t)
        )
      .x(
        Math.pow(0.6,t)
      )
      .x(t)

    this.transform = translate(
      this.p.e(1) + delta.e(1),
      this.p.e(2) + delta.e(2),
      this.p.e(3) + delta.e(3)
    )

  }

}
