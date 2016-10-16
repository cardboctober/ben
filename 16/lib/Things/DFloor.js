import Thing from './Thing.js'
import {fill, rnd} from '../util.js'

import {rotateX, rotateY,scale, translate} from '../matrix.js'

// import triangulate from 'delaunay-triangulate'
import {triangulate} from '../Delaunay.js'

// points that are at places at a particular time
export default class DFloor extends Thing {
  constructor(r = .25, count = 70){
    super()

    this.points = []
    for(var i = 0; i < count; i++){
      this.points.push(
        $V([
          (Math.random()-.5)*15,
          (Math.random()-.5)*15,
          (Math.random()-.5)*1,
          1
        ])
      )
    }

    const tris = triangulate(
      this.points.map(v => v.elements.slice(0,3))
    )

    this.points = this.points.map(p => rotateX(Math.PI/2)
    .multiply(translate(0,0,-2))
    .multiply(p))

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
        return
      }

      m[i + '-' + j] = true
      data.push([
        points[i],
        points[j]
      ])

    }

    for (var i = 0; i < tris.length; i+=3) {
      add(tris[i],tris[i+1])
      add(tris[i+1],tris[i+2])
    }

    // tris.forEach(tri => {
    //   add(tri[0], tri[1])
    //   add(tri[1], tri[2])
    //   add(tri[2], tri[3])
    // })


    this.tris = tris

    // console.log(tris.length)

  }

}
