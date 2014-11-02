define(function() {
	// Prototype class for user defined systems.
	function System() { 
	  this.priority = 0;

	  this.setup = function(game) { }
	  this.detach = function(game) { }
	  this.update = function(time) { }
	}
	return System;
});