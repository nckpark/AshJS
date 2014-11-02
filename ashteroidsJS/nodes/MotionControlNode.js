define(["components/MotionControls", "components/Position", "components/Motion", "ash/Node"], function(MotionControls, Position, Motion, ashNode) {
	function MotionControlNode() {
	  this.control = new MotionControls();
	  this.position = new Position();
	  this.motion = new Motion();
	}
	MotionControlNode.prototype = new ashNode();
	return MotionControlNode;
});