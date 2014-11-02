//
// ash/Family
// Manages like entities and their common node list, creating or destroying nodes based on entities checked against it.
// A node is a specific collection of components, defined in the nodeClass passed to the Family constructor, that should be
// operated on by an ash System when all present on the same entity. Systems interact with nodes, not entities.
//

define(["ash/Node", "ash/NodeList"], function(ashNode, ashNodeList) {

  function Family(nodeClass) {

    // Private Properties

    var _nodes = new ashNodeList();
    var _entityNodeMap = Object.create(null);
    var _components = Object.create(null);
    var _nodeClass = nodeClass;

    // Set up dummy node to establish components list
    var _dummyNode = new _nodeClass();
    for( var componentName in _dummyNode ) {
      _components[ _dummyNode[componentName].constructor ] = componentName;
    }

    // Public Functions

    // getNodeList()
    // Returns the NodeList managed by this family
    this.getNodeList = function() {
      return _nodes;
    }

    // checkEntityAdd(Entity entity)
    // Checks if the passed entity contains all components defining this family. If yes, 
    // creates a new node for the entity and adds it to the family's node list.
    this.checkEntityAdd = function(entity) { 
      return _addIfMatch(entity);
    }

    // checkEntityRemove(Entity entity)
    // Checks if the passed entity has a node managed by this family, destroying and removing it 
    // if it does, even if the entity still matches the component definition of this family.
    this.checkEntityRemove = function(entity) {
      return _removeIfMatch(entity);
    }

    // checkNewComponent(Entity entity, Object.constructor componentType)
    // Checks if a new component type already added to entity qualifies it for inclusion. If yes, creates a 
    // new node for the entity and adds it to the family's node list.
    this.checkNewComponent = function(entity, componentType) {
      if(!(componentType in _components)) {
        return false;
      }
      return _addIfMatch(entity);
    }

    // checkRemovedComponent(Entity entity, Object.constructor componentType)
    // Checks if completed removal of a component type from entity means the entity is no longer qualified
    // for inclusion. If it should be removed, destroys and removes this entity's nodes from its nodeList.
    this.checkRemovedComponent = function(entity, componentType) { 
      if(!(componentType in _components)) {
        return false;
      }
      return _removeIfMatch(entity);
    }

    // cleanUp()
    // Removes all node and entity data from the family, resetting it to an empty state
    this.cleanUp = function() {
      for( var i = 0; i < _nodes.length(); i++ ) {
        delete _entityNodeMap[ _nodes.at(i).entity.id ];
        // the garbage collector would accomplish the same with a simple re-init
        // of the entityNodeMap, but hey... this is proactive
      }

      _nodes.removeAll();
    }

    // Private Functions
    
    var _addIfMatch = function(entity) {
      if( entity.id in _entityNodeMap ) {
        return true; // Entity has already been added. Report success.
      }

      for( var componentType in _components ) {
        if( !entity.has(componentType) ) {
          return false; // Entity does not match the component definition.
        }
      }

      // Entity is new and its components match the node
      var node = new ashNode();
      node.entity = entity;
      for( var componentType in _components ) {
        node[ _components[componentType] ] = entity.get(componentType);
      }
      _entityNodeMap[entity.id] = node;
      _nodes.add(node);
      return true;
    }

    var _removeIfMatch = function(entity) {
      if(!(entity.id in _entityNodeMap)) {
        return false; // Nothing to remove
      }

      var node = _entityNodeMap[entity.id];
      delete _entityNodeMap[entity.id];
      _nodes.remove(node);
      return true;
    }
  }
  
  return Family;
});