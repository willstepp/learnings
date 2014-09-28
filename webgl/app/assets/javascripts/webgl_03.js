var webgl = webgl || {};
webgl.three = {};

//CAD
webgl.three.cad = (function () {
  'use strict';
var canvas;
var gl;

var maxNumTriangles = 200;  
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;
var first = true;

var t1, t2, t3, t4;

var cIndex = 0;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

function getCursorPosition(e) {
  var x;
  var y;
  if (e.pageX !== undefined && e.pageY !== undefined) {
    x = e.pageX;
    y = e.pageY;
      }
      else {
    x = e.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;

  }
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  return {x:x,y:y};
}


function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL isn't available" ); }
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear( gl.COLOR_BUFFER_BIT );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    
    var m = document.getElementById("mymenu");
    m.addEventListener("change", function(e) {
      cIndex = m.selectedIndex;
    });

    
    canvas.addEventListener("mousedown", function(event){
      var pos = getCursorPosition(event);
      var x = pos.x;
      var y = pos.y;

        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
        if(first) {
          first = false;
          gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
          console.log("origin x: " + (2*x/canvas.width-1) + " origin y: " + (2*(canvas.height-y)/canvas.height-1));
          t1 = vec2(2*x/canvas.width-1, 2*(canvas.height-y)/canvas.height-1);
        }
        else {
          first = true;
          t2 = vec2(2*x/canvas.width-1, 
            2*(canvas.height-y)/canvas.height-1);
          t3 = vec2(t1[0], t2[1]);
          t4 = vec2(t2[0], t1[1]);

          gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
          gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t3));
          gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(t2));
          gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+3), flatten(t4));
          gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
          
          var t = vec4(colors[cIndex]);

          gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index), flatten(t));
          gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+1), flatten(t));
          gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+2), flatten(t));
          gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+3), flatten(t));
        }
          index += 4;
    } );

    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );

    for(var i = 0; i<index; i+=4)
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );

    window.requestAnimFrame(render);

}

  return {
    init : init
  };
})();

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