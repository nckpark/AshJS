define(["components/Position", "components/Display", "ash/Node"], function(Position, Display, ashNode) {
	function RenderNode() {
	  this.position = new Position();
	  this.display = new Display();
	}
	RenderNode.prototype = new ashNode();
	return RenderNode;
});