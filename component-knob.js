/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */

if ( !window.requestAnimationFrame ) {

  window.requestAnimationFrame = ( function() {

    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

      window.setTimeout( callback, 1000 / 60 );

    };

  } )();

}

/**
 * Template Component
 *
 * @method
 * init()
 * - Initializes the header component
 *
 * @method
 * render()
 * - Called when component is visible - if hidden while instanciating
 *
 */

/*
 * Component scope
 */
(function () {

  /*
   * Demo Component
   */
  components.Knob = function (context) {

    // public api object
    var api = {};
    var ctx = null;

    var angleRadians = {
      start: 1.5 * Math.PI,
      end: (2 * Math.PI) / 100
    }

    var defaults = {
      "radius": "75",
      "lineWidth": "10",
      "lineCap": "round",
      "strokeStyle": "#99CC33",
      "fillStyle": "#666666",
      "font": "52px sans-serif",
      "textAlign": "center"
    };

    var settings = {};

    var x = context.width / 2;
    var y = context.height / 2;
    var easing = null;

    var finalValue = context.getAttribute('data-value') || 100;

    var startedTime = null;
    var isStarted = false;

    var ANIMATION_DURATION = 600;
    var DATA_DELAY_MS = "data-delay-ms";
    var DATA_SETTINGS = "data-canvas-settings";

    /**
     * Initializes the component - Called by ComponentLoader for each instance found on page.
     *
     **/
    api.init = function () {
      var ctxSettings = null;

      ctx = context.getContext('2d');

      if (!ctx) {
        return;
      }

      // Get our settings from the markup
      ctxSettings = context.getAttribute(DATA_SETTINGS) || {};
      ctxSettings = JSON.parse( ctxSettings );

      // Merge them with some defaults
      extend( settings, defaults, ctxSettings );

      // Set canvas configuration
      setCanvasProps();

    };

    /**
     * Marges two objects into one.
     * Similar to jQuery.extend() function.
     *
     * @param  {Object} out result object
     * @return {Object}     [description]
     */
    function extend(out) {
      out = out || {};

      for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i])
          continue;

        for (var key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key))
            out[key] = arguments[i][key];
        }
      }

      return out;
    }


    /**
     * Sets canvas properties if present.
     */
    function setCanvasProps() {
      for (var prop in settings) {
        if (ctx.hasOwnProperty(prop)) {
          ctx[prop] = settings[prop];
        }
      }
    }

    /**
     * Draws the canvas.
     * Calls the other draws methods.
     *
     * @param  {Number} timeProgress progress based on the time.
     */
    function draw( timeProgress ) {
      var currentValue = null;
      var currentValueLabel = null;
      var toAngleRadians = null;

      currentValue = (timeProgress / ANIMATION_DURATION) * finalValue;
      currentValue = Math.min(currentValue, finalValue);

      currentValueLabel = parseInt( currentValue * 100, 10 );

      toAngleRadians = getRadiansByPercentage( currentValue ) + angleRadians.start;

      ctx.beginPath();
      ctx.clearRect(0, 0, context.width, context.height);
      drawArc( toAngleRadians );
      drawText( currentValueLabel );
    }

    /**
     * Draws an arc in the canvas context.
     *
     * @param  {Number} toAngleRadians where in radians to draw.
     */
    function drawArc( toAngleRadians ) {
      ctx.arc(x, y, settings.radius, angleRadians.start, toAngleRadians, false);
      ctx.stroke();
    }

    /**
     * Draws a fill text in the canvas context.
     * Tries to put in the center of it's radius by getting the fontSize in pixels.
     *
     * @param  {String} label Label to be displayed
     */
    function drawText( label ) {
      var fontSize = parseInt( settings.font.split("px")[0], 10 );
      var _y = parseInt(settings.radius, 10) + (fontSize / 2);
      ctx.fillText( label, x, _y);
    }

    /**
     * Returns the time elapsed so far, based on when it started.
     *
     * @return {Number} Time elapsed
     */
    function timeElapsed() {
      if (!isStarted) {
        return 0;
      }
      return Date.now() - startedTime;
    }


    /**
     * Performs a check on every requestAnimationFrame
     * to find out if we have more to do or not before
     * scheduling the next frame.
     */
    function tick() {
      var timeProgress = Math.round(timeElapsed());

      if (isStarted && timeProgress < ANIMATION_DURATION) {
        window.requestAnimationFrame( tick );
      }

      draw( timeProgress );

    }

    /**
     * Helper function to find out the radians
     * by a given percentage.
     *
     * @param  {Number} percentage how much percent e.g 0.10, 0.20
     */
    function getRadiansByPercentage( percentage ) {
      var degrees = percentage * 360.0;
      return degrees * (Math.PI / 180);
    }

    /**
     * Function called by the component loader when it's time to render
     *  - only called if component was :visible
     * This function is not called if component is display:none - for instance hidden in an inactive tab-controller.
     * Call ComponentLoader.notifyAll() to trigger all hidden components to render when visibility changes.
     **/
    api.render = function () {

      var delay = context.getAttribute(DATA_DELAY_MS) || 0;

      if (!ctx) {
        return;
      }

      // Go!
      setTimeout(function() {
        window.requestAnimationFrame( tick );
        startedTime = +new Date();
        isStarted = true;
      }, delay);

    };

    // returns public methods
    // to the world outside
    return api;

  };

  /*
   * Register the component
   */
  componentLoader.register("knob", components.Knob);


}());

