define(["components/GameState", "ash/Node"], function(GameState, ashNode) {
	function GameNode() {
	  this.state = new GameState();
	}
	GameNode.prototype = new ashNode();
	return GameNode;
});