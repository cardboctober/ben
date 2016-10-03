export default class Canvas {

  constructor() {

    this.element = document.createElement('canvas')
    document.body.appendChild(this.canvas)

    this.fit()
    window.addEventListener('resize',
      e => this.fit(), false)

  }

  fit() {
    this.canvas.width = this.w = window.innerWidth
    this.canvas.height = this.h = window.innerHeight
  }

  render(fn) {
    fn(this)
  }

}
