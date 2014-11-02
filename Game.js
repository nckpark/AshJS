//
// ash/Game
// . . .
//

define(["ash/EntityList", "ash/SystemList", "ash/Signal", "ash/Family"], function(ashEntityList, ashSystemList, ashSignal, ashFamily) {
  
  function Game() {
  
    // Private Properties 
  
    var _entityList = new ashEntityList();
    var _systemList = new ashSystemList();
    var _families = new Object();
    var _nextId = 0; // Id's are unique to this JS port. Each entity holds a unique id managed by the game object to allow easy lookup operations.

    // Public Methods

    // addEntity(Entity entity)
    // Adds new entity to the game, updates matching node lists to be processed by 
    // game systems, and assigns it an id.
    this.addEntity = function(entity) { 
      entity.id = _nextId;
      _nextId++;

      _entityList.add(entity);
      entity.addSubscriber("componentAdded", _componentAdded);
      entity.addSubscriber("componentRemoved", _componentRemoved);
      for( var type in _families ) {
        _families[type].checkEntityAdd(entity);
      }
    }

    // removeEntity(Entity entity)
    // Removes passed entity and its related nodes from the game and node lists, stopping 
    // relevant systems from operating on it. Sets entity id to undefined.
    this.removeEntity = function(entity) { 
      if(_entityList.contains(entity)) {
        entity.removeSubscriber("componentAdded", _componentAdded);
        entity.removeSubscriber("componentRemoved", _componentRemoved);
        for( var type in _families ) {
          _families[type].checkEntityRemove(entity, "remove");
        }
        _entityList.remove(entity);
        entity.id = undefined;
      }
    }

    // removeAllEntities()
    // Removes all entities from the game.
    this.removeAllEntities = function() {
      while( _entityList.length() ) {
        this.removeEntity(_entityList.at(0));
      }
    }

    // getNodeList(Node.constructor nodeConstructor)
    // Returns NodeList managed by this game with nodes of type nodeConstructor
    // for every entity matching the component defintion of the node type.
    this.getNodeList = function(nodeConstructor) {
      if( nodeConstructor in _families ) {
        return _families[nodeConstructor].getNodeList();
      }
      // implied else
      var family = new ashFamily(nodeConstructor);
      _families[nodeConstructor] = family;
      for( var i = 0; i < _entityList.length(); i++ ) {
        family.checkEntityAdd( _entityList.at(i) );
      }
      return family.getNodeList();
    }

    // addSystem(System system, in priority)
    // Adds a new system to the game with the passed execution priority, and calls its setup method. 
    // System update method will be called on the the next game update.
    this.addSystem = function(system, priority) { 
      system.priority = priority;
      system.setup(this);
      _systemList.add(system);
    }

    // getSystem(System.constructor systemType)
    // Returns first system of type systemType running in this game, or
    // undefined if no system of the passed type is found.
    this.getSystem = function(systemType) { 
      return _systemList.get(systemType);
    }

    // removeSystem(system)
    // Removes the passed system from the game and calls its detach method.
    this.removeSystem = function(system) { 
      if(_systemList.contains(system)) {
        _systemList.remove(system);
        system.detach(this);
      }
    }

    // removeAllSystems()
    // Removes all systems from the game.
    this.removeAllSystems = function() { 
      while( _systemList.length() ) {
        this.removeSystem(_systemList.at(0));
      }
    }
    
    // update(int timeMs)
    // Calls the update method of all systems added to the game in priority order, passing
    // the timeMs counter as an argument.
    this.update = function(timeMs) { 
      for( var i = 0; i < _systemList.length(); i++ ) {
        _systemList.at(i).update(timeMs);
      }
    }

    // Private Methods

    // Check entity with new component for inclusion of any of the node families
    var _componentAdded = function(entity, componentType) {  
      for( var type in _families ) {
        _families[type].checkNewComponent(entity, componentType);
      }
    }

    // Check entity with removed component for removal from any of the node lists
    var _componentRemoved = function(entity, componentType) { 
      for( var type in _families ) {
        _families[type].checkRemovedComponent(entity, componentType);
      }
    } 

  }

  return Game;
});