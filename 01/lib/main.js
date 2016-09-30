import Cube from './Cube.js'
import Renderer from './Renderer.js'
import {loop} from './util.js'

const cube = new Cube(1)
const renderer = new Renderer()

renderer.render(cube)

loop( t => {
  if(renderer.dirty)
    renderer.render(cube)
})
