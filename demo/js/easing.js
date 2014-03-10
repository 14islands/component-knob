/* Robert Penners easing algorithms
 * http://www.gizma.com/easing/
 *
 * t: current time
 * b: start value
 * c: total change in value
 * d: duration
 */

window.easing = {

  easeInSine: function (t, b, c, d) {
    'use strict';
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
  },

  easeOutSine: function (t, b, c, d) {
    'use strict';
    return c * Math.sin(t/d * (Math.PI/2)) + b;
  },

  easeInOutSine: function (t, b, c, d) {
    'use strict';
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  },

  easeInQuad: function (t, b, c, d) {
    'use strict';
    t /= d;
    return c*t*t + b;
  },

  easeOutQuad: function (t, b, c, d) {
    'use strict';
    t /= d;
    return -c * t*(t-2) + b;
  },

  easeInOutQuad: function (t, b, c, d) {
    'use strict';
    t /= d/2;
    if (t < 1) { return c/2*t*t + b; }
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  },

  easeInOutQuart: function (t, b, c, d) {
    'use strict';
    t /= d/2;
    if (t < 1) { return c/2*t*t*t*t + b; }
    t -= 2;
    return -c/2 * (t*t*t*t - 2) + b;
  }

};