export default class Path  extends Thing{
  constructor () {

    this.data = []
    this.color = '#fff'

  }

  clear() {
    this.data = []
    this.last = this.last2 = null
  }

  add (p, p2) {

    if(this.last &&
      this.last.distanceFrom(p) < 0.1) {
      return false
    }

    this.data.push([
      p,
      this.last || p
    ])

    this.data.push([
      p2,
      this.last2 || p2
    ])

    this.last = p
    this.last2 = p2

    while(this.data.length > 200)
      this.data.shift()

  }
}
