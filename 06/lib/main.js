import Renderer from './Renderer.js'
import Pose from './Pose.js'
import {loop, rnd, fill, wrap} from './util.js'
import Cube from './Things/Cube.js'
import Cross from './Things/Cross.js'
import Path from './Things/Path.js'
import Thing from './Things/Thing.js'

const renderer = new Renderer()
const pose = new Pose()

const world = new Thing()

import {translate, rotateX, rotateY} from './matrix.js'


// points that are at places at a particular time
class Points {
  constructor(n) {
    this.t = 0

    this.n = n
    this.position = new Float32Array(3 * n)
    this.velocity = new Float32Array(3 * n)

    // half used
    this.distance = new Float32Array(n * n)

    fill(this.position, _ => rnd(2))
    fill(this.velocity, _ => rnd(0.0002))
  }

  incr (delta) {
    for (var i = 0; i < this.position.length; i++) {
      this.position[i] += this.velocity[i] * delta
      if(this.position[i] < -2) {
        this.position[i] = 2
      } else if(this.position[i] > 2) {
        this.position[i] = -2
      }
    }
    this.t += delta
  }

  setTime (t) {
    this.incr(t - this.t)
  }

  computeDistances() {
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.n; j++) {
        this.distance[i * this.n + j] =
          Math.pow(this.position[i*3    ] - this.position[j*3    ], 2)
          +
          Math.pow(this.position[i*3 + 1] - this.position[j*3 + 1], 2)
          +
          Math.pow(this.position[i*3 + 2] - this.position[j*3 + 2], 2)

        // HACK (horrible) make distance larger if we are close to edges
        var d = Math.max(
          Math.abs(this.position[i*3    ]),
          Math.abs(this.position[i*3 + 1]),
          Math.abs(this.position[i*3 + 2]),
          Math.abs(this.position[j*3    ]),
          Math.abs(this.position[j*3 + 1]),
          Math.abs(this.position[j*3 + 2])
        )

        if(d > 1.5) {
          var close = (d - 1.5) * 10
          this.distance[i * this.n + j] += close
        }
      }
    }
  }

  points() {

    const data = new Array(this.n)
    for (var i = 0; i < this.n; i++) {
      data[i] = [
        $V([
          this.position[i*3],
          this.position[i*3 + 1],
          this.position[i*3 + 2],
          1
        ]),
        $V([
          this.position[i*3] + 0.1,
          this.position[i*3 + 1] + 0.1,
          this.position[i*3 + 2] + 0.1,
          1
        ])
      ]
    }

    return {
      data: data
    }

  }

  lines(minDistance=3) {

    const things = []

    for (var i = 0; i < this.n; i++) {
      for (var j = i + 1; j < this.n; j++) {

        var opacity = 1 - (this.distance[i * this.n + j]/minDistance)

        if(opacity < 0) continue

        things.push({
          color: `rgba(255,255,255,${opacity})`,
          data: [[
            $V([
              this.position[i*3],
              this.position[i*3 + 1],
              this.position[i*3 + 2],
              1
            ]),
            $V([
              this.position[j*3],
              this.position[j*3 + 1],
              this.position[j*3 + 2],
              1
            ])
          ]]
        })

      }
    }

    return things

  }

}

const cloud = new Points(25)

cloud.computeDistances()

console.log(cloud.points())

const cloudHolder = {
  data: [],
  children: [
    {
      data: [],
      children: cloud.lines()
    }
  ]
}


world.add(cloudHolder)


pose.on('change', transform =>
  world.transform = transform
)

const line = new Path()

loop( t => {

  cloud.setTime(t)
  cloud.computeDistances()
  cloudHolder.children = cloud.lines()

  renderer.render([
    world,
  ])
})

import fullscreen from './fullscreen.js'
fullscreen()
