define(["components/Spaceship", "components/Position", "ash/Node"], function(Spaceship, Position, ashNode) {
	function SpaceshipNode() {
	  this.spaceship = new Spaceship();
	  this.position = new Position();
	}
	SpaceshipNode.prototype = new ashNode();
	return SpaceshipNode;
});