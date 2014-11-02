define(["nodes/MotionControlNode", "ash/System"], function(MotionControlNode, ashSystem) {
  function MotionControlSystem() {
    // Public Properties
    this.keyPressed = Object.create(null);

    // Private Properties
    var _nodes;

    // System Functions
    this.setup = function(game) {
      _nodes = game.getNodeList( MotionControlNode );

      for( var i = 0; i < _nodes.length(); i++ ) {
        var node = _nodes.at(i);
        this.keyPressed[node.control.left] = false;
        this.keyPressed[node.control.right] = false;
        this.keyPressed[node.control.accelerate] = false;
      }

      // Need to subscribe to node add and remove to update the keyPressed contents if motion controls are added on the fly

      window.onkeydown = function(event) {
        controlSystem = game.getSystem( MotionControlSystem );
        controlSystem.keyPressed[event.which] = true;
      }
      
      window.onkeyup = function(event) {
        controlSystem = game.getSystem( MotionControlSystem );
        controlSystem.keyPressed[event.which] = false;
      }
    }

    this.update = function(time) {
      time /= 1000.0; // convert from ms to seconds

      for( var i = 0; i < _nodes.length(); i++ ) {
        var node = _nodes.at(i);
        var control = node.control;
        var position = node.position;
        var motion = node.motion;

        if( this.keyPressed[control.left] )
        {
          position.rotation -= control.rotationRate * time;
        }

        if( this.keyPressed[control.right] )
        {
          position.rotation += control.rotationRate * time;
        }

        if( this.keyPressed[control.accelerate] )
        {
          motion.velocity.x += Math.cos( position.rotation ) * control.accelerationRate * time;
          motion.velocity.y += Math.sin( position.rotation ) * control.accelerationRate * time;
        }
      }
    }

    this.detach = function(game) {
      _nodes = null;
    }
  }
  MotionControlSystem.prototype = new ashSystem();
  return MotionControlSystem;
});