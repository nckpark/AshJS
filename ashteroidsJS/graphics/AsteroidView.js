(function() {

function AsteroidView(radius) {
  graphics = this.graphics;

  var angle = 0;
  graphics.beginFill( '#FFFFFF' );
  graphics.moveTo( radius, 0 );
  while( angle < Math.PI * 2 )
  {
    var length = ( 0.75 + Math.random() * 0.25 ) * radius;
    var posX = Math.cos( angle ) * length;
    var posY = Math.sin( angle ) * length;
    graphics.lineTo( posX, posY );
    angle += Math.random() * 0.5;
  }
  graphics.lineTo( radius, 0 );
  graphics.endFill();
}
AsteroidView.prototype = new createjs.Shape();


this.AsteroidView = AsteroidView;
}());