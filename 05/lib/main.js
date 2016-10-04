import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop} from './util.js'
import Cube from './Things/Cube.js'
import Thing from './Things/Thing.js'

const renderer = new Renderer()
const pose = new Pose()
const cube = new Cube(1)
const cube2 = new Cube(0.4)

const world = new Thing()
world.add(cube)
world.add(cube2)


pose.on('change', transform =>
  world.transform = transform
)

loop( t => {
  renderer.render([
    world
  ])
})

import fullscreen from './fullscreen.js'
fullscreen()
