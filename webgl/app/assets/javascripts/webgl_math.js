var webgl = webgl || {};
webgl.math = (function () {
  'use strict';

  //2-tuple array
  function vec2 (a, b) {
    return [a,b];
  }

  //3-tuple array
  function vec3 (a, b, c) {
    return [a,b,c];
  }

  //add point to vector?
  //subtract point from vector?

  //add two vectors of 2-tuple size
  function addVec2 (a, b) {
    return [(a[0] + b[0]), (a[1] + b[1])];
  }

  //subtract two vectors of 2-tuple size
  function subtractVec2 (a, b) {
    return [a[0] + -(b[0]), a[1] + -(b[1])];
  }

  //length of vector of 2-tuple size
  function magnitudeVec2 (vec) {
    return Math.sqrt((vec[0] * vec[0]) + (vec[1] * vec[1]));
  }

  //add two vectors of 3-tuple size
  function addVec3 (a, b) {
    return [(a[0] + b[0]), (a[1] + b[1]), (a[2] + b[2])];
  }

  //subtract two vectors of 3-tuple size
  function subtractVec3 (a, b) {
    return [a[0] + -(b[0]), a[1] + -(b[1]), a[2] + -(b[2])];
  }

  //length of vector of 3-tuple size
  function magnitudeVec3 (vec) {
    return Math.sqrt((vec[0] * vec[0]) + (vec[1] * vec[1]) + (vec[2] + vec[2]));
  }

  //multiply 2-tuple size vector by a scalar
  function multiplyVec2 (vec, scalar) {
    return [vec[0] * scalar, vec[1] * scalar];
  }

  //multiply 3-tuple size vector by a scalar
  function multiplyVec3 (vec, scalar) {
    return [vec[0] * scalar, vec[1] * scalar, vec[2] * scalar];
  }

  //aka scalar product, inner product
  //measure of the difference between the directions in which two vectors point
  //related to the angle a between vectors a and b by the formula:
  //a . b = |a||b|cos a
  //that is product of magnitude of a and b and cosine of angle a
  //returns scalar
  function dotProductVec2 (a, b) {
    return (a[0] * b[0]) + (a[1] * b[1]);
  }

  //aka vector product
  //returns a new vector that is perpendicular
  //to both vectors multiplied together
  //returns vec3
  function crossProductVec3 (a, b) {
    var x = 0;
    var y = 1;
    var z = 2;
    //A x B = { yz - zy, zx - xz, xy - yx }
    //when calculating the current axis
    //you want to subtract the product of the other axes
    return (a[y] * b[z] - a[z] * b[y], 
            a[z] * b[x] - a[x] * b[z], 
            a[x] * b[y] - a[y] * b[x]);
  }

  return {
    vec2 : vec2,
    vec3 : vec3,
    addVec2 : addVec2,
    addVec3 : addVec3,
    subtractVec2 : subtractVec2,
    subtractVec3 : subtractVec3
  };
})();