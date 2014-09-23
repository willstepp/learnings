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
      alert("Unable to initialize WebGL. Your browser may not support it.");
      gl = null;
    }
    
    return gl;
  }

  function initGl (canvas) {
    return initWebGL(canvas);
  }

  function initScene (glContext, canvas, width, height) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    //ensures high dpi displays are not blurry
    var devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    glContext.viewport(0, 0, width * devicePixelRatio, height * devicePixelRatio);

    //set initial view
    glContext.clearColor(0.0, 0.0, 0.0, 1.0); //black opaque
    glContext.clear(glContext.COLOR_BUFFER_BIT);
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

  function initShaders (glContext, vertextShaderId, fragmentShaderId, shaderAttributes) {
    var fragmentShader = getShader(glContext, fragmentShaderId);
    var vertexShader = getShader(glContext, vertextShaderId);
    
    //create the shader program
    shaderProgram = glContext.createProgram();
    glContext.attachShader(shaderProgram, vertexShader);
    glContext.attachShader(shaderProgram, fragmentShader);
    glContext.linkProgram(shaderProgram);
    
    //if creating the shader program failed, log
    if (!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS)) {
      console.log("Unable to initialize the shader program.");
    }
    
    glContext.useProgram(shaderProgram);

    //setup shader attribute positions
    var shaderPositions = {};
    for (var sa = 0; sa < shaderAttributes.length; sa += 1) {
      var attributeName = shaderAttributes[sa];
      shaderPositions[attributeName] = glContext.getAttribLocation(shaderProgram, attributeName);
      glContext.enableVertexAttribArray(shaderPositions[attributeName]);
    }
    return { program:shaderProgram, positions:shaderPositions };
  }

  return {
    initGl : initGl,
    initScene : initScene,
    initShaders : initShaders
  };
})();