var webgl = webgl || {};
webgl.three = {};

//Square Rotation
webgl.three.square_rotation = (function () {
  'use strict';

  var gl, canvas;
  var width = 640;
  var height = 480;

  function init () {
    canvas = document.getElementById("ui-canvas");
    gl = webgl.utils.initGl(canvas);
    if (gl) {
      webgl.utils.initScene(gl, canvas, width, height);
    }
  }

  return {
    init : init
  };
})();