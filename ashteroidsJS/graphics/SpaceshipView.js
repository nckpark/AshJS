define(["easel"], function() {
	function SpaceshipView() {
	  graphics = this.graphics;

	  graphics.beginFill( "#FFFFFF" );
	  graphics.moveTo( 10, 0 );
	  graphics.lineTo( -7, 7 );
	  graphics.lineTo( -4, 0 );
	  graphics.lineTo( -7, -7 );
	  graphics.lineTo( 10, 0 );
	  graphics.endFill();
	}
	SpaceshipView.prototype = new createjs.Shape();
	return SpaceshipView;
});