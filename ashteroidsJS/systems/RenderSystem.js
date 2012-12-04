(function() {

function RenderSystem(canvas) {
  // Public Properties
  this.canvas = canvas;

  // Private Properties
  var _nodes;
  var _stage = new createjs.Stage(this.canvas);

  // System Functions
  this.setup = function(game) {
    _nodes = game.getNodeList( RenderNode );
    for( var i = 0; i < _nodes.length(); i++ ) {
      _addToDisplay( _nodes.at(i) );
    }

    _nodes.addSubscriber('nodeAdded', _addToDisplay);
    _nodes.addSubscriber('nodeRemoved', _removeFromDisplay);
  }

  this.update = function(time) {
    for( var i = 0; i < _nodes.length(); i++ ) {
      var node = _nodes.at(i);
      var displayObject = node.display.displayObject;
      var position = node.position;

      displayObject.x = position.position.x;
      displayObject.y = position.position.y;
      displayObject.rotation = position.rotation * 180 / Math.PI;
    }

    _stage.update();
  }

  this.detach = function(game) {
    _nodes.removeSubscriber('nodeAdded', _addToDisplay);
    _nodes.removeSubscriber('nodeRemoved', _removeFromDisplay);
    _nodes = null;
  }

  // Private Functions
  var _addToDisplay = function(renderNode) {
    _stage.addChild( renderNode.display.displayObject );
  }

  var _removeFromDisplay = function(renderNode) {
    _stage.removeChild( renderNode.display.displayObject );
  }
}
RenderSystem.prototype = new ash.System();

this.RenderSystem = RenderSystem;
}());