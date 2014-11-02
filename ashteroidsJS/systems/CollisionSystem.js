define(["nodes/AsteroidCollisionNode", "nodes/SpaceshipCollisionNode", "ash/System"], function(AsteroidCollisionNode, SpaceshipCollisionNode, ashSystem) {
  function CollisionSystem(entityCreator) {
    // Private Properties
    var _creator = entityCreator;
    var _asteroids;
    var _spaceships;
    // skipped bullets for the time being

    // System Functions
    this.setup = function(game) {
      _asteroids = game.getNodeList(AsteroidCollisionNode);
      _spaceships = game.getNodeList(SpaceshipCollisionNode);
    }

    this.update = function(time) {
      for( var i = 0; i < _spaceships.length(); i++ ) {
        var spaceship = _spaceships.at(i);
        for( var j = 0; j < _asteroids.length(); j++ ) {
          var asteroid = _asteroids.at(j);
          var distance = _distance(asteroid.position.position, spaceship.position.position);
          if( distance <= asteroid.collision.radius + spaceship.collision.radius ) {
            _creator.destroyEntity(spaceship.entity);
            break;
          }
        }
      }
    }

    this.detach = function(game) {
      _asteroids = null;
      _spaceships = null;
    }

    // Private Functions
    var _distance = function(point1, point2) {
      return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    }
  }
  CollisionSystem.prototype = new ashSystem();
  return CollisionSystem;
});