import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop, rnd, wrap} from './util.js'
import Thing from './Things/Thing.js'
import Balls from './Things/Balls.js'

const renderer = new Renderer()
const pose = new Pose()


const world = new Thing()

const lines = new Thing()
world.add(lines)
lines.color = 'rgba(0,0,0,0.8)'

import layerForce from './process/layer-force.js'

d3.json('data/events.json', (respFull) => {
  const resp = respFull.slice(0,8)

  const processed = layerForce(
        resp
          .map(ev =>
            ev.attendees
              .filter(x => x)
          )
      )

  processed.layers.forEach((layer,i) => {
    // only draw the most recent two layers
    if(i < 3){
      var o = 1 - (i*.3)

      const graph = new Balls(layer)
      graph.stroke = 'rgba(255,255,255,'+o+')'
      world.add(graph)
    }
  })

  processed.links.forEach( ([a,b]) => {
    lines.data.push([
      $V([a.x, a.y, a.z, 1]),
      $V([b.x, b.y, b.z, 1])
    ])
  })


})



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
