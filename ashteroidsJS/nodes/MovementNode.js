(function() {

function MovementNode() {
  this.position = new Position();
  this.motion = new Motion();
}
MovementNode.prototype = new ash.Node();

this.MovementNode = MovementNode;
}());