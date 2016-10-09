import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop, rnd} from './util.js'
import Thing from './Things/Thing.js'
import Poly from './Things/Poly.js'

const renderer = new Renderer()
const pose = new Pose()

const world = new Thing()

const a = 3
const h = (Math.sqrt(3)/2)*a


const triangle = new Poly([
  [0,h/2,0,1],
  [a/2,-h/2,0,1],
  [-a/2,-h/2,0,1],
])

triangle.fill = '#08f'
world.add(triangle)


pose.on('change', transform => {
    window.x = world.transform = transform
})

loop( t => {

  renderer.render([
    world
  ])

})

import fullscreen from './fullscreen.js'
fullscreen()
