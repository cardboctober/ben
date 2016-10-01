
import Renderer from './Renderer.js'
import {loop, rnd} from './util.js'

const renderer = new Renderer()

const r = (s) => Math.random() - 2

const obj = {
  data: Array.from({length:40}, _ =>
    [
      $V([0,0,0,1]),
      $V([rnd(3),rnd(3),rnd(3),1])
    ])
}



renderer.render(obj)

loop( t => {
  if(renderer.dirty)
    renderer.render(obj)
})


import fullscreen from './fullscreen.js'
fullscreen()
