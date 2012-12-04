(function() {

function MovementSystem(gameConfig) {
  // Private Properties
  var _nodes;
  var config = gameConfig;

  // System Functions
  this.setup = function(game) {
    _nodes = game.getNodeList( MovementNode );
  }

  this.update = function(time) {
    time /= 1000.0; // convert time from ms to seconds

    for( var i = 0; i < _nodes.length(); i++ ) {
      var node = _nodes.at(i);
      var position = node.position;
      var motion = node.motion;

      position.position.x += motion.velocity.x * time;
      position.position.y += motion.velocity.y * time;

      if ( position.position.x < 0 )
      {
        position.position.x += config.width;
      }
      if ( position.position.x > config.width )
      {
        position.position.x -= config.width;
      }
      if ( position.position.y < 0 )
      {
        position.position.y += config.height;
      }
      if ( position.position.y > config.height )
      {
        position.position.y -= config.height;
      }
      position.rotation += motion.angularVelocity * time;
      if ( motion.damping > 0 )
      {
        var xDamp = Math.abs( Math.cos( position.rotation ) * motion.damping * time );
        var yDamp = Math.abs( Math.sin( position.rotation ) * motion.damping * time );
        if ( motion.velocity.x > xDamp )
        {
          motion.velocity.x -= xDamp;
        }
        else if ( motion.velocity.x < -xDamp )
        {
          motion.velocity.x += xDamp;
        }
        else
        {
          motion.velocity.x = 0;
        }
        if ( motion.velocity.y > yDamp )
        {
          motion.velocity.y -= yDamp;
        }
        else if ( motion.velocity.y < -yDamp )
        {
          motion.velocity.y += yDamp;
        }
        else
        {
          motion.velocity.y = 0;
        }
      }
    }
  }

  this.detach = function(game) {
    _nodes = null;
  }
}
MovementSystem.prototype = new ash.System();

this.MovementSystem = MovementSystem;
}());