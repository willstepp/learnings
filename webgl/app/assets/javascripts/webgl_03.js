var webgl = webgl || {};
webgl.three = {};

//Square Rotation
webgl.three.square_rotation = (function () {
  'use strict';

  var gl, canvas, shader;
  var width = 640;
  var height = 480;
  var square = [
    vec2(0, 1),
    vec2(1, 0),
    vec2(-1, 0),
    vec2(0, -1)
  ];
  var theta = 0.0;
  var thetaLocation;
  var direction = true;

  function render () {
    setTimeout(function () {
      requestAnimFrame(render);
      webgl.utils.clearScene(gl);
      //update angle variable in shader
      theta -= (direction ? 0.025 : -0.025);
      gl.uniform1f(thetaLocation, theta);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }, 15); 
  }

  function init () {
    canvas = document.getElementById("ui-canvas");
    gl = webgl.utils.initGl(canvas);
    if (gl) {
      webgl.utils.initScene(gl, canvas, width, height);

      var bufferId = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(square), gl.STATIC_DRAW);

      var shaders = webgl.utils.initShaders(gl, "ui-vertex-shader", "ui-fragment-shader", []);
      shader = shaders.program;

      var positionAttribute = gl.getAttribLocation(shader, "position");
      gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, true, 0, 0);
      gl.enableVertexAttribArray(positionAttribute);

      thetaLocation = gl.getUniformLocation(shader, "theta");

      var button = document.getElementById("ui-direction-button");
      button.addEventListener("click", function (e) { direction = !direction; });

      render();
    }
  }

  return {
    init : init
  };
})();