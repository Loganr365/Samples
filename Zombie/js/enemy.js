var app = app || {};

app.enemy = (function(){
	var x = -50;
	var y = -50;
	var SPEED_LEVELS = {
		CRAWL: 1,
		WALK: 2,
		RUN: 3,
		SPRINT: 4
	};
	var ENEMY_SIZES = {
		SMALL: 10,
		MEDIUM: 15,
		LARGE: 20,
		BOSS: 25,
	};
	var size = -1;
	//var difficulty = -1; // int 1=easy 2=normal 3=hard 4=boss
	var DIFFICULTY_VALUES = {
		EASY: 1,
		NORMAL: 2,
		HARD: 3,
		BOSS:4
	};
	var bulletTemplate = undefined;
	var WIDTH = 1240; 
    var HEIGHT = 580;
	var spawnNodeLeft = [-50, HEIGHT/2]; //Vector [X,Y] spawn location of enemy 
	var spawnNodeRight = [WIDTH + 50, HEIGHT/2]; //Vector [X,Y] spawn location of enemy
	var spawnNodeTop = [WIDTH/2, -50]; //Vector [X,Y] spawn location of enemy 	
	var spawnNodeBottom = [WIDTH/2, HEIGHT + 50]; //Vector [X,Y] spawn location of enemy 	
	var NODE_IDS = {
		LEFT: 1,
		RIGHT: 2,
		TOP: 3,
		BOTTOM: 4
	};
	var speed =-1;
	
	function init(canvasWidth, canvasHeight){
	};
	
	function update(playerX, playerY){
		if(speed == -1)return; //break if default
		
		if(x < playerX){
			x = x + speed;
		}
		
		if(x > playerX){
			x = x - speed;
		}
		
		if(y < playerY){
			y = y + speed;
		}
		
		if(y > playerY){
			y = y - speed;
		}
		
		//move towards player
		
	};
	
	function draw(ctx){
		ctx.fillStyle = 'red';
		ctx.fillRect(x, y, size, size);
	};
	
	//=====HELPERS=====
	function generateRandomEnemy(difficulty){
		
		if(difficulty == DIFFICULTY_VALUES.EASY){
			speed = SPEED_LEVELS.CRAWL;
			size = ENEMY_SIZES.SMALL;
		}
		
		if(difficulty == DIFFICULTY_VALUES.MEDIUM){
			speed = SPEED_LEVELS.WALK;
			size = ENEMY_SIZES.MEDIUM;
		}
		
		if(difficulty == DIFFICULTY_VALUES.HARD){
			speed = SPEED_LEVELS.RUN;
			size = ENEMY_SIZES.LARGE;
		}
		
		if(difficulty == DIFFICULTY_VALUES.BOSS){
			speed = SPEED_LEVELS.SPRINT;
			size = ENEMY_SIZES.BOSS;
		}
		
		var randomNode = getRandomInt(1,4);
		
		if(randomNode == NODE_IDS.LEFT){
			x = spawnNodeLeft[0];
			y = spawnNodeLeft[1];
		}
		
		if(randomNode == NODE_IDS.RIGHT){
			x = spawnNodeRight[0];
			y = spawnNodeRight[1];
		}
		
		if(randomNode == NODE_IDS.TOP){
			x = spawnNodeTop[0];
			y = spawnNodeTop[1];
		}
		
		if(randomNode == NODE_IDS.BOTTOM){
			x = spawnNodeBottom[0];
			y = spawnNodeBottom[1];
		}
	};
	
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	//=====END HELPERS=====
	
	function getX(){
		return x;
	};
	
	function getY(){
		return y;
	};
	
	function getSpeed(){
		return speed;
	}
	
	function getSize(){
		return size;
	}
	
	return{
	init: init,
	update: update,
	draw: draw,
	generateRandomEnemy: generateRandomEnemy,
	getX: getX,
	getY: getY,
	getSpeed: getSpeed,
	getSize: getSize,
	};
	
}());