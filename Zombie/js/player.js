var app = app || {};

app.player = (function(){
	var x = 620;
	var y = 290;
	var SPEED = 5;
	var PLAYER_SIZE = 20;
	var direction = 0;
	var bulletTemplate = undefined;
	var WIDTH;
	var HEIGHT;
	var lastTime = 0;
	var spriteChangeTimmer = 0;
	var DIRECTION_STATES = {
		UP:0,
		DOWN:1,
		Left:2,
		RIGHT:3,
		DIAG_UP_LEFT: 4,
		DIAG_UP_RIGHT: 5,
		DIAG_DOWN_LEFT: 6,
		DIAG_DOWN_RIGHT: 7
	};
	var SPRITE_FRAMES = {
		IDLE_FRAME: [14, 20, 15, 20], //xMin, xWidth, yMin, yHeight
		STEP_ONE_FRAME: [64, 20, 15, 20], 
		STEP_TWO_FRAME: [114, 20, 15, 20], 
	};
	var spriteIndex = 1;
	function init(bulletTemp, canvasWidth, canvasHeight){
		bulletTemplate = bulletTemp;
		WIDTH = canvasWidth;
		HEIGHT = canvasHeight;
	};
	
	//==========MAINS==========
	function update(){
		processesPlayerInput();
		checkForDiag();
		pushBackToScreen();
	};
	
	function draw(ctx, canvasWidth, canvasHeight, spriteToDraw){
		//ctx.fillStyle = 'blue';
		//ctx.fillRect(x, y, PLAYER_SIZE, PLAYER_SIZE);
		ctx.save();
		ctx.translate(x, y);
		
		if(direction == DIRECTION_STATES.DIAG_UP_RIGHT){
			ctx.rotate(45*Math.PI/180);
		}
		else if(direction == DIRECTION_STATES.RIGHT){
			ctx.rotate(90*Math.PI/180);
		}
		else if(direction == DIRECTION_STATES.DIAG_DOWN_RIGHT){
			ctx.rotate(135*Math.PI/180);
		}
		else if(direction == DIRECTION_STATES.DOWN){
			ctx.rotate(180*Math.PI/180);
		}
		else if(direction == DIRECTION_STATES.DIAG_DOWN_LEFT){
			ctx.rotate(225*Math.PI/180);
		}
		else if(direction == DIRECTION_STATES.LEFT){
			ctx.rotate(270*Math.PI/180);
		}
		else if(direction == DIRECTION_STATES.DIAG_UP_LEFT){
			ctx.rotate(315*Math.PI/180);
		}
		
		if(spriteIndex ==1){
			ctx.drawImage(spriteToDraw,SPRITE_FRAMES.IDLE_FRAME[0], SPRITE_FRAMES.IDLE_FRAME[2], SPRITE_FRAMES.IDLE_FRAME[1], SPRITE_FRAMES.IDLE_FRAME[3], 0, 0, 20, 20);
			if(spriteChangeTimmer > 8){
				spriteIndex = 2;
				spriteChangeTimmer = 0;
			}
		}
		else if(spriteIndex ==2){
			ctx.drawImage(spriteToDraw,SPRITE_FRAMES.STEP_ONE_FRAME[0], SPRITE_FRAMES.STEP_ONE_FRAME[2], SPRITE_FRAMES.STEP_ONE_FRAME[1], SPRITE_FRAMES.STEP_ONE_FRAME[3], 0, 0, 20, 20);
			if(spriteChangeTimmer > 8){
				spriteIndex = 3;
				spriteChangeTimmer = 0;
			}
		}
		else if(spriteIndex ==3){
			ctx.drawImage(spriteToDraw,SPRITE_FRAMES.STEP_TWO_FRAME[0], SPRITE_FRAMES.STEP_TWO_FRAME[2], SPRITE_FRAMES.STEP_TWO_FRAME[1], SPRITE_FRAMES.STEP_TWO_FRAME[3], 0, 0, 20, 20);
			if(spriteChangeTimmer > 8){
				spriteIndex = 1;
				spriteChangeTimmer = 0;
			}
		}
		
		ctx.restore();
		spriteChangeTimmer++;
	};
	
	// ==========HELPERS==========
	
	function pushAwayFromEnemy(){};
	
	function pushAwayFromWall(){};
	
	//if the player is off the screen, push them back onto the screen at their current rate of speed.  This should give the appearnce of coming to a stop and hitting a wall
	function pushBackToScreen(){
		if(x < 0){x = x + SPEED;}
		if(x > WIDTH - PLAYER_SIZE){x = x - SPEED;}
		if(y < 0){y = y + SPEED;}
		if(y > HEIGHT - PLAYER_SIZE){y = y - SPEED;}
	};
	
	function processesPlayerInput(){
		
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_W])
		{
			y = y - SPEED;
			direction = DIRECTION_STATES.UP;
		}
		
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_S])
		{
			y = y + SPEED;
			direction = DIRECTION_STATES.DOWN;
		}
		
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_A])
		{
			x = x - SPEED;
			direction = DIRECTION_STATES.LEFT;
		}
		
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_D])
		{
			x = x + SPEED;
			direction = DIRECTION_STATES.RIGHT;
		}
		
		/*if(myKeys.keydown[myKeys.KEYBOARD.SPACE])
		{
			//fire bullet
			var tempBullet = bulletTemplate;
			tempBullet.x = x;
			tempBullet.y = y;
			tempBullet.direction = direction;
			bullets.push(tempBullet);
		}*/
	};
	
	function checkForDiag(){
		
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_W] && myKeys.keydown[myKeys.KEYBOARD.KEY_A]){
			direction = DIRECTION_STATES.DIAG_UP_LEFT;
			return;
		}
		
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_W] && myKeys.keydown[myKeys.KEYBOARD.KEY_D]){
			direction = DIRECTION_STATES.DIAG_UP_RIGHT;
			return;
		}
		
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_S] && myKeys.keydown[myKeys.KEYBOARD.KEY_A]){
			direction = DIRECTION_STATES.DIAG_DOWN_LEFT;
			return;
		}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_S] && myKeys.keydown[myKeys.KEYBOARD.KEY_D]){
			direction = DIRECTION_STATES.DIAG_DOWN_RIGHT;
			return;
		}
	};
	
	function getX(){
		return x;
	};
	
	function getY(){
		return y;
	};
	
	function getDirection(){
		return direction;
	};
	
	function getSize(){
		return PLAYER_SIZE;
	};
	
	function setX(val){
		x = val;
	};
	
	function setY(val){
		y = val;
	};
	
	return{
	init: init,
	update: update,
	draw: draw,
	processesPlayerInput: processesPlayerInput,
	checkForDiag: checkForDiag,
	getX: getX,
	getY: getY,
	getDirection: getDirection,
	getSize: getSize,
	setX: setX,
	setY, setY,
	};
	
}());