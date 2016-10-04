import Thing from './Thing.js'

export default class Cross extends Thing {
  constructor (s=.25) {

    this.data = [
      [
        $V([0-s,0,0,1]),
        $V([0+s,0,0,1])
      ],[
        $V([0,0-s,0,1]),
        $V([0,0+s,0,1])
      ],[
        $V([0,0,0-s,1]),
        $V([0,0,0+s,1])
      ]
    ]

    this.color = 'rgba(255,255,255,0.4)'
  }
}
