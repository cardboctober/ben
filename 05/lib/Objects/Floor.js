

export default class Floor {
  constructor () {
    this.data = []
    for (var i = -6; i <= 6; i++) {
      this.data.push([
        $V([i, 0,  6, 1]),
        $V([i, 0, -6, 1])
      ])
      this.data.push([
        $V([6, 0,  i, 1]),
        $V([-6, 0, i, 1])
      ])
    }
  }
}
