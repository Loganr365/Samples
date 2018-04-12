var app = app || {};

app.main = {
	
	WIDTH:1240,
	HEIGHT: 580,
	canvas: undefined,
    ctx: undefined,
   	lastTime: 0, // used by calculateDeltaTime() 
    debug: true,
	player: undefined,
	enemy: undefined,
	enemies:[],
	bullet: undefined,
	bullets: [],
	BULLET_COOLDOWN: 10,
	bulletTimmer: 0,
	BULLET_SPEED: 7.5,
    DIRECTION_STATES: {
		UP:0,
		DOWN:1,
		Left:2,
		RIGHT:3,
		DIAG_UP_LEFT: 4,
		DIAG_UP_RIGHT: 5,
		DIAG_DOWN_LEFT: 6,
		DIAG_DOWN_RIGHT: 7,
	},
	easyTimer: 0,
	normalTimer: 0,
	hardTimer: 0,
	bossTimer: 0,
	gameState: 0,
	GAME_STATES:{
		MENU: 0,
		PLAYING: 1,
		GAME_OVER: 2,
		INSTURCTIONS: 3,
		PAUSED: 4,
	},
	lastGameState: -1,
	easyTimerOffset: 0,
	normalTimerOffset: 0,
	hardTimerOffset: 0,
	bossTimerOffset: 0,
	score: 0,
	playerSpriteSheet: undefined,
	enemySprite: undefined,
	background: undefined,
	bgAudio: undefined,
	killSound: undefined,
	sound: undefined,
	loseTimer: 0,
	
	init : function() {
		console.log("app.main.init() called");
		
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		this.playerSpriteSheet = document.querySelector('#playerSpriteSheet');
		this.enemySprite = document.querySelector('#enemyImage');
		this.background = document.querySelector('#backgroundImage');
		this.bgAudio = document.querySelector("#bgAudio");
		this.bgAudio.volume=0.25;
		this.bgAudio.play();
		this.killSound = document.querySelector("#killSound");
		this.killSound.volume=0.25;
		this.update();
	},
	
	
	update: function(){
		this.animationID = requestAnimationFrame(this.update.bind(this));
		this.ctx.clearRect(0,0, this.WIDTH, this.HEIGHT);
		this.drawBackround();
		
		if(this.gameState == this.GAME_STATES.PLAYING){
			//update game objects
			this.player.update();
			this.enemy.update();
			//loop through and update enemies
			for(var i = 0; i < this.enemies.length; i++){
				if(this.enemies.length == 0)break;
				this.updateEnemy(this.enemies[i], i);
			}
			//loop through and update bullets
			for(var i = 0; i < this.bullets.length; i++){
				if(this.bullets.length == 0)break;
				this.updateBullet(this.bullets[i]);
				if(this.bullets[i].x < 0 || this.bullets[i].y < 0 || this.bullets[i].x > this.WIDTH || this.bullets[i].y > this.HEIGHT){
				this.bullets.splice(i,1);
				}
			}
			//run scripts
			this.playerFireBullet();
			this.addEnemy();
			
			
			//draw game objects
			this.player.draw(this.ctx, this.WIDTH, this.HEIGHT, playerSpriteSheet, 1);
			//loop through and draw enemies
			for(var i = 0; i < this.enemies.length; i++){
				if(this.enemies.length == 0)break;
				this.drawEnemy(this.enemies[i]);
			}
			//loop through and draw bullets
			for(var i = 0; i < this.bullets.length; i++){
				if(this.bullets.length == 0)break;
				this.drawBullet(this.bullets[i]);
			}
		}
		
		//draw HUD
		this.drawHUD();
	},
	
	resetGame: function(){
		this.player.setX(620);
		this.player.setY(290);
		
		this.enemies.splice(0, this.enemies.length);
		this.bullets.splice(0, this.bullets.length);
		this.score = 0;
		this.easyTimerOffset = 0;
		this.normalTimerOffset = 0;
		this.hardTimerOffset = 0;
		this.bossTimerOffset = 0;
	},
	
	drawBackround: function(){
		this.ctx.drawImage(this.background, 0, 0, this.WIDTH, this.HEIGHT);
	},
	
	drawHUD: function(){
		if(this.gameState == this.GAME_STATES.MENU){
				this.fillText(this.ctx,"Survive the hoard of zombies", this.WIDTH/2 - 200, this.HEIGHT/2, "20pt courier", "white");
				this.fillText(this.ctx,"Move with WASD",this.WIDTH/2 - 200, this.HEIGHT/2 + 20, "20pt courier", "white");
				this.fillText(this.ctx,"Shoot with SPACE",this.WIDTH/2 - 200, this.HEIGHT/2 + 40, "20pt courier", "white");
				this.ctx.fillStyle = "white";
				this.ctx.fillRect(this.WIDTH/2 - 200, this.HEIGHT/2 + 55, 600, 50);
				this.fillText(this.ctx,"Click here, or press SPACE to begin",this.WIDTH/2 - 180, this.HEIGHT/2 + 80, "20pt courier", "black");
				if(myKeys.keydown[myKeys.KEYBOARD.KEY_SPACE]){this.gameState = this.GAME_STATES.PLAYING;}
		}
		
		if(this.gameState == this.GAME_STATES.PLAYING){
			this.fillText(this.ctx,"Total Score: " + this.score, this.WIDTH - 250, 20, "16pt courier", "black");
			if(myKeys.keydown[myKeys.KEYBOARD.KEY_P]){this.pauseGame};
		}
		
		if(this.gameState == this.GAME_STATES.GAME_OVER){
			loseTimer ++;
			this.fillText(this.ctx,"Game Over", this.WIDTH/2 - 200, this.HEIGHT/2, "20pt courier", "red");
			this.fillText(this.ctx,"Your final score was " + this.score, this.WIDTH/2 - 200, this.HEIGHT/2 + 20, "20pt courier", "white");
			this.ctx.fillStyle = "white";
			this.ctx.fillRect(this.WIDTH/2 - 200, this.HEIGHT/2 + 55, 600, 50);
			this.fillText(this.ctx,"Click here, or press SPACE to play again",this.WIDTH/2 - 180, this.HEIGHT/2 + 80, "18pt courier", "black");
			if(myKeys.keydown[myKeys.KEYBOARD.KEY_SPACE] && this.loseTimer > 10){
				this.loseTimer = 0;
				this.resetGame();
				this.gameState = this.GAME_STATES.PLAYING;}
		}
		
		if(this.gameState == this.GAME_STATES.PAUSED){
			this.fillText(this.ctx,"Paused, press P to resume", this.WIDTH/2 - 200, this.HEIGHT/2, "20pt courier", "white");
			if(myKeys.keydown[myKeys.KEYBOARD.KEY_P]){this.gameState = this.GAME_STATES.PLAYING};
		}
	},
	
	pauseGame: function(){
		this.lastGameState = this.gameState;
		this.gameState = this.GAME_STATES.PAUSED;
	},
	
	calculateDeltaTime: function(){
		var now,fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
	
	fillText: function(ctx, string, x, y, css, color) {
		this.ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
	
	drawEnemy: function(enemyToDraw){
		//this.ctx.fillStyle = 'red';
		//this.ctx.fillRect(enemyToDraw.x, enemyToDraw.y, enemyToDraw.size, enemyToDraw.size);
		this.ctx.save();
		this.ctx.drawImage(enemyImage,14, 19, 20, 20, enemyToDraw.x, enemyToDraw.y, enemyToDraw.size *2, enemyToDraw.size * 2);
	},
	
	updateEnemy: function(enemyToUpdate, index){
		if(enemyToUpdate.x < this.player.getX()){
			enemyToUpdate.x = enemyToUpdate.x + enemyToUpdate.speed;
		}
		
		if(enemyToUpdate.x > this.player.getX()){
			enemyToUpdate.x = enemyToUpdate.x - enemyToUpdate.speed;
		}
		
		if(enemyToUpdate.y < this.player.getY()){
			enemyToUpdate.y = enemyToUpdate.y + enemyToUpdate.speed;
		}
		
		if(enemyToUpdate.y > this.player.getY()){
			enemyToUpdate.y = enemyToUpdate.y - enemyToUpdate.speed;
		}
		

		//check if collision with bullet
		for(var i = 0; i < this.bullets.length; i++){
			if(this.bullets.length == 0)break;
			
			var distance = 0;
			
			if(enemyToUpdate.x + enemyToUpdate.size/2 > this.bullets[i].x){distance = distance + (enemyToUpdate.x - this.bullets[i].x);}
			if(enemyToUpdate.x + enemyToUpdate.size/2 < this.bullets[i].x){distance = distance + (this.bullets[i].x - enemyToUpdate.x);}
			if(enemyToUpdate.y + enemyToUpdate.size/2 > this.bullets[i].y){distance = distance + (enemyToUpdate.y - this.bullets[i].y);}
			if(enemyToUpdate.y + enemyToUpdate.size/2 < this.bullets[i].y){distance = distance + (this.bullets[i].y -enemyToUpdate.y);}
			
			if(distance < enemyToUpdate.size + this.bullets[i].radius){
				this.enemies.splice(index,1);
				this.bullets.splice(i, 1);
				this.killSound.pause();
				this.killSound.currentTime = 0;
				this.killSound.play();
				this.score = this.score + 10;
			}
		}
		
		//check if collision with player
		var distance = 0; 
		if(enemyToUpdate.x + enemyToUpdate.size/2 > this.player.getX() + this.player.getSize()/2){distance = distance + (enemyToUpdate.x - this.player.getX());}
		if(enemyToUpdate.x + enemyToUpdate.size/2 < this.player.getX() + this.player.getSize()/2){distance = distance + (this.player.getX() - enemyToUpdate.x);}
		if(enemyToUpdate.y + enemyToUpdate.size/2 > this.player.getY() + this.player.getSize()/2){distance = distance + (enemyToUpdate.y - this.player.getY());}
		if(enemyToUpdate.y + enemyToUpdate.size/2 < this.player.getY() + this.player.getSize()/2){distance = distance + (this.player.getY() -enemyToUpdate.y);}
		
		if(distance < enemyToUpdate.size/2 + this.player.getSize()/2){
			this.gameState = this.GAME_STATES.GAME_OVER;
		}
	},
	
	addEnemy: function(){
		if(this.easyTimer > 100 - this.easyTimerOffset){
			this.easyTimer = 0;
			this.enemy.generateRandomEnemy(1);
			var tempEnemy = {};
			tempEnemy.x = this.enemy.getX();
			tempEnemy.y = this.enemy.getY();
			tempEnemy.size = this.enemy.getSize();
			tempEnemy.speed = this.enemy.getSpeed();
			
			this.enemies.push(tempEnemy);
			this.easyTimerOffset = this.easyTimerOffset + 1;
			if(this.easyTimerOffset > 90) {this.easyTimerOffset = 90;}
		}
		
		if(this.normalTimer > 200 - this.normalTimerOffset){
			this.normalTimer = 0;
			this.enemy.generateRandomEnemy(2);
			var tempEnemy = {};
			tempEnemy.x = this.enemy.getX();
			tempEnemy.y = this.enemy.getY();
			tempEnemy.size = this.enemy.getSize();
			tempEnemy.speed = this.enemy.getSpeed();
			this.enemies.push(tempEnemy);
			
			this.normalTimerOffset = this.normalTimerOffset +2;
			if(this.normalTimerOffset > 180) {this.normalTimerOffset = 180;}
		}
		
		if(this.hardTimer > 300 - this.hardTimerOffset){
			this.hardTimer = 0;
			this.enemy.generateRandomEnemy(3);
			var tempEnemy = {};
			tempEnemy.x = this.enemy.getX();
			tempEnemy.y = this.enemy.getY();
			tempEnemy.size = this.enemy.getSize();
			tempEnemy.speed = this.enemy.getSpeed();
			this.enemies.push(tempEnemy);
			
			this.hardTimerOffset = this.hardTimerOffset + 3;
			if(this.hardTimerOffset > 270) {this.hardTimerOffset = 270;}
		}
		
		if(this.bossTimer > 400 - this.bossTimerOffset){
			this.bossTimer = 0;
			this.enemy.generateRandomEnemy(4);
			var tempEnemy = {};
			tempEnemy.x = this.enemy.getX();
			tempEnemy.y = this.enemy.getY();
			tempEnemy.size = this.enemy.getSize();
			tempEnemy.speed = this.enemy.getSpeed();
			this.enemies.push(tempEnemy);
			
			this.bossTimerOffset = this.bossTimerOffset + 4;
			if(this.bossTimerOffset > 360) {this.bossTimerOffset = 360;}
		}
			
		this.easyTimer = this.easyTimer + 1;
		this.normalTimer = this.normalTimer + 1;
		this.hardTimer = this.hardTimer + 1;
		this.bossTimer = this.bossTimer + 1;
	},
	
	playerFireBullet: function(){
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_SPACE] && this.bulletTimmer > this.BULLET_COOLDOWN){
			var tempBullet = {};
			tempBullet.x = this.player.getX() + this.player.getSize()/2;
			tempBullet.y = this.player.getY() + this.player.getSize()/2;
			tempBullet.direction = this.player.getDirection();
			tempBullet.radius = 5;
			this.bullets.push(tempBullet);
			this.bulletTimmer = 0;
			
		}
		this.bulletTimmer = this.bulletTimmer + 1;
	},
	
	updateBullet(bullet){
		if (bullet.direction == this.DIRECTION_STATES.UP){
			bullet.y = bullet.y - this.BULLET_SPEED;
		}
		else if(bullet.direction == this.DIRECTION_STATES.DOWN){
			bullet.y = bullet.y + this.BULLET_SPEED;
		}
		else if(bullet.direction == this.DIRECTION_STATES.LEFT){
			bullet.x = bullet.x - this.BULLET_SPEED;
		}
		else if(bullet.direction == this.DIRECTION_STATES.RIGHT){
			bullet.x = bullet.x + this.BULLET_SPEED;
		}
		else if(bullet.direction == this.DIRECTION_STATES.DIAG_UP_LEFT){
			bullet.y = bullet.y - this.BULLET_SPEED;
			bullet.x = bullet.x - this.BULLET_SPEED;
		}
		else if(bullet.direction == this.DIRECTION_STATES.DIAG_UP_RIGHT){
			bullet.y = bullet.y - this.BULLET_SPEED;
			bullet.x = bullet.x + this.BULLET_SPEED;
		}
		else if(bullet.direction == this.DIRECTION_STATES.DIAG_DOWN_LEFT){
			bullet.y = bullet.y + this.BULLET_SPEED;
			bullet.x = bullet.x - this.BULLET_SPEED;
		}
		else if(bullet.direction == this.DIRECTION_STATES.DIAG_DOWN_RIGHT){
			bullet.y = bullet.y + this.BULLET_SPEED;
			bullet.x = bullet.x + this.BULLET_SPEED;
		}
			
	},
	
	drawBullet(bullet){
			this.ctx.beginPath();
			this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI*2, false);
			this.ctx.closePath();
			this.ctx.fillStyle = 'yellow';
			this.ctx.fill();
	},
	
	}; 