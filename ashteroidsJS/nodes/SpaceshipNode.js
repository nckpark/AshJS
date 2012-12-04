(function() {

function SpaceshipNode() {
  this.spaceship = new Spaceship();
  this.position = new Position();
}
SpaceshipNode.prototype = new ash.Node();

this.SpaceshipNode = SpaceshipNode;
}());