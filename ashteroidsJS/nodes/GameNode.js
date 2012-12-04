(function() {

function GameNode() {
  this.state = new GameState();
}
GameNode.prototype = new ash.Node();

this.GameNode = GameNode;
}());