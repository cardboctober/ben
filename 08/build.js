(function () {
'use strict';

// wrappers around sylvester with homogenous coord stuff

// hacky m3 -> m4
var toHom = function (m) { return $M(
    m.elements
      .map(function (r) { return r.concat([0]); })
      .concat([[0,0,0,1]])
  ); }


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

var I = Matrix.I(4)

var Renderer = function Renderer() {
  var this$1 = this;


  this.camera = Matrix.I(4)

  this.canvas = document.createElement('canvas')
  document.body.appendChild(this.canvas)

  this.fit()
  window.addEventListener('resize',
    function (e) { return this$1.fit(); }, false)

};

Renderer.prototype.fit = function fit () {

  var ratio = window.devicePixelRatio || 1

  this.canvas.width = this.w = window.innerWidth * ratio
  this.canvas.height = this.h = window.innerHeight * ratio

  if(ratio != 1) {
    this.canvas.style.width = window.innerWidth + 'px'
    this.canvas.style.height = window.innerHeight + 'px'
  }

  this.ctx = this.canvas.getContext('2d')
  this.ctx.lineWidth = 3
  this.ctx.lineCap = 'round'
  this.ctx.strokeStyle = '#f08'

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

Renderer.prototype.render = function render (obj) {
    var this$1 = this;

  var ctx = this.ctx
  ctx.clearRect(0,0,this.w, this.h)

  ;[this.left, this.right].forEach(function (camera,x) {

    ctx.save()
    ctx.beginPath()

    if(x == 0) {
      ctx.lineTo(0,0)
      ctx.lineTo(this$1.w/2,0)
      ctx.lineTo(this$1.w/2,this$1.h)
      ctx.lineTo(0,this$1.h)
    } else {
      ctx.lineTo(this$1.w/2,0)
      ctx.lineTo(this$1.w,0)
      ctx.lineTo(this$1.w,this$1.h)
      ctx.lineTo(this$1.w/2,this$1.h)
    }
    ctx.clip()


    obj.forEach( function (obj) {

      // reset context
      ctx.strokeStyle = '#000'

      renderObject(obj, camera, ctx)

    })

    ctx.restore()
  })


  this.dirty = false
};

function renderObject(obj, t, ctx){
  // console.log("-s")

  if(obj.transform)
    { t = t.multiply(obj.transform) }

  if(obj.color)
    { ctx.strokeStyle = obj.color }

  if(obj.render) {
    obj.render(ctx, t)

  } else {
    ctx.beginPath()
    for (var i = 0; i < obj.data.length; i++) {
      var l = obj.data[i]
      var a = t.x(l[0])
      var b = t.x(l[1])

      a = a.multiply(1/a.e(4))
      b = b.multiply(1/b.e(4))

      var x = a.e(1)
      var y = a.e(2)
      var r = a.distanceFrom(b)

      ctx.moveTo(
        a.e(1), a.e(2)
      )
      ctx.lineTo(
        b.e(1), b.e(2)
      )

    }
    ctx.stroke()
  }


  if(obj.children) {
    obj.children.forEach(function (child) { return renderObject(child, t, ctx); }
    )
  }


}

var Notify = function Notify() {
  this._callbacks = {}
};
Notify.prototype.on = function on (e, fn) {
  (this._callbacks[e] = this._callbacks[e] || [])
  .push(fn)
};
Notify.prototype.fire = function fire (e, data) {
  (this._callbacks[e] || [])
  .forEach(function (f) { return f(data); })
};

var Pose = (function (Notify$$1) {
  function Pose () {
    var this$1 = this;

    Notify$$1.call(this)

    window.addEventListener('mousemove',
      this.handleMouse.bind(this),
      {passive:true}
    )


    new FULLTILT.getDeviceOrientation({ 'type': 'game' })
    .then(function (controller) {
      (this$1.controller = controller)
        .start(this$1.handleTilt.bind(this$1))
    })
    .catch(function (e) { return console.log("no device orientation events"); })



    this.transform = I
  }

  if ( Notify$$1 ) Pose.__proto__ = Notify$$1;
  Pose.prototype = Object.create( Notify$$1 && Notify$$1.prototype );
  Pose.prototype.constructor = Pose;

  Pose.prototype.handleMouse = function handleMouse (e) {
    if(e.buttons === 0) { return this.start = null }

    this.start = this.start || e

    this.transform =
      rotateY(
        (this.start.clientX - e.clientX) / 100
      )
      .multiply(rotateX(
        (this.start.clientY - e.clientY) / 100
      ))

    this.fire('change', this.transform)

  };

  Pose.prototype.handleTilt = function handleTilt () {

    var m = this.controller.getScreenAdjustedMatrix().elements

    this.transform = $M([
      [m[0],m[1],m[2],0],
      [m[3],m[4],m[5],0],
      [m[6],m[7],m[8],0],
      [0, 0, 0, 1]
    ]).inverse()
    .multiply(
      rotateX(Math.PI/2)
    )

    this.fire('change', this.transform)

  };

  return Pose;
}(Notify));

var loop = function (fn) {
  var wrap = function (t) {
    requestAnimationFrame(wrap)
    fn(t)
  }

  requestAnimationFrame(wrap)
}






// deal with weird mod behaviour
// export const wrap = (v, min, max) =>

// Because Object is already a thing

var Thing = function Thing () {
  this.transform = I
  this.data = []
  this.children = []
};

Thing.prototype.add = function add (thing) {
  this.children.push(thing)
};

var Poly = (function (Thing$$1) {
  function Poly(points) {
    this.points = points.map($V)
  }

  if ( Thing$$1 ) Poly.__proto__ = Thing$$1;
  Poly.prototype = Object.create( Thing$$1 && Thing$$1.prototype );
  Poly.prototype.constructor = Poly;

  Poly.prototype.render = function render (ctx, transform) {
    ctx.fillStyle = this.fill || '#000'
    ctx.beginPath()
    this.points
      .map(function (p) { return transform.x(p); })
      .forEach(function (p) {
        ctx.lineTo(p.e(1)/p.e(4), p.e(2)/p.e(4))
      })
    ctx.fill()
  };

  return Poly;
}(Thing));

// polyfill browser versions

var available = (function ( doc ) {
  // Use JavaScript script mode
  "use strict";

  /*global Element */

  var pollute = true,
    api, vendor,
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
    if(location.search == '?fs') {
      document.addEventListener('click', function (e) {
        if(!document.fullscreenEnabled)
          { document.body.requestFullscreen() }
      }, false)
    } else {
      
      var fs = document.createElement('a')
      fs.href = '?fs'
      fs.innerText = '⬆︎'
      fs.setAttribute('style', 'position: absolute; bottom: 1em; z-index: 100; display: block; height: 2em; width: 2em; left: 50%; margin-left: -.75em; color: rgba(2, 2, 2, 0.54); font-weight: 100; text-decoration: none; background: rgba(8, 8, 8, 0.18); text-align: center; line-height: 2em; font-family: sans-serif; border-radius: 50%;')
      document.body.appendChild(fs)

    }
  }

}

var renderer = new Renderer()
var pose = new Pose()

var world = new Thing()

var a = 3
var h = (Math.sqrt(3)/2)*a


var triangle = new Poly([
  [0,h/2,0,1],
  [a/2,-h/2,0,1],
  [-a/2,-h/2,0,1],
])

triangle.fill = '#08f'
world.add(triangle)


pose.on('change', function (transform) {
    window.x = world.transform = transform
})

loop( function (t) {

  renderer.render([
    world
  ])

})

fullscreen()

}());
