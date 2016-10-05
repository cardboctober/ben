import {
  translate,
  rotateX,
  rotateY,
  scale,
  perspective
} from './matrix.js'

export default class Renderer {

  constructor() {

    this.camera = Matrix.I(4)

    this.canvas = document.createElement('canvas')
    document.body.appendChild(this.canvas)

    this.fit()
    window.addEventListener('resize',
      e => this.fit(), false)

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
    this.ctx.strokeStyle = '#f08'

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

  render(obj) {
    var ctx = this.ctx
    ctx.clearRect(0,0,this.w, this.h)

    ;[this.left, this.right].forEach((camera,x) => {

      ctx.save()
      ctx.beginPath()

      if(x == 0) {
        ctx.lineTo(0,0)
        ctx.lineTo(this.w/2,0)
        ctx.lineTo(this.w/2,this.h)
        ctx.lineTo(0,this.h)
      } else {
        ctx.lineTo(this.w/2,0)
        ctx.lineTo(this.w,0)
        ctx.lineTo(this.w,this.h)
        ctx.lineTo(this.w/2,this.h)
      }
      ctx.clip()


      obj.forEach( obj => {

        // reset context
        ctx.strokeStyle = '#000'

        renderObject(obj, camera, ctx)

      })

      ctx.restore()
    })


    this.dirty = false
  }

}

function renderObject(obj, t, ctx){
  // console.log("-s")

  if(obj.transform)
    t = t.multiply(obj.transform)

  if(obj.color)
    ctx.strokeStyle = obj.color

  if(obj.render) {
    obj.render(ctx, t)

  } else {
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
        a.e(1), a.e(2)
      )
      ctx.lineTo(
        b.e(1), b.e(2)
      )

    }
    ctx.stroke()
  }


  if(obj.children) {
    obj.children.forEach(child =>
      renderObject(child, t, ctx)
    )
  }


}
