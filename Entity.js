//
// ash/Entity
// An entity is a collection of components - simple data structures storing related properties - representing
// an object or concept used in the game.
//

define(["ash/Signal"], function(ashSignal) {
  
  function Entity() {
  
    // Public Properties

    this.name = new String();
    this.id;

    // Private Properties 
  
    var _components = new Object();
    var _signals = {
      componentAdded: new ashSignal(),
      componentRemoved: new ashSignal()
    };

    // Public Methods
  
    // add(Object component)
    // Adds a new component to the entity. If the entity already has a component of the added 
    // type, it will be replaced. Triggers the entity's 'componentAdded' signal.
    this.add = function(component) {
      var componentType = component.constructor;
      
      if( typeof _components[componentType] !== "undefined" ) {
        this.remove(componentType);
      }

      _components[componentType] = component;
      _signals.componentAdded.dispatch(this, componentType);
      return this;
    }

    // remove(Object Constructor componentType)
    // Removes component of the passed type. Triggers entity's 'componentRemoved' signal. 
    // If no matching component is found, results in a no-op. 
    this.remove = function(componentType) {
      var component = _components[componentType];
      if( typeof component !== "undefined" ) {
        delete _components[componentType];
        _signals.componentRemoved.dispatch(this, componentType);
        return component;
      }
    }

    // has(Object Constructor componentType)
    // Returns true / false indicating whether entity contains a component of type componentType 
    this.has = function(componentType) {
      return typeof _components[componentType] !== "undefined";
    }

    // get(Object Constructor componentType)
    // Returns entity's componentType component, or undefined if entity has no components of that type.
    this.get = function(componentType) {
      return _components[componentType];
    }

    // getAll()
    // Returns an array including all of this entity's components
    this.getAll = function() {
      var componentArray = new Array();
      for( var type in _components ) {
        componentArray.push(_components[type]);
      }
      return componentArray;
    }

    // clone()
    // Returns a new entity with the same components and component values as this entity. Clone performs a deep 
    // copy - all component objects are new, not references. Does not copy entity name, id, or subscribers. 
    this.clone = function() {
      var copy = new Entity();
      for( var componentType in _components ) {
        var originalComponent = _components[componentType];
        var newComponent = new originalComponent.constructor;
        for( var property in originalComponent ) {
          newComponent[property] = originalComponent[property];
        }
        copy.add(newComponent);
      }
      return copy;
    }

    // addSubscriber(String signalType, function callback)
    // Adds a subscriber function that will be called every time this entity's signalType signal is triggered.
    // signalType should be one of 'componentAdded' or 'componentRemoved'.
    // Returns true / false to indicate success.
    this.addSubscriber = function(signalType, callback) {
      if( typeof _signals[signalType] === "undefined" ) {
        return false;
      }

      _signals[signalType].addSubscriber(callback);
      return true;
    }

    // removeSubscriber(string signalType, function callback)
    // Removes the previously added subscriber callback from the signalType signal.
    // signalType sshould be one of 'componentAdded' or 'componentRemoved'.
    // Returns true / false to indicate success.
    this.removeSubscriber = function(signalType, callback) {
      if( typeof _signals[signalType] === "undefined" ) {
        return false;
      }

      _signals[signalType].removeSubscriber(callback);
      return true; 
    }
  }

  return Entity;
});