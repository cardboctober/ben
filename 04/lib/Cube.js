export default class Cube {
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
