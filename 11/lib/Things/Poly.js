import Thing from './Thing.js'

export default class Poly extends Thing {

  constructor(points) {
    this.points = points.map($V)
  }

  render (ctx, transform) {
    ctx.fillStyle = this.fill || '#000'
    ctx.beginPath()
    this.points
      .map(p => transform.x(p))
      .forEach(p => {
        ctx.lineTo(p.e(1)/p.e(4), p.e(2)/p.e(4))
      })
    ctx.fill()
  }
}
