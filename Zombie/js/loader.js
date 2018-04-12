/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};


window.onload = function(){
	console.log("window.onload called");
	
	
	
	app.enemy.init(app.main.WIDTH, app.main.HEI);
	app.main.enemy = app.enemy;
	
	app.main.bullet = app.bullet;
	app.bullet.init();
	
	//player must be init() last do to prerqeus
	app.main.player = app.player;
	app.player.init(app.main.bullet, app.main.WIDTH, app.main.HEIGHT);
	
	
	app.main.init();
};

window.onblur = function(){
	console.log("blurat"+Date());
	app.main.pauseGame();
};