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


var rnd = function (n) { return (Math.random()-.5) * n * 2; }

var fill = function (array, fn) {
  for (var i = 0; i < array.length; i++) {
    array[i] = fn(i)
  }
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

var MeshCloud = (function (Thing$$1) {
  function MeshCloud(n) {
    Thing$$1.call(this)

    this.t = 0

    this.n = n
    this.position = new Float32Array(3 * n)
    this.velocity = new Float32Array(3 * n)

    // half used
    this.distance = new Float32Array(n * n)

    fill(this.position, function (_) { return rnd(2); })
    fill(this.velocity, function (_) { return rnd(0.0002); })
  }

  if ( Thing$$1 ) MeshCloud.__proto__ = Thing$$1;
  MeshCloud.prototype = Object.create( Thing$$1 && Thing$$1.prototype );
  MeshCloud.prototype.constructor = MeshCloud;

  MeshCloud.prototype.incr = function incr (delta) {
    var this$1 = this;

    for (var i = 0; i < this.position.length; i++) {
      this$1.position[i] += this$1.velocity[i] * delta
      if(this$1.position[i] < -2) {
        this$1.position[i] = 2
      } else if(this$1.position[i] > 2) {
        this$1.position[i] = -2
      }
    }
    this.t += delta
  };

  MeshCloud.prototype.setTime = function setTime (t) {
    this.incr(t - this.t)
  };

  MeshCloud.prototype.computeDistances = function computeDistances () {
    var this$1 = this;

    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.n; j++) {
        this$1.distance[i * this$1.n + j] =
          Math.pow(this$1.position[i*3    ] - this$1.position[j*3    ], 2)
          +
          Math.pow(this$1.position[i*3 + 1] - this$1.position[j*3 + 1], 2)
          +
          Math.pow(this$1.position[i*3 + 2] - this$1.position[j*3 + 2], 2)

        // HACK (horrible) make distance larger if we are close to edges
        var d = Math.max(
          Math.abs(this$1.position[i*3    ]),
          Math.abs(this$1.position[i*3 + 1]),
          Math.abs(this$1.position[i*3 + 2]),
          Math.abs(this$1.position[j*3    ]),
          Math.abs(this$1.position[j*3 + 1]),
          Math.abs(this$1.position[j*3 + 2])
        )

        if(d > 1.8) {
          var close = (d - 1.8) * 10
          this$1.distance[i * this$1.n + j] += close
        }
      }
    }
  };

  MeshCloud.prototype.points = function points () {
    var this$1 = this;


    var data = new Array(this.n)
    for (var i = 0; i < this.n; i++) {
      data[i] = [
        $V([
          this$1.position[i*3],
          this$1.position[i*3 + 1],
          this$1.position[i*3 + 2],
          1
        ]),
        $V([
          this$1.position[i*3] + 0.1,
          this$1.position[i*3 + 1] + 0.1,
          this$1.position[i*3 + 2] + 0.1,
          1
        ])
      ]
    }

    return {
      data: data
    }

  };

  MeshCloud.prototype.computeLines = function computeLines (minDistance) {
    var this$1 = this;
    if ( minDistance === void 0 ) minDistance=3;


    var things = []

    for (var i = 0; i < this.n; i++) {
      for (var j = i + 1; j < this.n; j++) {

        var opacity = 1 - (this$1.distance[i * this$1.n + j]/minDistance)

        if(opacity < 0) { continue }

        things.push({
          color: ("rgba(255,255,255," + opacity + ")"),
          data: [[
            $V([
              this$1.position[i*3],
              this$1.position[i*3 + 1],
              this$1.position[i*3 + 2],
              1
            ]),
            $V([
              this$1.position[j*3],
              this$1.position[j*3 + 1],
              this$1.position[j*3 + 2],
              1
            ])
          ]]
        })

      }
    }


    return this.children = things

  };

  return MeshCloud;
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
    document.addEventListener('click', function (e) {
      if(!document.fullscreenEnabled)
        { document.body.requestFullscreen() }
    }, false)
  }

}

var renderer = new Renderer()
var pose = new Pose()

var world = new Thing()

var cloud = new MeshCloud(15)

world.add(cloud)

var angle = 0

pose.on('change', function (transform) {
    window.x = world.transform = transform

    var track = $V([1,0,0,0])
    angle = track.angleFrom(transform.x(track)) || 0
})

loop( function (t) {

  renderer.render([
    world
  ])

  cloud.setTime(angle*50000)
  cloud.computeDistances()
  cloud.computeLines(4)

})

fullscreen()

}());
