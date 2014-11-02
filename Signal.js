//
// ash/Signal
// Simple callback based notification object. Subscriber functions are called when the signal's dispatch method is called.
//

define(function() {

  function Signal() {

    // Private Properties
    
    var _subscribers = new Array();

    // Public Methods

    // addSubscriber(function func)
    // Adds func to the subscriber list called when this signal is dispatched.
    this.addSubscriber = function(func) {
      _subscribers.push(func);
    }

    // removeSubscriber(function func)
    // If func was previously subscribed to this signal, removes it from the subscriber
    // list. Otherwise does nothing.
    this.removeSubscriber = function(func) {
      var index = _subscribers.indexOf(func);
      if( index != -1 ) {
        _subscribers.splice(index, 1);
      }
    }

    // dispatch(...)
    // Calls all functions subscribed to this signal. Any arguments passed to dispatch
    // will be passed on in subscriber functions calls.
    this.dispatch = function() {
      for( var i in _subscribers ) {
        _subscribers[i].apply(this, arguments);
      }
    }
  
  }

  return Signal;
});