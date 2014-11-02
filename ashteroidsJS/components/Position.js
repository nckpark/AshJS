define(["easel"], function() {
	function Position(x, y, rotation) {
	  this.position = new createjs.Point(x, y);
	  this.rotation = rotation;
	}
	return Position;
});