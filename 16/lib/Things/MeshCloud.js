import Thing from './Thing.js'
import {fill, rnd} from '../util.js'

// points that are at places at a particular time
export default class MeshCloud extends Thing {

  constructor(n) {
    super()

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

        if(d > 1.8) {
          var close = (d - 1.8) * 10
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

  computeLines(minDistance=3) {

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


    return this.children = things

  }

}
