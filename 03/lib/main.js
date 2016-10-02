
import Particles from './Particles.js'
import Renderer from './Renderer.js'
import grid from './grid.js'
import {loop, rnd} from './util.js'

const renderer = new Renderer()

loop( t => {
  renderer.render(
    grid(t/3000)
  )
})

import fullscreen from './fullscreen.js'
fullscreen()
