
const rnd = i => (Math.random()-.5) * 5

export default class Particles {

  constructor(n) {
    this.data = []

    for(var i = 0; i < n; i++){
      let a = rnd()
      let b = rnd()
      let c = rnd()

      this.data.push([
        $V([a,b,c,1]),
        $V([a+.2,b,c+.2,1]),
      ])
      this.data.push([
        $V([a,b,c,1]),
        $V([a,b+.2,c,1]),
      ])
      this.data.push([
        $V([a,b,c,1]),
        $V([a,b,c+.2,1]),
      ])

    }

  }

}
