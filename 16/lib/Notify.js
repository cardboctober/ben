export default class Notify {
  constructor() {
    this._callbacks = {}
  }
  on(e, fn) {
    (this._callbacks[e] = this._callbacks[e] || [])
    .push(fn)
  }
  fire(e, data) {
    (this._callbacks[e] || [])
    .forEach(f => f(data))
  }
}
