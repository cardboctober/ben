
import Particles from './Particles.js'
import Renderer from './Renderer.js'
import grid from './grid.js'
import {loop, rnd} from './util.js'

const renderer = new Renderer()

// const r = (s) => Math.random() - 2
//
// const dust = new Particles(10)

const g = new grid()

// renderer.render(dust)

loop( t => {
  // render(g(t))

  if(renderer.dirty)
    renderer.render(g)
})


import fullscreen from './fullscreen.js'
fullscreen()
