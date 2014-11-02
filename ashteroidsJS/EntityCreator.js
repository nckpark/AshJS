define(["components/GameState", "components/Asteroid", "components/Position", "components/Collision", "components/Display", "components/Motion", "components/Spaceship", "components/MotionControls", "views/AsteroidView", "views/SpaceshipView", "ash/Entity"], 
function(GameState, Asteroid, Position, Collision, Display, Motion, Spaceship, MotionControls, AsteroidView, SpaceshipView, ashEntity) {
  function EntityCreator(game, config) {
    var _game = game;
    var _config = config;

    this.destroyEntity = function(entity) {
      _game.removeEntity(entity);
    } 

    this.createGame = function() {
      var gameEntity = new ashEntity();
      gameEntity.add( new GameState() );

      _game.addEntity(gameEntity);
      return gameEntity;
    }

    this.createAsteroid = function(radius, xPos, yPos) {
      var asteroid = new ashEntity();
      asteroid.add( new Asteroid() );
      asteroid.add( new Position(xPos, yPos, 0) );
      asteroid.add( new Collision(radius) );
      asteroid.add( new Display( new AsteroidView(radius) ) );
      
      var velocityX = (Math.random() - 0.5) * 4 * (50 - radius);
      var velocityY = (Math.random() - 0.5) * 4 * (50 - radius);
      var angularVelocity = Math.random() * 2 - 1;
      asteroid.add( new Motion(velocityX, velocityY, angularVelocity, 0) );
      
      _game.addEntity(asteroid);
      return asteroid;
    }

    this.createSpaceship = function() {
      var keyLeft = 37; var keyRight = 39; var keyUp = 38;

      var spaceship = new ashEntity();
      spaceship.add( new Spaceship() );
      spaceship.add( new Position(_config.width * 0.5, _config.height * 0.5, 0) );
      spaceship.add( new Motion(0, 0, 0, 15) );
      spaceship.add( new MotionControls(keyLeft, keyRight, keyUp, 100, 3) );
      spaceship.add( new Collision(9) );
      spaceship.add( new Display( new SpaceshipView() ) );
      // skipped gun & gunControls component
      // skipped state machine for the 'death state'

      _game.addEntity(spaceship);
      return spaceship;
    }
  }
  return EntityCreator;
});