// 
// ash/EntityList
// A basic list implementation for entity objects.
//

define(function() {

  function EntityList() {

    // Private Properties

    var _list = new Array();

    // Public Methods

    // add(Entity entity)
    // Adds the passed entity to the list.
    this.add = function(entity) {
      _list.push(entity);
    }
    
    // remove(Entity entity)
    // Removes the passed entity from the last if it was previously added, otherwise
    // does nothing.
    this.remove = function(entity) {
      var index = _list.indexOf(entity);
      if( index != -1 ) {
        _list.splice(index, 1);
      }
    }

    // removeAll()
    // Removes all entities from the list.
    this.removeAll = function() {
      _list = [];
    }

    // at(int index)
    // Returns the entity at the specified index in the list.
    this.at = function(index) {
      return _list[index];
    }

    // contains(Entity entity)
    // Returns true / false indicating whether or not the passed entity is present in the list.
    this.contains = function(entity) {
      return _list.indexOf(entity) != -1;
    }

    // length()
    // Returns the number of entities in the list.
    this.length = function() {
      return _list.length;
    }
  }

  return EntityList;
});