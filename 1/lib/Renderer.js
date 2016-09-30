import {
  translate,
  rotateX,
  rotateY,
  scale,
  perspective
} from './matrix.js'

export default class Renderer {

  constructor() {

    this.camera = this.orientation = Matrix.I(4)

    this.canvas = document.createElement('canvas')
    document.body.appendChild(this.canvas)

    this.fit()
    window.addEventListener('resize',
      e => this.fit(), false)

    window.addEventListener('deviceorientation',
      e => this.orient(e), false)

    this.ctx = this.canvas.getContext('2d')
    // this.ctx.lineWidth = 4
    // this.ctx.lineCap = 'round'
    // this.ctx.strokeStyle = '#fff'


  }

  fit() {
    this.canvas.width = this.w = window.innerWidth
    this.canvas.height = this.h = window.innerHeight

    var s = Math.min(this.w, this.h) / 4

    // todo - dual cameras

    this.camera = translate(
      this.w/2,
      this.h/2,
      0
    )
    .multiply(scale(s))
    .multiply(perspective(0.1))


    this.dirty = true

  }

  orient(e) {

    this.orientation =
      rotateY(
        ((-e.alpha/360) + 1) * Math.PI*2
      )
      .multiply(
        rotateX(0.1)
      )

    this.dirty = true

  }

  render(obj) {
    var ctx = this.ctx
    ctx.clearRect(0,0,this.w, this.h)

    console.log(this.camera.inspect())
    const t =
      this.camera
      .multiply(this.orientation)

    ctx.beginPath()
    for (var i = 0; i < obj.data.length; i++) {
      var l = obj.data[i]
      var a = t.x(l[0])
      var b = t.x(l[1])

      ctx.moveTo(a.e(1)/a.e(4), a.e(2)/a.e(4))
      ctx.lineTo(b.e(1)/b.e(4), b.e(2)/b.e(4))
    }
    ctx.stroke()

    // stash incase we have to re-render on size or orientation change
    this.rendered = obj
    this.dirty = false
  }

}
