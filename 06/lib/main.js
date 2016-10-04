import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop, rnd, fill} from './util.js'
import Cube from './Things/Cube.js'
import Cross from './Things/Cross.js'
import Path from './Things/Path.js'
import Thing from './Things/Thing.js'

const renderer = new Renderer()
const pose = new Pose()

const world = new Thing()

import {translate, rotateX, rotateY} from './matrix.js'


const points = new Array(50)
fill(points, _ => ({
  point: $V([rnd(3),rnd(3),rnd(3)]),
  heading: $V([rnd(3),rnd(3),rnd(3)]),
  velocity: rnd(0.0002)
}))

const pcubes = points.map( p => {
  const cube = new Cross(0.01)
  cube.color = 'rgba(255,255,255,0.4)'

  cube.p = p

  cube.transform =
    translate(
      p.point.e(1),
      p.point.e(2),
      p.point.e(3)
    )

  world.add(cube)

  return cube
})


const o = {
  data: [],
  color: 'rgba(255,255,255,0.3)'
}

world.add(o)

pose.on('change', transform =>
  world.transform = transform
)

const line = new Path()

loop( t => {

  var ps = pcubes.map( cube => {

    const point =
      cube.p.heading
      .x(t * cube.p.velocity)
      .add(cube.p.point)

    cube.transform =
      translate(
        point.e(1) % 2,
        point.e(2) % 2,
        point.e(3) % 2
      )

    return $V([
      point.e(1) % 2,
      point.e(2) % 2,
      point.e(3) % 2
    ])
  })

  var lines = []
  ps.forEach(a => {
    ps.forEach(b => {
      if(a != b)
      lines.push([
        a,b,a.distanceFrom(b)
      ])
    })
  })

  lines.sort((a,b) => {
    return a[2] - b[2]
  })




  o.data = lines.slice(0,60)
  .map(l => {
    return [
      $V([
        l[0].e(1),
        l[0].e(2),
        l[0].e(3),
        1
      ]),
      $V([
        l[1].e(1),
        l[1].e(2),
        l[1].e(3),
        1
      ])
    ]
  })

  // console.log(lines.length)

  // world.transform
    // = rotateX(t/1000)



  renderer.render([
    world,
  ])
})

import fullscreen from './fullscreen.js'
fullscreen()
