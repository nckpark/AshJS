define(["components/Spaceship", "components/Position", "components/Collision", "ash/Node"], function(Spaceship, Position, Collision, ashNode) {
	function SpaceshipCollisionNode() {
	  this.spaceship = new Spaceship();
	  this.position = new Position();
	  this.collision = new Collision();
	}
	SpaceshipCollisionNode.prototype = new ashNode();
	return SpaceshipCollisionNode;
});