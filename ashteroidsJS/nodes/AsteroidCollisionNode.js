define(["components/Asteroid", "components/Position", "components/Collision", "ash/Node"], function(Asteroid, Position, Collision, ashNode) {
	function AsteroidCollisionNode() {
	  this.asteroid = new Asteroid();
	  this.position = new Position();
	  this.collision = new Collision();
	}
	AsteroidCollisionNode.prototype = new ashNode();
	return AsteroidCollisionNode;
});