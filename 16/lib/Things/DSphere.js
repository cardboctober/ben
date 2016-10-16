import Thing from './Thing.js'
import {fill, rnd} from '../util.js'

import {rotateX, rotateY,scale} from '../matrix.js'

import triangulate from 'delaunay-triangulate'

// points that are at places at a particular time
export default class DSphere extends Thing {
  constructor(r = .25, count = 100){
    super()

    this.points = []
    for(var i = 0; i < count; i++){
      this.points.push(
        rotateX(Math.random()*Math.PI*2)
        .multiply(
          rotateY(Math.random()*Math.PI*2)
        )
        .multiply(
          scale(0.7)
        )
        .multiply($V([0,0,r,1]))
      )
    }

    const tris = triangulate(
      this.points.map(v => v.elements.slice(0,3))
    )

    const m = {}
    const data = this.data
    const points = this.points

    function add(i,j){
      if(j < i) {
        var t = i
        i = j
        j = t
      }

      if(m[i + '-' + j]) {
        return console.log("slip")
      }

      m[i + '-' + j] = true
      data.push([
        points[i],
        points[j]
      ])

    }

    tris.forEach(tri => {
      // add(tri[0], tri[1])
      // add(tri[1], tri[2])
      add(tri[2], tri[3])
    })


    this.tris = tris

    // console.log(tris.length)

  }


  renderx (ctx, transform) {
    const tps = this.points
      .map(p => transform.x(p))
      .map(p =>
        [p.e(1)/p.e(4), p.e(2)/p.e(4)]
      )

    ctx.fillStyle = this.fill || 'rgba(0,32,12,0.5)'

    ctx.beginPath()
    this.tris.forEach(tri => {

      ctx.moveTo(tps[tri[0]][0],tps[tri[0]][1])
      ctx.lineTo(tps[tri[1]][0],tps[tri[1]][1])
      ctx.lineTo(tps[tri[2]][0],tps[tri[2]][1])

    })

    ctx.fill()

  }
}
