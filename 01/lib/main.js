import Cube from './Cube.js'
import Renderer from './Renderer.js'
import {loop} from './util.js'

const cube = new Cube()
const renderer = new Renderer()

loop( t => {
  if(renderer.dirty)
    renderer.render(cube)
})

import fullscreen from './fullscreen.js'

fullscreen()
