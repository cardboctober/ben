const each = (start, to, by, fn) => {
  for(var i = start; i <= to; i += by) {
    fn(i)
  }
}

export default class Grid {

  constructor (size) {

    const data = this.data = []

    each(-1,1,1, x => {
      each(-1,1,1, y => {
        each(-1,1,1, z => {
          //  * 0.1
          // 0.0001
          const d = 0.05


          this.data.push([
            $V([x-d,y,z,1]),
            $V([x+d,y,z,1])
          ])
          //
          // this.data.push([
          //   $V([x,y-d,z,1]),
          //   $V([x,y+d,z,1])
          // ])
          //
          // this.data.push([
          //   $V([x,y,z-d,1]),
          //   $V([x,y,z+d,1])
          // ])

        })
      })
    })

  }
}
