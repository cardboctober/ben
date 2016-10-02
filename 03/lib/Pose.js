import { rotateX, rotateY, I } from './matrix.js'

import Notify from './Notify.js'

export default class Pose extends Notify{

  constructor () {
    super()

    window.addEventListener('deviceorientation',
      this.handle.bind(this),
      false
    )

    this.transform = I
  }

  handle(e) {

    var up = ((e.gamma + 180) % 180) - 90

    var off = 0
    if(e.gamma > 0) {
      off = Math.PI
    }

    this.transform =
      rotateX(up/50)
      .multiply(
        rotateY(
          (((-e.alpha/360) + 1) * Math.PI*2) + off
        )
      )

    this.fire('change', this.transform)
  }
}
