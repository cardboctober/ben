import { rotateX, rotateY, I } from './matrix.js'

import Notify from './Notify.js'

export default class Pose extends Notify{

  constructor () {
    super()

    window.addEventListener('mousemove',
      this.handleMouse.bind(this),
      {passive:true}
    )


    new FULLTILT.getDeviceOrientation({ 'type': 'game' })
    .then(controller => {
      (this.controller = controller)
        .start(this.handleTilt.bind(this))
    })
    .catch(e => console.log("no device orientation events"))



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

  handleTilt() {

    const m = this.controller.getScreenAdjustedMatrix().elements
    console.log(m)

    this.transform = $M([
      [m[0],m[1],m[2],0],
      [m[3],m[4],m[5],0],
      [m[6],m[7],m[8],0],
      [0, 0, 0, 1]
    ]).inverse()

    this.fire('change', this.transform)

  }
}
