//
// ash/NodeList
// A list of nodes. Reports changes to the list through the nodeAdded and nodeRemoved signals.
//

define(["ash/Signal"], function(ashSignal) {
  
  function NodeList() {
  
    // Private Properties
  
    var _list = new Array();
    var _signals = {
      nodeAdded: new ashSignal(),
      nodeRemoved: new ashSignal()
    };

    // Public Functions
  
    // add(Node node)
    // Adds a node to the list. Triggers the nodeAdded signal.
    this.add = function(node) {
      _list.push(node);
      _signals['nodeAdded'].dispatch(node);
    }
    
    // remove(Node node)
    // Removes the passed node if it is on the list, and triggers the nodeRemoved signal.
    // Does nothing if the passed node is not on the list.
    this.remove = function(node) {
      var index = _list.indexOf(node);
      if( index != -1 ) {
        _list.splice(index, 1);
        _signals['nodeRemoved'].dispatch(node);
      }
    }

    // removeAll()
    // Removes all nodes from the list, triggering the nodeRemoved signal for each removed node.
    this.removeAll = function() {
      while( _list.length ) {
        var node = _list[0];
        this.remove(node);
        _signals['nodeRemoved'].dispatch(node);
      }
    }

    // at(int index)
    // Returns the node at the specified index in the list.
    this.at = function(index) {
      return _list[index];
    }

    // contains(Node node)
    // Returns true / false indicating whether the passed node is in this list.
    this.contains = function(node) {
      return _list.indexOf(node) != -1;
    }

    // length()
    // Returns the number of nodes on this list.
    this.length = function() {
      return _list.length;
    }

    // empty()
    // Returns true / false indiciating whether this list is empty - has zero elements.
    this.empty = function() {
      return _list.length == 0;
    }

    // addSubscriber(String SignalType, function callback)
    // Adds a subscriber function that will be called and passed the relevant node every time this 
    // NodeList's signalType signal is triggered. signalType should be one of 'nodeAdded' or 'nodeRemoved'. 
    // Returns true / false to indicate success.
     this.addSubscriber = function(signalType, callback) {
      if(!(signalType in _signals)) {
        return false;
      }

      _signals[signalType].addSubscriber(callback);
      return true;
    }

    // removeSubscriber(String signalType, function callback)
    // Removes the previously added subscriber callback from the signalType signal.
    // signalType should be one of 'nodeAdded' or 'nodeRemoved'.
    // Returns true / false to indicate success.
    this.removeSubscriber = function(signalType, callback) {
      if(!(signalType in _signals)) {
        return false;
      }

      _signals[signalType].removeSubscriber(callback);
      return true; 
    }
  }

  return NodeList;
});