define(["nodes/GameNode", "nodes/SpaceshipNode", "nodes/AsteroidCollisionNode", "ash/System", "easel"] , function(GameNode, SpaceshipNode, AsteroidCollisionNode, ashSystem) {
  function GameManager(entityCreator, gameConfig) {
    var _creator = entityCreator;
    var _config = gameConfig;

    var _gameNodes;
    var _spaceships;
    var _asteroids;

    this.setup = function(game) {
      _gameNodes = game.getNodeList( GameNode );
      _spaceships = game.getNodeList( SpaceshipNode );
      _asteroids = game.getNodeList( AsteroidCollisionNode );
    }

    this.update = function(time) {
      for( var i = 0; i < _gameNodes.length(); i++ ) {
        var gameNode = _gameNodes.at(i);

        if( _spaceships.empty() ) {
          if( gameNode.state.lives > 0 ) {
            var newSpaceshipPosition = new createjs.Point( _config.width * 0.5, _config.height * 0.5 );
            var clearToAddSpaceship = true;
            for( k = 0; k < _asteroids.length(); k++ ) {
              var asteroid = _asteroids.at(k);
              if( _distance(asteroid.position.position, newSpaceshipPosition) <= asteroid.collision.radius + 50 ) {
                clearToAddSpaceship = false;
                break;
              }
            }
            if( clearToAddSpaceship ) {
              _creator.createSpaceship();
              gameNode.state.lives--; 
            }
          }
          else {
            // game over
          }
        }

        if( _asteroids.empty() && !_spaceships.empty() ) {
          // next level
          var spaceship = _spaceships.at(0);
          gameNode.state.level++;
          var asteroidCount = gameNode.state.level + 2;
          for( var k = 0; k < asteroidCount; ++k ) {
            // avoid starting on top of the spaceship
            var asteroidPos;
            do {
              asteroidPos = new createjs.Point( Math.random() * _config.width, Math.random() * _config.height ); 
            } while( _distance(asteroidPos, spaceship.position.position ) <= 80 );
            _creator.createAsteroid( 30, asteroidPos.x, asteroidPos.y );
          }
        }

      }
    }

    // <?> Not sure this is quite right or necessary for Javascript
    this.detach = function() {
      _gameNodes = null;
      _asteroids = null;
      _spaceships = null;
    }

    // Private functions
    var _distance = function(point1, point2) {
      return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    }
  }
  GameManager.prototype = new ashSystem();
  return GameManager;
});