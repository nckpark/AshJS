(function() {

function MotionControls(leftKey, rightKey, accelerateKey, accelerationRate, rotationRate) {
  this.left = leftKey;
  this.right = rightKey;
  this.accelerate = accelerateKey;
  this.accelerationRate = accelerationRate;
  this.rotationRate = rotationRate;
}

this.MotionControls = MotionControls;
}());