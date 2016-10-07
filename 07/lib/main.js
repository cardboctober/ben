import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop, rnd, wrap} from './util.js'
import Cube from './Things/Cube.js'
import Thing from './Things/Thing.js'
import MeshCloud from './Things/MeshCloud.js'

const renderer = new Renderer()
const pose = new Pose()

const world = new Thing()

const cloud = new MeshCloud(15)

world.add(cloud)

let angle = 0

pose.on('change', transform => {
    window.x = world.transform = transform

    const track = $V([1,0,0,0])
    angle = track.angleFrom(transform.x(track)) || 0
})

loop( t => {

  renderer.render([
    world
  ])

  cloud.setTime(angle*5000)
  cloud.computeDistances()
  cloud.computeLines(4)

})

import fullscreen from './fullscreen.js'
fullscreen()
