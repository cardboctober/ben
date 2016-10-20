import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop, rnd, wrap} from './util.js'
import Thing from './Things/Thing.js'
import Ball from './Things/Ball.js'
import Thrown from './Things/Thrown.js'

const renderer = new Renderer()
const pose = new Pose()
const world = new Thing()

const holders = []

for (var i = 0; i < 10; i++) {

  const ball = new Ball(0,0,0,0.1)
  ball.fill = 'rgba(234,150,0,0.7)'

  const holder = new Thrown(
    {
      // p: {x:rnd(.1),y:rnd(.1),z:rnd(.1)},
      p: {x:0,y:0,z:0},
      v: {x:rnd(8),y:rnd(8)-8,z:rnd(8)}
    }
  )

  holder.add(ball)
  world.add(holder)
  //
  // holder.p = $V([rnd(1),rnd(1),rnd(1)])
  // holder.v = $V([rnd(8),rnd(8)-8,rnd(8)])

  holders.push(holder)
}



pose.on('change', transform => {
    world.transform = transform
})


loop( t2 => {

  renderer.render([
    world
  ])

  const t = (t2 % 2500) / 1000

  holders.forEach(h => h.time(t))

})

import fullscreen from './fullscreen.js'
fullscreen()
