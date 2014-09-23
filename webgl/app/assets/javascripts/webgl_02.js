var webgl = webgl || {};

webgl.two = {};
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

  function initWebGL(canvas) {
    gl = null;
    
    try {
      // Try to grab the standard context. If it fails, fallback to experimental.
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}
    
    // If we don't have a GL context, give up now
    if (!gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      gl = null;
    }
    
    return gl;
  }

  function getShader(gl, id) {
    var shaderScript, theSource, currentChild, shader;
    
    shaderScript = document.getElementById(id);
    
    if (!shaderScript) {
      return null;
    }
    
    theSource = "";
    currentChild = shaderScript.firstChild;
    
    while(currentChild) {
      if (currentChild.nodeType == currentChild.TEXT_NODE) {
        theSource += currentChild.textContent;
      }
      
      currentChild = currentChild.nextSibling;
    }

    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
       // Unknown shader type
       return null;
    }

    gl.shaderSource(shader, theSource);
      
    // Compile the shader program
    gl.compileShader(shader);  
      
    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
        return null;  
    }
      
    return shader;
  }

  function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");
    
    // Create the shader program
    
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    // If creating the shader program failed, alert
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program.");
    }
    
    gl.useProgram(shaderProgram);

    sierpenskiPositionAttribute = gl.getAttribLocation(shaderProgram, "aSierpenskiPosition");
    gl.enableVertexAttribArray(sierpenskiPositionAttribute);
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

  function sierpenskiTriangles (numPoints) {

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

  function initResolution(canvas) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    //ensures high dpi displays are not blurry
    var devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    gl.viewport(0, 0, width * devicePixelRatio, height * devicePixelRatio);
  }

  function init() {
    var canvas = document.getElementById("ui-canvas");
    gl = initWebGL(canvas); //Initialize the GL context
    
    // Only continue if WebGL is available and working
    if (gl) {
      initResolution(canvas);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
      gl.clear(gl.COLOR_BUFFER_BIT);      // Clear the color as well as the depth buffer.

      //Initialize the shaders; this is where all the lighting for the
      //vertices and so forth is established.
      initShaders();
      
      //This function builds all the objects we'll be drawing.
      initBuffers();
      
      // Set up to draw the scene periodically.
      drawScene();
    }
  }

  return {
    init : init
  };
})();