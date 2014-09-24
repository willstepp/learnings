var webgl = webgl || {};
webgl.two = {};

//Pyramid
webgl.two.pyramid = (function () {
  'use strict';

  var canvas, shader, gl;
  var width = 640;
  var height = 480;
  var pyramidColors = [
    //left red
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    //front green
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    //right blue
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    //back yellow
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,

    //bottom purple (two triangles)
    1.0, 0.0, 1.0,
    1.0, 0.0, 1.0,
    1.0, 0.0, 1.0,
    1.0, 0.0, 1.0,
    1.0, 0.0, 1.0,
    1.0, 0.0, 1.0,

  ];
  var pyramidVerticies = [
    //left face
    0, 1, 0,
    -1, -1, -1,
    -1, -1, 1,
    //front face
    0, 1, 0,
    -1, -1, 1,
    1, -1, 1,
    //right face
    0, 1, 0,
    1, -1, 1,
    1, -1, -1,
    //back face
    0, 1, 0,
    1, -1, -1,
    -1, -1, -1,
    //bottom face one
    -1, -1, -1,
    -1, -1, 1,
    1, -1, -1,
    //bottom face two
    -1, -1, 1,
    1, -1, 1,
    1, -1, -1
  ];

  function render () {
    //colors
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyramidColors), gl.STATIC_DRAW);

    //color attribute
    var colorAttribute = gl.getAttribLocation(shader, "color");
    gl.vertexAttribPointer(colorAttribute, 3, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(colorAttribute);

    //geometry
    var pyramidBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyramidVerticies), gl.STATIC_DRAW);
  
    //geometry attribute
    var positionAttribute = gl.getAttribLocation(shader, "apos");
    gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(positionAttribute);

    webgl.utils.clearScene(gl);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function init () {
    canvas = document.getElementById("ui-canvas");
    gl = webgl.utils.initGl(canvas);
    if (gl) {

      webgl.utils.initScene(gl, canvas, width, height);

      var shaders = webgl.utils.initShaders(gl, "ui-vertex-shader", "ui-fragment-shader", []);
      shader = shaders.program;

      render();
    }
  }

  return {
    init : init
  };
})();

