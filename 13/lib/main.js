import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop, rnd, wrap} from './util.js'
import Thing from './Things/Thing.js'
import Balls from './Things/Balls.js'

import Path from './Things/Path.js'


const renderer = new Renderer()
const pose = new Pose()

const world = new Thing()

const data = []

const nodes = Array.from({length: 30}, _ => ({
  // x: 0,
  // y: 0,
  z: 0,
  r: 5
}))

const simulation = d3.forceSimulation(nodes)
    .force('collide', d3.forceCollide(d => d.r*3))
    .force('attract', d3.forceManyBody().strength(.1))


/*
  events = [
    [ {x,y,id} ]
  ]
*/







// simulation.stop()
window.simulation = simulation

const graph = new Balls(nodes)
// world.add(graph)
graph.color = 'rgba(255,255,255,0.5)'

const graph2 = new Balls(nodes)
// world.add(graph2)
graph2.color = 'rgba(255,255,255,0.5)'




import {scale, rotateY, rotateX, translate} from './matrix.js'
graph.transform =
  translate(0,-1,0)
  .x(
    rotateX(Math.PI/2)
    .x(scale(0.01))
  )

graph2.transform =
  translate(0,1,0)
  .x(
    rotateX(Math.PI/2)
    .x(scale(0.01))
  )



const holder = new Thing()
world.add(holder)

holder.transform =
  translate(0,0,0)
  .x(
    rotateX(Math.PI/2)
    .x(scale(0.01))
  )

const ball = new Balls(data)
// world.add(ball)
ball.color = '#fff'

const lines = new Thing()
world.add(lines)
lines.color = 'rgba(0,0,0,0.8)'

import layerForce from './process/layer-force.js'

d3.json('data/events.json', (respFull) => {
  const resp = respFull.slice(0,7)

  const processed = layerForce(
        resp
          .map(ev =>
            ev.attendees
              .filter(x => x)
          )
      )


  processed.layers.forEach((layer,i) => {
    // only draw the most recent two layers
    if(i < 2){
      const graph = new Balls(layer)
      world.add(graph)
      graph.stroke = 'rgba(255,255,255,0.5)'
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
