import Thing from './Thing.js'

const norm = (v) =>
  v.multiply(1/v.e(4))


export default class Balls extends Thing {

  constructor(balls) {
    super()

    this.balls = balls

    // this.position  = $V([x,y,z,1])
    // this.positionR = $V([x+r,y,z,1])
    // this.r = r
  }

  render (ctx, transform) {
    ctx.fillStyle = this.fill || '#000'
    ctx.beginPath()

    this.balls
      .forEach(b => {
        const v = norm(transform.x($V([b.x,b.y,b.z,1])))
        const r = norm(transform.x($V([b.x+b.r,b.y,b.z,1])))
          .distanceFrom(v)

        ctx.moveTo(v.e(1)+r, v.e(2))
        ctx.arc(v.e(1), v.e(2), r, 0, Math.PI*2)
      })

    ctx.stroke()
  }
}
