requirejs.config({
    baseUrl: './',
    shim: {
        easel: {
            exports: 'createjs'
        }
    },
    paths: {
        easel: 'http://code.createjs.com/easeljs-0.5.0.min',
        ash: './../',
        components: './components',
        views: './graphics',
        nodes: './nodes',
        systems: './systems'
    }
});

// Start the main app logic.
requirejs(['ash/Game', "EntityCreator", "GameConfig", "systems/SystemPriorities", "systems/GameManager", "systems/MotionControlSystem", "systems/MovementSystem", "systems/CollisionSystem", "systems/RenderSystem", "easel"], 
function(ashGame, EntityCreator, GameConfig, SystemPriorities, GameManager, MotionControlSystem, MovementSystem, CollisionSystem, RenderSystem) {
    var canvas = document.getElementById("gameCanvas");

    var game = new ashGame();
    var config = new GameConfig();
    config.width = 600;
    config.height = 600;
    var creator = new EntityCreator( game, config );

    game.addSystem( new GameManager( creator, config ), SystemPriorities.preUpdate );
    game.addSystem( new MotionControlSystem(), SystemPriorities.update );
    // <!> Skipped gunControl, bulletAge, and deathThroes systems </!>
    game.addSystem( new MovementSystem( config ), SystemPriorities.move );
    game.addSystem( new CollisionSystem( creator ), SystemPriorities.resolveCollisions );
    // game.addSystem( new AnimationSystem(), SystemPriorities.animate );
    game.addSystem( new RenderSystem( canvas ), SystemPriorities.render );

    creator.createGame();

    // Start Ticker
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addListener(game.update);
});
