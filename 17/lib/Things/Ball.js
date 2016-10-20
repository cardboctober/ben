import Thing from './Thing.js'

const norm = (v) =>
  v.multiply(1/v.e(4))


export default class Ball extends Thing {

  constructor(x,y,z,r) {
    super()
    this.position  = $V([x,y,z,1])
    this.positionR = $V([x+r,y,z,1])
    this.r = r
  }

  render (ctx, transform) {

    const p = norm(transform.x(this.position))
    const r = norm(transform.x(this.positionR))
                .distanceFrom(p)

    // hack
    if(r > 300) {
      return
    }

    ctx.fillStyle = this.fill || '#000'
    ctx.beginPath()

    ctx.arc(p.e(1), p.e(2), r, 0, Math.PI*2)




    ctx.fill()
  }
}
