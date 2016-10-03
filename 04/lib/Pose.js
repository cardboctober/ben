import { rotateX, rotateY, I } from './matrix.js'

import Notify from './Notify.js'

export default class Pose extends Notify{

  constructor () {
    super()

    window.addEventListener('deviceorientation',
      this.handleOrientation.bind(this),
      false
    )

    window.addEventListener('mousemove',
      this.handleMouse.bind(this),
      {passive:true}
    )


    this.transform = I
  }

  handleMouse(e) {
    if(e.buttons === 0) return this.start = null

    this.start = this.start || e

    this.transform =
      rotateY(
        (this.start.clientX - e.clientX) / 100
      )
      .multiply(rotateX(
        (this.start.clientY - e.clientY) / 100
      ))

    this.fire('change', this.transform)

  }

  handleOrientation(e) {

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
