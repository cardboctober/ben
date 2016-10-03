import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop} from './util.js'
import Cross from './Cross.js'
import Cube from './Cube.js'
import Path from './Path.js'

const renderer = new Renderer()
const pose = new Pose()
const centre = new Cross()
const guide = new Cube(1)
guide.color = 'rgba(0,0,0,0.2)'

pose.on('change', transform => {
  f.transform = guide.transform =
  centre.transform = transform
})

import Floor from './Floor.js'

const f = new Floor()



loop( t => {
  renderer.render([
    guide,
    centre,
    f
    // brush,
    // line
  ])
})

import fullscreen from './fullscreen.js'
fullscreen()
