import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop} from './util.js'
import Cross from './Cross.js'
import Cube from './Cube.js'
import Path from './Path.js'

const renderer = new Renderer()
const pose = new Pose()
const centre = new Cross()
// const guide = new Cube(.5)

const brush = new Cross(0,0,-1.5,0.1)
brush.color = '#555'
const line = new Path()

pose.on('change', transform => {
  centre.transform = line.transform = transform

  const inv = transform.inverse()
  const p = inv.x($V([0,0,-1.5,1]))
  const p2 = inv.x($V([0,0,-1.6,1]))

  line.add(p,p2)

})

document.addEventListener('click', _ => line.clear())

loop( t => {
  renderer.render([
    // guide,
    centre,
    brush,
    line
  ])
})

import fullscreen from './fullscreen.js'
fullscreen()
