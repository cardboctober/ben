const each = (start, to, by, fn) => {
  for(var i = start; i <= to; i += by) {
    fn(i)
  }
}

export default function grid (off) {

  const data = []

  const a = -1.5
  const b = 1.5
  const ab = b - a

  const s = 1.5

  each(-s, s, 1, x => {
    x = (((x + off + s)) % s*2) - s

    each(-1,1,1, y => {
      each(-1,1,1, z => {

        const d = 0.05
          * Math.cos(
            (x / s)
            * (Math.PI/2)
          )

        data.push([
          $V([x-d,y,z,1]),
          $V([x+d,y,z,1])
        ])


      })
    })
  })


  return {data:data}

}
