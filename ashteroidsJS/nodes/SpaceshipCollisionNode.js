(function() {

function SpaceshipCollisionNode() {
  this.spaceship = new Spaceship();
  this.position = new Position();
  this.collision = new Collision();
}
SpaceshipCollisionNode.prototype = new ash.Node();

this.SpaceshipCollisionNode = SpaceshipCollisionNode;
}());