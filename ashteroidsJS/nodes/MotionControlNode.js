(function() {

function MotionControlNode() {
  this.control = new MotionControls();
  this.position = new Position();
  this.motion = new Motion();
}
MotionControlNode.prototype = new ash.Node();

this.MotionControlNode = MotionControlNode;
}());