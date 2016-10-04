import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop, rnd} from './util.js'
import Cube from './Things/Cube.js'
import Thing from './Things/Thing.js'

const renderer = new Renderer()
const pose = new Pose()

const world = new Thing()

world.color = 'red'

import {translate, rotateX, rotateY} from './matrix.js'

for (var i = 0; i < 20; i++) {
  let cube = new Cube(rnd(0.5))
  cube.transform =
    translate(rnd(1.5), rnd(1.5),rnd(1.5))
    .multiply(rotateX(rnd(2)))
    .multiply(rotateY(rnd(2)))
  world.add(cube)
  cube.color = `hsla(${rnd(360)},50%,80%,.6)`
}

// cube2.transform = translate(2,2,2)



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
