(function () {
  'use strict';

  var Cube = function Cube(s) {
    this.data = [
      [[-1,-1,-1, 1], [ 1,-1,-1, 1]],
      [[-1,-1,-1, 1], [-1, 1,-1, 1]],
      [[-1,-1,-1, 1], [-1,-1, 1, 1]],
      [[-1, 1, 1, 1], [ 1, 1, 1, 1]],
      [[-1, 1, 1, 1], [-1,-1, 1, 1]],
      [[-1, 1, 1, 1], [-1, 1,-1, 1]],
      [[ 1, 1,-1, 1], [-1, 1,-1, 1]],
      [[ 1, 1,-1, 1], [ 1,-1,-1, 1]],
      [[ 1, 1,-1, 1], [ 1, 1, 1, 1]],
      [[ 1,-1, 1, 1], [-1,-1, 1, 1]],
      [[ 1,-1, 1, 1], [ 1, 1, 1, 1]],
      [[ 1,-1, 1, 1], [ 1,-1,-1, 1]],
    ]
    .map(function (l) { return l.map($V); })
  };

  // wrappers around sylvester with homogenous coord stuff

  // hacky v3 -> v4
  var toHom = function (m) { return $M(
      m.elements
        .map(function (r) { return r.concat([0]); })
        .concat([[0,0,0,1]])
    ); }


  //
  var translate = function (x,y,z) { return $M([
      [1,0,0,x],
      [0,1,0,y],
      [0,0,1,z],
      [0,0,0,1]
    ]); }

  var scale = function (s) { return Matrix.Diagonal([s,s,s,1]); }


  var rotateX = function (a) { return toHom(Matrix.RotationX(a)); }
  var rotateY = function (a) { return toHom(Matrix.RotationY(a)); }

  var perspective = function (p) { return $M([
      [1,0,0,0],
      [0,1,0,0],
      [0,0,1,0],
      [0,0,p,1-p]
    ]); }

  var Renderer = function Renderer() {
    var this$1 = this;


    this.camera = this.orientation = Matrix.I(4)

    this.canvas = document.createElement('canvas')
    document.body.appendChild(this.canvas)

    this.fit()
    window.addEventListener('resize',
      function (e) { return this$1.fit(); }, false)

    window.addEventListener('deviceorientation',
      function (e) { return this$1.orient(e); }, false)




  };

  Renderer.prototype.fit = function fit () {
    this.canvas.width = this.w = window.innerWidth
    this.canvas.height = this.h = window.innerHeight

    this.ctx = this.canvas.getContext('2d')
    this.ctx.lineWidth = 4
    this.ctx.lineCap = 'round'
    this.ctx.strokeStyle = '#fff'

    var s = Math.min(this.w, this.h) / 9

    this.left = translate(
      this.w/4,
      this.h/2,
      0
    )
    .multiply(scale(s))
    .multiply(perspective(0.1))
    .multiply(rotateY(-0.05))

    this.right = translate(
      this.w*.75,
      this.h/2,
      0
    )
    .multiply(scale(s))
    .multiply(perspective(0.1))
    .multiply(rotateY(0.05))


    this.dirty = true

  };

  Renderer.prototype.orient = function orient (e) {

    this.orientation =
      rotateY(
        ((-e.alpha/360) + 1) * Math.PI*2
      )
      .multiply(
        rotateX(0.1)
      )

    this.dirty = true

  };

  Renderer.prototype.render = function render (obj) {
      var this$1 = this;

    var ctx = this.ctx
    ctx.clearRect(0,0,this.w, this.h)

    ;[this.left, this.right].forEach(function (camera) {
      var t =
        camera
        .multiply(this$1.orientation)

      ctx.beginPath()
      for (var i = 0; i < obj.data.length; i++) {
        var l = obj.data[i]
        var a = t.x(l[0])
        var b = t.x(l[1])

        ctx.moveTo(a.e(1)/a.e(4), a.e(2)/a.e(4))
        ctx.lineTo(b.e(1)/b.e(4), b.e(2)/b.e(4))
      }
      ctx.stroke()

    })


    // stash incase we have to re-render on size or orientation change
    this.rendered = obj
    this.dirty = false
  };

  var loop = function (fn) {
    var wrap = function (t) {
      requestAnimationFrame(wrap)
      fn(t)
    }

    requestAnimationFrame(wrap)
  }

  var cube = new Cube(1)
  var renderer = new Renderer()

  renderer.render(cube)

  loop( function (t) {
    if(renderer.dirty)
      { renderer.render(cube) }
  })

}());