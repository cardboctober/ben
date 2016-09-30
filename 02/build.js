(function () {
  'use strict';

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

  fullscreen()

}());