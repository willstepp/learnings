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
  var sierpenski = {
    vertices: null,
    attributes: {
      "sierPosition":null
    }
  };
  var numTimesToSubdivide = 5;
  var numTriangles = 729;  // 3^5 triangles generated
  var numVertices = 3 * numTriangles;

  function redraw () {
    webgl.utils.clear(gl);

    //draw sierpenski
    gl.bindBuffer(gl.ARRAY_BUFFER, sierpenski.vertices);
    gl.vertexAttribPointer(sierpenski.attributes.sierPosition, 3, gl.FLOAT, true, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, numTriangles);
  }

  function setupDisplay () {
    //here we render to the display
    redraw();
  }

  var points = [];
  function triangle(a, b, c) {
    points.push(a.x);
    points.push(a.y);
    points.push(a.z);

    points.push(b.x);
    points.push(b.y);
    points.push(b.z);

    points.push(c.x);
    points.push(c.y);
    points.push(c.z);
  }

  function divide_triangle(a, b, c, count) {
    if(count > 0) {

      var mid = webgl.utils.midpoint(a.x, a.y, b.x, b.y);
      mid.push(0.0);
      var ab = { x:mid[0], y:mid[1], z:mid[2] };

      mid = webgl.utils.midpoint(a.x, a.y, c.x, c.y);
      mid.push(0.0);
      var ac = { x:mid[0], y:mid[1], z:mid[2] };

      mid = webgl.utils.midpoint(b.x, b.y, c.x, c.y);
      mid.push(0.0);
      var bc = { x:mid[0], y:mid[1], z:mid[2] };

      //subdivide all but inner triangle
      divide_triangle(a, ab, ac, count-1);
      divide_triangle(c, ac, bc, count-1);
      divide_triangle(b, bc, ab, count-1);
    }
    else triangle(a,b,c); /* draw triangle at end of recursion */
  }

  function sierpenskiTriangles () {
    var triangle = [
      { x:-1.0, y:-1.0, z:0.0 },
      { x:0.0, y:1.0, z:0.0 },
      { x:1.0, y:-1.0, z:0.0 }
    ];
    //subdivide the original triangle
    divide_triangle(triangle[0], triangle[1], triangle[2], numTimesToSubdivide);
  }

  function setupBuffers () {
    //here we define the geometry to render
    sierpenski.vertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sierpenski.vertices);
    sierpenskiTriangles();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
  }

  function setupShaders() {
    //here we initialize the shaders (vertex and fragment) and associated attributes
    var shaders = webgl.utils.initShaders(gl, vertextShaderId, fragmentShaderId, Object.keys(sierpenski.attributes));
    shaderProgram = shaders.program;
    sierpenski.attributes = shaders.attributes;
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
  "use strict";

  var gl;
  var width = 640;
  var height = 480;
  var numPoints = 200000;
  var sierpenskiVerticesBuffer;
  var sierpenskiPositionAttribute;
  var shaderProgram;

  function initShaders() {
    var shaders = webgl.utils.initShaders(gl, "shader-vs", "shader-fs", ["aSierpenskiPosition"]);
    sierpenskiPositionAttribute = shaders.attributes.aSierpenskiPosition;
    shaderProgram = shaders.program;
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
      var randomVert = triangle[webgl.utils.rand(0, 2)];
      var mid = webgl.utils.midpoint(randomVert.x, randomVert.y, pointInTriangle.x, pointInTriangle.y);
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sp), gl.DYNAMIC_DRAW);
  }

  function redraw () {
    window.requestAnimationFrame(drawScene);
  }

  function drawScene() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); //black opaque
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw sierpenski
    gl.bindBuffer(gl.ARRAY_BUFFER, sierpenskiVerticesBuffer);
    gl.vertexAttribPointer(sierpenskiPositionAttribute, 3, gl.FLOAT, true, 0, 0);
    gl.drawArrays(gl.POINTS, 0, numPoints);
  }

  function init() {
    var canvas = document.getElementById("ui-canvas");
    gl = webgl.utils.initGl(canvas);
    if (gl) {
      webgl.utils.initScene(gl, canvas, width, height);

      initShaders();
      initBuffers();
      
      redraw();
    }
  }

  return {
    init : init
  };
})();