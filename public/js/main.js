/** 
 * @author Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version 0.1.0
 */

/**
 * Description : client script.
 */
 
var socket; 
socket = io.connect();

canvas_width = window.innerWidth * window.devicePixelRatio;
canvas_height = window.innerHeight * window.devicePixelRatio;

game = new Phaser.Game(640, 640, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: update });

function preload() {
	
	// Starting button
	game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
	game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', 'assets/dungeonTileset.png');
	game.load.image('star', 'assets/star.png');
	
	// ?
	game.stage.disableVisibilityChange = true;
	//game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
	//game.world.setBounds(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, false, false, false, false);
	
	// Set the physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//game.world.setBounds(0, 0, 1920, 1200);
	
	/*
	game.physics.p2.gravity.y = 300;
	game.physics.p2.applyGravity = false; 
	game.physics.p2.enableBody(game.physics.p2.walls, false);
	// physics start system
	game.physics.p2.setImpactEvents(true);*/
}

var text;
var button;
var x = 16;
var y = 16;

var map;

// Var for layers
var blackLayer;
var basicLayer;
var detailsLayer;
var objectLayer;

var cursors;
var sprite;

function create() {
	//game.stage.backgroundColor = 0xE1A193;
	
	// ---- LOADING ----
	// You can listen for each of these events from Phaser.Loader
    //game.load.onLoadStart.add(loadStart, this);
    //game.load.onFileComplete.add(fileComplete, this);
   // game.load.onLoadComplete.add(loadComplete, this);
	//	Just to kick things off
    //button = game.add.button(game.world.centerX - 95, 400, 'button', start, this, 2, 1, 0);
    //	Progress report
    //text = game.add.text(32, 32, 'Click to start load', { fill: '#ffffff' });
	// ---- END LOADING ----
	
	//scaling options
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	//have the game centered horizontally
    //this.scale.pageAlignHorizontally = true;
    //this.scale.pageAlignVertically = true;
	//this.game.scale.refresh();
	
	
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	// Create the tilemap from JSON and tilemap
	this.map = game.add.tilemap('level1');
	this.map.addTilesetImage('Desert', 'tiles');
	
	//create layer
    this.blackLayer = this.map.createLayer('BlackLayer');
    this.basicLayer = this.map.createLayer('BasicLayer');
	this.detailsLayer = this.map.createLayer('DetailsLayer'); 
	this.objectLayer = this.map.createLayer('MoreDetailsLayer');
	
	this.blackLayer.resizeWorld();
	
	// TODO
	//collision on blockedLayer
    //this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
	
	// Old
	//curlayer = map.createLayer('Ground');
    //curlayer.resizeWorld();
	
	sprite = game.add.sprite(450, 80, 'star');
    sprite.anchor.setTo(0.5, 0.5);

    game.physics.enable(sprite);

    game.camera.follow(sprite);

    cursors = game.input.keyboard.createCursorKeys();

    game.input.onDown.addOnce(openChest, this);
	
	// --- MULTIPLAYER --
	console.log("client started");
	socket.on("connect", onsocketConnected); 
	//listen to new enemy connections
	socket.on("new_enemyPlayer", onNewPlayer);
	//listen to enemy movement 
	socket.on("enemy_move", onEnemyMove);
	// when received remove_player, remove the player passed; 
	socket.on('remove_player', onRemovePlayer);
	// --- END MULTIPLAYER --
}

/**
 *
 */
function openChest() {
    //  This will replace every instance of tile 31 (cactus plant) with tile 46 (the sign post).
    //  It does this across the whole layer of the map unless a region is specified.
    //  You can also pass in x, y, width, height values to control the area in which the replace happens

    //map.replace(31, 46);
}
	
function update() {
	// emit the player input
	
	sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.angularVelocity = 0;

    if (cursors.left.isDown)
    {
        sprite.body.angularVelocity = -200;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.angularVelocity = 200;
    }

    if (cursors.up.isDown)
    {
        sprite.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(sprite.angle, 300));
    }
	
	// --- MULTIPLAYER --
	//console.log(gameProperties.in_game)
	//move the player when the player is made 
	/*
	if (gameProperties.in_game) {
		var pointer = game.input.keyboard.createCursorKeys();;
		console.log(pointer);
		if (game.physics.arcade.distanceToPointer(player) <= 50) {
			game.physics.arcade.moveToPointer(player, 100);
		} else {
			game.physics.arcade.moveToPointer(player, 100);
		}
		
		console.log('move_player !!!!!!!!!!!!!')	
		//Send a new position data to the server 
		socket.emit('move_player', {x: player.x, y: player.y, angle: player.angle});
	}*/
}