//3D Triangles
webgl.two.sierpenski_triangles_3d = (function () {
  'use strict';

  var canvas;
  var gl;

  var points = [];
  var colors = [];

  var NumTimesToSubdivide = 3;

  var width = 640;
  var height = 480;

  function triangle( a, b, c, color )
  {

      // add colors and vertices for one triangle

      var baseColors = [
          vec3(1.0, 0.0, 0.0),
          vec3(0.0, 1.0, 0.0),
          vec3(0.0, 0.0, 1.0),
          vec3(0.0, 0.0, 0.0)
      ];

      colors.push( baseColors[color] );
      points.push( a );
      colors.push( baseColors[color] );
      points.push( b );
      colors.push( baseColors[color] );
      points.push( c );
  }

  function tetra( a, b, c, d )
  {
      // tetrahedron with each side using
      // a different color
      
      triangle( a, c, b, 0 );
      triangle( a, c, d, 1 );
      triangle( a, b, d, 2 );
      triangle( b, c, d, 3 );
  }

  function divideTetra( a, b, c, d, count )
  {
      // check for end of recursion
      
      if ( count === 0 ) {
          tetra( a, b, c, d );
      }
      
      // find midpoints of sides
      // divide four smaller tetrahedra
      
      else {
          var ab = mix( a, b, 0.5 );
          var ac = mix( a, c, 0.5 );
          var ad = mix( a, d, 0.5 );
          var bc = mix( b, c, 0.5 );
          var bd = mix( b, d, 0.5 );
          var cd = mix( c, d, 0.5 );

          --count;
          
          divideTetra(  a, ab, ac, ad, count );
          divideTetra( ab,  b, bc, bd, count );
          divideTetra( ac, bc,  c, cd, count );
          divideTetra( ad, bd, cd,  d, count );
      }
  }


  function render()
  {
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays( gl.TRIANGLES, 0, points.length );
  }

  function init () {
    canvas = document.getElementById( "ui-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the vertices of our 3D gasket
    // Four vertices on unit circle
    // Intial tetrahedron with equal length sides
    
    var vertices = [
        vec3(  0.0000,  0.0000, -1.0000 ),
        vec3(  0.0000,  1.0,  0.0 ),
        vec3( -1.0, -1.0,  0.0 ),
        vec3(  1.0, -1.0,  0.0 )
    ];
    
    divideTetra( vertices[0], vertices[1], vertices[2], vertices[3],
                 NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    //gl.viewport( 0, 0, canvas.width, canvas.height );

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    //ensures high dpi displays are not blurry
    var devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    gl.viewport(0, 0, width * devicePixelRatio, height * devicePixelRatio);
    gl.viewport(0, 0, width * devicePixelRatio, height * devicePixelRatio);

    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    // enable hidden-surface removal
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "ui-vertex-shader", "ui-fragment-shader" );
    gl.useProgram( program );
    
    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
  }

  return {
    init : init
  };
})();

//2D Triangles
webgl.two.sierpenski_triangles_2d = (function () {
  'use strict';

  var gl, canvas, shaderProgram;
  var width = 640;
  var height = 480;
  var canvasId = "ui-canvas";
  var fragmentShaderId = "ui-fragment-shader";
  var vertextShaderId = "ui-vertex-shader";
  var sierpenski = {
    buffer: null,
    verticies:[],
    attributes: {
      "sierPosition":null
    }
  };
  var numTimesToSubdivide = 5;
  var numTriangles = 729;//3^5
  var numVertices = 3 * numTriangles;

  function redraw () {
    webgl.utils.clearScene(gl);

    //draw sierpenski
    gl.bindBuffer(gl.ARRAY_BUFFER, sierpenski.buffer);
    gl.vertexAttribPointer(sierpenski.attributes.sierPosition, 3, gl.FLOAT, true, 0, 0);
    gl.vertexAttribPointer(sierpenski.attributes.sierColor, 3, gl.FLOAT, true, 0, sierpenski.verticies.length);
    gl.drawArrays(gl.TRIANGLES, 0, numTriangles);
  }

  function setupDisplay () {
    redraw();
  }

  function triangle(a, b, c) {
    sierpenski.verticies.push(a.x);
    sierpenski.verticies.push(a.y);
    sierpenski.verticies.push(a.z);

    sierpenski.verticies.push(b.x);
    sierpenski.verticies.push(b.y);
    sierpenski.verticies.push(b.z);

    sierpenski.verticies.push(c.x);
    sierpenski.verticies.push(c.y);
    sierpenski.verticies.push(c.z);
  }

  function divide_triangle(a, b, c, count) {
    if(count > 0) {

      var mid = webgl.utils.midpoint(a.x, a.y, b.x, b.y, 0);
      var ab = { x:mid[0], y:mid[1], z:mid[2] };

      mid = webgl.utils.midpoint(a.x, a.y, c.x, c.y, 0);
      var ac = { x:mid[0], y:mid[1], z:mid[2] };

      mid = webgl.utils.midpoint(b.x, b.y, c.x, c.y, 0);
      var bc = { x:mid[0], y:mid[1], z:mid[2] };

      //subdivide all but inner triangle
      divide_triangle(a, ab, ac, count-1);
      divide_triangle(c, ac, bc, count-1);
      divide_triangle(b, bc, ab, count-1);
    }
    else triangle(a,b,c); /* draw triangle at end of recursion */
  }

  function generateSierpenskiTriangles () {
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
    sierpenski.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sierpenski.buffer);
    generateSierpenskiTriangles();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sierpenski.verticies), gl.STATIC_DRAW);
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

//Points
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
      var mid = webgl.utils.midpoint(randomVert.x, randomVert.y, pointInTriangle.x, pointInTriangle.y, 0);
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
    webgl.utils.clearScene(gl);

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