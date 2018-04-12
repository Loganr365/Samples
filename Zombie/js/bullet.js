var app = app || {};

app.bullet = (function(){
	var x = -1;
	var y = -1;
	var SPEED = 5;
	var PLAYER_SIZE = 20;
	var direction = 0;
	var radius = 5;
	
	var DIRECTION_STATES = {
		UP:0,
		DOWN:1,
		Left:2,
		RIGHT:3,
		DIAG_UP_LEFT: 4,
		DIAG_UP_RIGHT: 5,
		DIAG_DOWN_LEFT: 6,
		DIAG_DOWN_RIGHT: 7,
	};
	
	function init(){
		return;
	};
	
	function update(){
		if (direction == DIRECTION_STATES.UP){
			y = y - SPEED;
		}
		else if(direction == DIRECTION_STATES.DOWN){
			y = y + SPEED;
		}
		else if(direction == DIRECTION_STATES.LEFT){
			x = x - SPEED;
		}
		else if(direction == DIRECTION_STATES.RIGHT){
			x = x + SPEED;
		}
		else if(direction == DIRECTION_STATES.DIAG_UP_LEFT){
			y = y - SPEED;
			x = x - SPEED;
		}
		else if(direction == DIRECTION_STATES.DIAG_UP_RIGHT){
			y = y - SPEED;
			x = x + SPEED;
		}
		else if(direction == DIRECTION_STATES.DIAG_DOWN_LEFT){
			y = y + SPEED;
			x = x - SPEED;
		}
		else if(directon == DIRECTION_STATES.DIAG_DOWN_RIGHT){
			y = y + SPEED;
			x = x + SPEED;
		}
	};
	
	function draw(ctx, canvasWidth, canvasHeight){
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.fillStyle = 'yellow';
			ctx.fill();
	};
	
	return{
	init: init,
	update: update,
	draw: draw,
	};
	
}());