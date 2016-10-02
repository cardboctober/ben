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




  }

  fit() {

    var ratio = window.devicePixelRatio || 1

    this.canvas.width = this.w = window.innerWidth * ratio
    this.canvas.height = this.h = window.innerHeight * ratio

    if(ratio != 1) {
      this.canvas.style.width = window.innerWidth + 'px'
      this.canvas.style.height = window.innerHeight + 'px'
    }

    this.ctx = this.canvas.getContext('2d')
    this.ctx.lineWidth = 3
    this.ctx.lineCap = 'round'
    this.ctx.strokeStyle = '#000'

    var s = Math.min(this.w, this.h) / 9

    this.left = translate(
      this.w/4,
      this.h/2,
      0
    )
    .multiply(scale(s))
    .multiply(perspective(0.1))
    .multiply(rotateY(-0.05))

    this.right = translate(
      this.w*.75,
      this.h/2,
      0
    )
    .multiply(scale(s))
    .multiply(perspective(0.1))
    .multiply(rotateY(0.05))


    this.dirty = true

  }

  orient(e) {

    // There is definitely a better way of doing this, but this'll do for now

    var up = ((e.gamma + 180) % 180) - 90

    var off = 0
    if(e.gamma > 0) {
      off = Math.PI
    }

    this.orientation =
      rotateX(up/50)
      .multiply(
        rotateY(
          (((-e.alpha/360) + 1) * Math.PI*2) + off
        )
      )

    this.dirty = true

  }

  render(obj) {
    var ctx = this.ctx
    ctx.clearRect(0,0,this.w, this.h)

    ;[this.left, this.right].forEach(camera => {
      const t =
        camera
        .multiply(this.orientation)

      ctx.beginPath()
      for (var i = 0; i < obj.data.length; i++) {
        var l = obj.data[i]
        var a = t.x(l[0])
        var b = t.x(l[1])

        a = a.multiply(1/a.e(4))
        b = b.multiply(1/b.e(4))

        var x = a.e(1)
        var y = a.e(2)
        var r = a.distanceFrom(b)

        ctx.moveTo(
          x + r,
          y
        )

        ctx.ellipse(
            x,
            y,
            r, r,
            0, 0, Math.PI*2
        )
      }
      ctx.fill()

    })

    this.dirty = false
  }

}
