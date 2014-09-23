var webgl = webgl || {};
webgl.two = {};

webgl.two.sierpenski_triangles = (function () {
  'use strict';

  var gl, canvas, shaderProgram;
  var width = 640;
  var height = 480;
  var canvasId = "ui-canvas";
  var fragmentShaderId = "ui-fragment-shader";
  var vertextShaderId = "ui-vertex-shader";

  function setupDisplay () {
    //here we render to the display
  }

  function setupBuffers () {
    //here we define the geometry to render
  }

  function setupShaders() {
    //here we initialize the programmable shaders (vertext and fragment) and relevant attributes
    var shaders = webgl.utils.initShaders(gl, vertextShaderId, fragmentShaderId, []);
    shaderProgram = shaders.program;
  }

  function setupScene() {
    //here we setup the correct background color and resolution
    webgl.utils.initScene(gl, canvas, width, height);
  }

  function setupGl () {
    //here we initialize a glcontext on a canvas element
    return webgl.utils.initGl(canvas);
  }

  function init () {
    canvas = document.getElementById(canvasId);
    gl = setupGl();
    if (gl) {
      setupScene();
      setupShaders();
      setupBuffers();
      setupDisplay();
    }
  }

  return {
    init : init
  };
})();

webgl.two.sierpenski_points = (function () {
  'use strict';

  var gl;
  var width = 640;
  var height = 480;
  var numPoints = 200000;
  var sierpenskiVerticesBuffer;
  var sierpenskiPositionAttribute;
  var shaderProgram;
  var perspectiveMatrix, orthoMatrix;
  var mvMatrix;

  function loadIdentity() {
    mvMatrix = Matrix.I(4);
  }

  function multMatrix(m) {
    mvMatrix = mvMatrix.x(m);
  }

  function mvTranslate(v) {
    multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
  }

  function setMatrixUniforms() {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
  }

  function initShaders() {
    var shaders = webgl.utils.initShaders(gl, "shader-vs", "shader-fs", ["aSierpenskiPosition"]);
    sierpenskiPositionAttribute = shaders.positions.aSierpenskiPosition;
    shaderProgram = shaders.program;
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function midpoint(x1, y1, x2, y2) {
    var mid = [];
    mid.push(((x1 + x2) / 2.0));
    mid.push(((y1 + y2) / 2.0));
    return mid;
  }

  function sierpenskiPoints (numPoints) {
    var sp = [];

    var triangle = [
      { x:-1.0, y:-1.0, z:0.0 },
      { x:0.0, y:1.0, z:0.0 },
      { x:1.0, y:-1.0, z:0.0 }
    ];
    var pointInTriangle = { x:0.25, y:0.50, z:0 };

    for (var i = 0; i < numPoints; i += 1) {
      var randomVert = triangle[rand(0, 2)];
      var mid = midpoint(randomVert.x, randomVert.y, pointInTriangle.x, pointInTriangle.y);
      mid.push(0.0); //z plane
      sp.push(mid[0]);
      sp.push(mid[1]);
      sp.push(mid[2]);
      pointInTriangle = { x:mid[0], y:mid[1], z:mid[2] };
    }

    return sp;
  }

  function initBuffers() {
    //sierpenski
    sierpenskiVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sierpenskiVerticesBuffer);
    var sp = sierpenskiPoints(numPoints);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sp), gl.STATIC_DRAW);
  }

  function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    perspectiveMatrix = makeOrtho(-1, 1, -1, 1, -1, 1);
    
    loadIdentity();

    //draw sierpenski
    gl.bindBuffer(gl.ARRAY_BUFFER, sierpenskiVerticesBuffer);
    gl.vertexAttribPointer(sierpenskiPositionAttribute, 3, gl.FLOAT, true, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.POINTS, 0, numPoints);
  }

  function init() {
    var canvas = document.getElementById("ui-canvas");
    gl = webgl.utils.initGl(canvas);
    if (gl) {
      webgl.utils.initScene(gl, canvas, width, height);

      initShaders();
      initBuffers();
      
      drawScene();
    }
  }

  return {
    init : init
  };
})();