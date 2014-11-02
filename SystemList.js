//
// ash/SystemList
// An ordered list of ash systems sorted by system execution priority.
//

define(function() {
  
  function SystemList() {
  
    // Private Properties
  
    var _list = new Array();

    // Public Methods
  
    // add(System system)
    // Adds new system to the list in priority order.
    this.add = function(system) {
      for( var i in _list ) {
        if( _list[i].priority > system.priority ) {
          _list.splice(i, 0, system);
          return;
        }
      }
      _list.push(system);
    }
    
    // remove(System system)
    // Removes previously added system from the list. If system is not on the list, does nothing.
    this.remove = function(system) {
      var index = _list.indexOf(system);
      if( index != -1 ) {
        _list.splice(index, 1);
      }
    }

    // removeAll()
    // Removes all systems from the list
    this.removeAll = function() {
      _list = [];
    }

    // contains(System system)
    // Returns true / false indicating whether or not the passed system is present in the list.
    this.contains = function(system) {
      return _list.indexOf(system) != -1;
    }

    // get(System Object.constructor type)
    // Returns first system of the passed type on the list. 
    // If no system of passed type is found, returns undefined.
    this.get = function(type) {
      for( var i in _list ) {
        if( _list[i] instanceof type ) {
          return _list[i];
        }
      }
      return undefined;
    }

    // at(index)
    // Returns system at the specified index in the list. 
    // Returns undefined if index is out of bounds.
    this.at = function(index) {
      return _list[index];
    }

    // length()
    // Returns the number of systems on the list
    this.length = function() {
      return _list.length;
    }
  }
  
  return SystemList;
});