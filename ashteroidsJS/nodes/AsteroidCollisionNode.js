(function() {

function AsteroidCollisionNode() {
  this.asteroid = new Asteroid();
  this.position = new Position();
  this.collision = new Collision();
}
AsteroidCollisionNode.prototype = new ash.Node();

this.AsteroidCollisionNode = AsteroidCollisionNode;
}());