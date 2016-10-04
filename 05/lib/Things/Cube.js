import Thing from './Thing.js'

export default class Cube extends Thing {
  constructor(s=1) {
    this.data = [
      [[-s,-s,-s, 1], [ s,-s,-s, 1]],
      [[-s,-s,-s, 1], [-s, s,-s, 1]],
      [[-s,-s,-s, 1], [-s,-s, s, 1]],
      [[-s, s, s, 1], [ s, s, s, 1]],
      [[-s, s, s, 1], [-s,-s, s, 1]],
      [[-s, s, s, 1], [-s, s,-s, 1]],
      [[ s, s,-s, 1], [-s, s,-s, 1]],
      [[ s, s,-s, 1], [ s,-s,-s, 1]],
      [[ s, s,-s, 1], [ s, s, s, 1]],
      [[ s,-s, s, 1], [-s,-s, s, 1]],
      [[ s,-s, s, 1], [ s, s, s, 1]],
      [[ s,-s, s, 1], [ s,-s,-s, 1]],
    ]
    .map(l => l.map($V))
  }
}
