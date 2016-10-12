import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop, rnd} from './util.js'
import Thing from './Things/Thing.js'
import Ball from './Things/Ball.js'

const renderer = new Renderer()
const pose = new Pose()

const world = new Thing()

const ball = new Ball(0,0,0,1)
world.add(ball)


for (var i = 0; i < 8; i++) {
  var b = new Ball( rnd(1.5), rnd(1.5), rnd(1.5), .2 )

  b.fill = 'rgba(255,255,255,0.3)'

  world.add(b
    )
}


ball.fill = 'rgba(255,255,255,0.3)'


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
