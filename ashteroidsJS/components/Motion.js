define(["easel"], function() {
	function Motion(velocityX, velocityY, angularVelocity, damping) {
	  this.velocity = new createjs.Point(velocityX, velocityY);
	  this.angularVelocity = angularVelocity;
	  this.damping = damping;
	}
	return Motion;
});