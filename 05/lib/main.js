import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop} from './util.js'
import Cube from './Objects/Cube.js'

const renderer = new Renderer()
const pose = new Pose()
const cube = new Cube(1)

pose.on('change', transform => {
  cube.transform = transform
})

loop( t => {
  renderer.render([
    cube
  ])
})

import fullscreen from './fullscreen.js'
fullscreen()
