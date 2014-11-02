define(["components/Position", "components/Motion", "ash/Node"], function(Position, Motion, ashNode) {
	function MovementNode() {
	  this.position = new Position();
	  this.motion = new Motion();
	}
	MovementNode.prototype = new ashNode();
	return MovementNode;
});