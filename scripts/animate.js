const LADYBUG_SPEED = 40;

var game = new Phaser.Game(256, 240, Phaser.AUTO, '', { preload: preload, init: init, create: create, update: update })

function preload() {
  game.load.spritesheet('guy', 'assets/guy.png', 17, 26)
  game.load.image('tileset', 'assets/tileset.png')
  game.load.tilemap('tilemap', 'assets/tilemap.csv')
  game.load.spritesheet('ladybug', 'assets/ladybugs.png', 32, 24)
}

function init() {
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.scale.setUserScale(2, 2);
  game.renderer.renderSession.roundPixels = true;
  Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
}


var player;
var map;
var layer;
var ladybugs;
var running = false;

function create() {

  ladybugs = game.add.group();

  for (var i = 0; i < 10; i++) {
    ladybugs.create(1 + Math.random() * 400, 120 + Math.random() * 400, 'ladybug');
  }

  game.stage.backgroundColor = '#99cccc';
  game.world.resize(2048, 1024);
  game.physics.startSystem(Phaser.Physics.ARCADE);
  map = game.add.tilemap('tilemap', 16, 16)
  map.addTilesetImage('tileset');
  layer = map.createLayer(0);
  map.setCollisionByExclusion([15, 16], true, layer);
  player = game.add.sprite(0, 0, 'guy');
  player.animations.add('right-walk', [0, 1], 5, true);
  player.animations.add('left-walk', [2, 3], 5, true);
  player.animations.add('right-run', [0, 1], 10, true);
  player.animations.add('left-run', [2, 3], 10, true);
  game.physics.enable(player);
  player.body.gravity.y = 1200;
  player.body.collideWorldBounds = true;

  ladybugs.forEach(function(ladybug) {
    game.physics.enable(ladybug);
    ladybug.body.collideWorldBounds = true;
    ladybug.body.gravity.y = 600;
    ladybug.body.velocity.x = ((Math.random() * 60) + 20) * -1;
    ladybug.animations.add('right', [0, 1, 2, 3, 4, 3, 2, 1], 10, true);
    ladybug.animations.add('left', [5, 6, 7, 8, 9, 8, 7, 6], 10, true);
    ladybug.facing = 'left';
    ladybug.body.bounce.set(1);
  });
  game.add.text(0, 0, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', {fontSize: 10});
}

var updateCount = 0;

function update() {
  game.physics.arcade.collide(player, layer);

  updateCount++;

  ladybugs.forEach(function(ladybug) {
    game.physics.arcade.collide(ladybug, layer);
    ladybug.body.bounce.y = 0;
    if (ladybug.body.velocity.x > 0) {
      ladybug.animations.play('right')
    } else {
      ladybug.animations.play('left')
    }
  });
  game.camera.follow(player);
  cursors = game.input.keyboard.createCursorKeys();
  player.body.velocity.x = 0;
  player.body.position.y = Math.round(player.body.position.y);
  if (player.body.blocked.down) {
    if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
      running = true;
    } else {
      running = false;
    }
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    if (running == true) {
      player.animations.play('right-run');
      player.body.velocity.x += 300;
    } else {
      player.animations.play('right-walk')
      player.body.velocity.x += 150;
    }
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    if (running == true) {
      player.animations.play('left-run');
      player.body.velocity.x -= 300;
    } else {
      player.animations.play('left-walk')
      player.body.velocity.x -= 150;
    }
  } else {
    player.animations.stop(null, true);
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.body.blocked.down) {
    player.body.velocity.y -= 500;
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    player.body.position.x = 0;
    player.body.position.y = 0;
  }
}