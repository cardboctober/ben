export default class Cross extends Thing {
  constructor (x=0, y=0, z=0, s=.25) {

    this.data = [
      [
        $V([x-s,y,z,1]),
        $V([x+s,y,z,1])
      ],[
        $V([x,y-s,z,1]),
        $V([x,y+s,z,1])
      ],[
        $V([x,y,z-s,1]),
        $V([x,y,z+s,1])
      ]
    ]

    this.color = 'rgba(255,255,255,0.4)'
  }
}
