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


const ball = new Balls(data)
world.add(ball)

ball.color = '#fff'

const lines = new Thing()
world.add(lines)
lines.color = 'rgba(255,255,255,0.2)'

d3.json('data/events.json', (resp) => {

  var x = d3.scaleTime()
    .domain(
      d3.extent(
        resp.map( r => r.time)
      )
    )
    .range([1,-1])


  var y = d3.scaleLinear()
    .domain(
      d3.extent(
        resp.map( r => r.attendees.length)
      )
    )
    .range([1,-1])

  resp
    .forEach( event => {

      lines.data.push([
        $V([x(event.time), y(event.attendees.length), 0, 1]),
        $V([x(event.time), y(0), 0, 1])
      ])

      data.push({
        x: x(event.time),
        y: y(event.attendees.length||0),
        z: 0,
        r: .05
      })

    }
  )




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
