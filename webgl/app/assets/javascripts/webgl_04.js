var webgl = webgl || {};
webgl.four = {};

//Rotating Cube
webgl.four.rotating_cube = (function () {
  'use strict';

  var canvas, shader, gl;
  var width = 640;
  var height = 480;

  var theta = [0,0,0];
  var axis = 0;
  var x_axis = 0;
  var y_axis = 1;
  var z_axis = 2;

  var thetaLoc;

  //data structure to represent the faces of the cube
  //each face (6) will contain (4) verticies, shared from
  //the verticies array above
  var faces = new Array(6);
  for (var i = 0; i < faces.length; ++i) {
    faces[i] = new Array(4);
  }

  var numVerticies = 36;
  var points = [];
  var colors = [];

  function quad (a, b, c, d) {

    var verticies = [
      vec3( -0.5, -0.5,  0.5 ),
      vec3( -0.5,  0.5,  0.5 ),
      vec3(  0.5,  0.5,  0.5 ),
      vec3(  0.5, -0.5,  0.5 ),
      vec3( -0.5, -0.5, -0.5 ),
      vec3( -0.5,  0.5, -0.5 ),
      vec3(  0.5,  0.5, -0.5 ),
      vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
      [ 0.0, 0.0, 0.0, 1.0 ],  // black
      [ 1.0, 0.0, 0.0, 1.0 ],  // red
      [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
      [ 0.0, 1.0, 0.0, 1.0 ],  // green
      [ 0.0, 0.0, 1.0, 1.0 ],  // blue
      [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
      [ 1.0, 1.0, 1.0, 1.0 ],  // white
      [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];
    var indicies = [a,b,c,a,c,d];

    for (var i = 0; i < indicies.length; ++i) {
      points.push(verticies[indicies[i]]);
      colors.push(vertexColors[indicies[i]]);
      //for solid colored faces use 
      //colors.push(vertexColors[b]);
    }
  }

  function setupColorCube () {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
  }

  function render()
  {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2;

    gl.uniform3fv(thetaLoc, flatten(theta));
    gl.drawArrays( gl.TRIANGLES, 0, numVerticies );

    requestAnimFrame(render);
  }

  function init () {
    canvas = document.getElementById( "ui-canvas" );

    document.getElementById('ui-button-x').onclick = function () { axis = x_axis;console.log('x'); };
    document.getElementById('ui-button-y').onclick = function () { axis = y_axis;console.log('y'); };
    document.getElementById('ui-button-z').onclick = function () { axis = z_axis;console.log('z'); };

    gl = WebGLUtils.setupWebGL( canvas );
    if (!gl) { alert( "WebGL isn't available" ); }

    setupColorCube();

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
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 

    render();
  }

  return {
    init : init
  };
})();