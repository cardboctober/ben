import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop, rnd} from './util.js'
import Thing from './Things/Thing.js'
import Poly from './Things/Poly.js'
import DSphere from './Things/DSphere.js'
import DFloor from './Things/DFloor.js'

const renderer = new Renderer()
const pose = new Pose()

const world = new Thing()

const floor = new DFloor(2)
world.add(floor)
floor.color = 'rgba(255,255,255,0.7)'


pose.on('change', transform => {
    world.transform = transform
})

loop( t => {

  renderer.render([
    world
  ])

})

import fullscreen from './fullscreen.js'
fullscreen()
