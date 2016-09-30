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
    this.ctx.lineWidth = 1
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

    // There is definitely a better way of doing this, but this'll do for now

    var up = ((e.gamma + 180) % 180) - 90

    var off = 0
    if(e.gamma > 0) {
      off = Math.PI
    }

    this.orientation =
      rotateX(up/50)
      .multiply(
        rotateY(
          (((-e.alpha/360) + 1) * Math.PI*2) + off
        )
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

  // polyfill browser versions

  var available = (function ( doc ) {
    // Use JavaScript script mode
    "use strict";

    /*global Element */

    var pollute = true,
      api,
      vendor,
      apis = {
        // http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
        w3: {
          enabled: "fullscreenEnabled",
          element: "fullscreenElement",
          request: "requestFullscreen",
          exit:    "exitFullscreen",
          events: {
            change: "fullscreenchange",
            error:  "fullscreenerror"
          }
        },
        webkit: {
          enabled: "webkitIsFullScreen",
          element: "webkitCurrentFullScreenElement",
          request: "webkitRequestFullScreen",
          exit:    "webkitCancelFullScreen",
          events: {
            change: "webkitfullscreenchange",
            error:  "webkitfullscreenerror"
          }
        },
        moz: {
          enabled: "mozFullScreenEnabled",
          element: "mozFullScreenElement",
          request: "mozRequestFullScreen",
          exit:    "mozCancelFullScreen",
          events: {
            change: "mozfullscreenchange",
            error:  "mozfullscreenerror"
          }
        },
        ms: {
          enabled: "msFullscreenEnabled",
          element: "msFullscreenElement",
          request: "msRequestFullscreen",
          exit:    "msExitFullscreen",
          events: {
            change: "MSFullscreenChange",
            error:  "MSFullscreenError"
          }
        }
      },
      w3 = apis.w3;

    // Loop through each vendor's specific API
    for (vendor in apis) {
      // Check if document has the "enabled" property
      if (apis[vendor].enabled in doc) {
        // It seems this browser support the fullscreen API
        api = apis[vendor];
        break;
      }
    }

    function dispatch( type, target ) {
      var event = doc.createEvent( "Event" );

      event.initEvent( type, true, false );
      target.dispatchEvent( event );
    } // end of dispatch()

    function handleChange( e ) {
      // Recopy the enabled and element values
      doc[w3.enabled] = doc[api.enabled];
      doc[w3.element] = doc[api.element];

      dispatch( w3.events.change, e.target );
    } // end of handleChange()

    function handleError( e ) {
      dispatch( w3.events.error, e.target );
    } // end of handleError()

    // Pollute only if the API doesn't already exists
    if (pollute && !(w3.enabled in doc) && api) {
      // Add listeners for fullscreen events
      doc.addEventListener( api.events.change, handleChange, false );
      doc.addEventListener( api.events.error,  handleError,  false );

      // Copy the default value
      doc[w3.enabled] = doc[api.enabled];
      doc[w3.element] = doc[api.element];

      // Match the reference for exitFullscreen
      doc[w3.exit] = doc[api.exit];

      // Add the request method to the Element's prototype
      Element.prototype[w3.request] = function () {
        return this[api.request].apply( this, arguments );
      };
    }

    // Return the API found (or undefined if the Fullscreen API is unavailable)
    return api;

  }( document ));


  function fullscreen(){

    if(available) {

      var button = document.createElement('button')
      
      button.innerText = '↗︎'
      button.setAttribute('style', 'position: absolute; bottom:0; left:0; font-size: 10vmin; height: 2em; width: 2em; border: none; background: rgba(255,255,255,0.15); color: #fff; border-radius: 0 10% 0 0; box-shadow: rgba(1,1,1,0.1) 0 0 8px; font-weight: 800;')

      document.body.appendChild(button)

      document.addEventListener('fullscreenchange', function (e) {

        button.style.display = document.fullscreenEnabled ? 'none' : 'block'
      })

      button.addEventListener('click', function (e) {
        document.body.requestFullscreen()
      }, false)

    }

  }

  var cube = new Cube(1)
  var renderer = new Renderer()

  renderer.render(cube)

  loop( function (t) {
    if(renderer.dirty)
      { renderer.render(cube) }
  })


  fullscreen()

}());