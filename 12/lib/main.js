import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop, rnd, wrap} from './util.js'
import Thing from './Things/Thing.js'
import Balls from './Things/Balls.js'

const renderer = new Renderer()
const pose = new Pose()

const world = new Thing()

const data = Array.from({length: 30}, _ => ({
  x: rnd(.5),
  y: rnd(5),
  z: rnd(.5),
  r: rnd(.2),

  yv: rnd(0.001)
}))

const ball = new Balls(data)
world.add(ball)

ball.color = '#08f'


pose.on('change', transform => {
    world.transform = transform
})


var lastT = 0
loop( t => {

  data.forEach( d => {
    d.y += (t - lastT) * d.yv

    d.y = wrap(d.y, -5, 5)

  })
  lastT = t

  renderer.render([
    world
  ])

})

import fullscreen from './fullscreen.js'
fullscreen()
