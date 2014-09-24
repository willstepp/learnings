var webgl = webgl || {};
webgl.utils = (function () {

  function initWebGL(canvas) {
    var gl = null;
    
    try {
      // Try to grab the standard context. If it fails, fallback to experimental.
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}
    
    // If we don't have a GL context, give up now
    if (!gl) {
      console.log("Unable to initialize WebGL. Your browser may not support it.");
      gl = null;
    }
    
    return gl;
  }

  function initGl (canvas) {
    return initWebGL(canvas);
  }

  function clearScene (glContext) {
    glContext.clearColor(0.0, 0.0, 0.0, 1.0);//black
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
  }

  function initScene (glContext, canvas, width, height) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    //ensures high dpi displays are not blurry
    var devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    glContext.viewport(0, 0, width * devicePixelRatio, height * devicePixelRatio);
    glContext.enable(glContext.DEPTH_TEST);

    //set initial scene
    clearScene(glContext);
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
        console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
        return null;  
    }
      
    return shader;
  }

  function initShaders (glContext, vertextShaderId, fragmentShaderId, shaderAttributes) {
    var fragmentShader = getShader(glContext, fragmentShaderId);
    var vertexShader = getShader(glContext, vertextShaderId);
    
    //create the shader program
    var program = glContext.createProgram();
    glContext.attachShader(program, vertexShader);
    glContext.attachShader(program, fragmentShader);
    glContext.linkProgram(program);
    
    //if creating the shader program failed, log
    if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
      console.log("Unable to initialize the shader program.");
    }
    
    glContext.useProgram(program);

    //setup shader attribute positions
    var attributes = {};
    for (var sa = 0; sa < shaderAttributes.length; sa += 1) {
      var name = shaderAttributes[sa];
      attributes[name] = glContext.getAttribLocation(program, name);
      glContext.enableVertexAttribArray(attributes[name]);
    }
    return { program:program, attributes:attributes };
  }

  function midpoint(x1, y1, x2, y2, z1, z2) {
    var mid = [];
    mid.push(((x1 + x2) / 2.0));
    mid.push(((y1 + y2) / 2.0));
    mid.push(0);
    mid.push(0);
    return mid;
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return {
    initGl : initGl,
    initScene : initScene,
    initShaders : initShaders,
    midpoint : midpoint,
    rand : rand,
    clearScene : clearScene
  };
})();