function start() {
	// Load sprites
	game.load.image('sky', 'assets/sky.png');
	game.load.image('ground', 'assets/platform.png');
	game.load.image('star', 'assets/star.png');
	
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	
    
	
	game.load.start();
    button.visible = false;
}
function loadStart() {
	text.setText("Loading ...");
}
//	This callback is sent the following parameters:
function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
	text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
	var newImage = game.add.image(x, y, cacheKey);
	newImage.scale.set(0.3);
	x += newImage.width + 20;
	if (x > 700)
	{
		x = 32;
		y += 332;
	}
}
function loadComplete() {
	text.setText("Load Complete");
}


//the enemy player list 
var enemies = [];

var gameProperties = { 
	gameWidth: 5000,
	gameHeight: 5000,
	game_elemnt: "gameDiv",
	in_game: false,
};

var main = function(game){
};

function onsocketConnected () {
	console.log("connected to server"); 
	createPlayer();
	console.log("INGAME")
	gameProperties.in_game = true;
	// send the server our initial position and tell it we are connected
	socket.emit('new_player', {x: 0, y: 0, angle: 0});
}

// When the server notifies us of client disconnection, we find the disconnected
// enemy and remove from our game
function onRemovePlayer (data) {
	var removePlayer = findplayerbyid(data.id);
	// Player not found
	if (!removePlayer) {
		console.log('Player not found: ', data.id)
		return;
	}
	
	removePlayer.player.destroy();
	enemies.splice(enemies.indexOf(removePlayer), 1);
}

function createPlayer () {
	
	player = game.add.sprite(100, 100, 'star');
	
	game.physics.arcade.enable(player);
	/*
	player.radius = 100;

	// set a fill and line style
	player.beginFill(0xffd900);
	player.lineStyle(2, 0xffd900, 1);
	player.drawCircle(0, 0, player.radius * 2);
	player.endFill();
	//player.anchor.setTo(0.5,0.5);
	player.body_size = player.radius; 

	// draw a shape
	game.physics.p2.enable(player, true);
	player.body.addCircle(player.body_size, 0 , 0); */
}

// this is the enemy class. 
var remote_player = function (id, startx, starty, start_angle) {
	this.x = startx;
	this.y = starty;
	//this is the unique socket id. We use it as a unique name for enemy
	this.id = id;
	this.angle = start_angle;
	
	this.player = game.add.graphics(this.x , this.y);
	
	this.player.radius = 100;

	// set a fill and line style
	this.player.beginFill(0xffd900);
	this.player.lineStyle(2, 0xffd900, 1);
	this.player.drawCircle(0, 0, this.player.radius * 2);
	this.player.endFill();
	//this.player.anchor.setTo(0.5,0.5);
	this.player.body_size = this.player.radius; 

	// draw a shape
	/*
	game.physics.p2.enable(this.player, true);
	this.player.body.clearShapes();
	this.player.body.addCircle(this.player.body_size, 0 , 0); 
	this.player.body.data.shapes[0].sensor = true;*/
}

//Server will tell us when a new enemy player connects to the server.
//We create a new enemy in our game.
function onNewPlayer (data) {
	console.log("onNewPlayer");
	console.log(data);
	//enemy object 
	var new_enemy = new remote_player(data.id, data.x, data.y, data.angle); 
	enemies.push(new_enemy);
}

//Server tells us there is a new enemy movement. We find the moved enemy
//and sync the enemy movement with the server
function onEnemyMove (data) {
	console.log(data.id);
	console.log(enemies);
	var movePlayer = findplayerbyid (data.id); 
	
	if (!movePlayer) {
		return;
	}
	movePlayer.player.body.x = data.x; 
	movePlayer.player.body.y = data.y; 
	movePlayer.player.angle = data.angle; 
}

//This is where we use the socket id. 
//Search through enemies list to find the right enemy of the id.
function findplayerbyid (id) {
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].id == id) {
			return enemies[i]; 
		}
	}
}

var gameBootstrapper = {
    init: function(gameContainerElementId){
		game.state.add('main', main);
		game.state.start('main'); 
    }
};;

gameBootstrapper.init("gameDiv");