(function() {

function RenderNode() {
  this.position = new Position();
  this.display = new Display();
}
RenderNode.prototype = new ash.Node();

this.RenderNode = RenderNode;
}());