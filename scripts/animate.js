var game = new Phaser.Game(2048, 1024, Phaser.AUTO, '', { preload: preload, init: init, create: create, update: update })

function preload() {
  game.load.spritesheet('guy', 'assets/guy.png', 17, 26)

  game.load.image('ladybug', 'assets/ladybug.png');

  game.load.image('tileset', 'assets/tileset.png')
  game.load.tilemap('tilemap', 'assets/tilemap.csv')
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

function create() {

  ladybugs = game.add.group();

  for (var i = 0; i < 10; i++) {
    ladybugs.create(1 + Math.random() * 400, 120 + Math.random() * 400, 'ladybug');
  }

  game.stage.backgroundColor = '#99cccc';
  // game.world.resize(2048, 1024);
  game.physics.startSystem(Phaser.Physics.ARCADE);
  map = game.add.tilemap('tilemap', 16, 16)
  map.addTilesetImage('tileset');
  layer = map.createLayer(0);
  map.setCollisionByExclusion([15, 16], true, layer);
  player = game.add.sprite(0, 0, 'guy');
  player.animations.add('right', [0, 1], 10, true);
  player.animations.add('left', [2, 3], 10, true);
  game.physics.enable(player);
  player.body.gravity.y = 600;
  player.body.collideWorldBounds = true;

  ladybugs.forEach(function(ladybug) {
    game.physics.enable(ladybug);
    ladybug.body.collideWorldBounds = true;
    ladybug.body.gravity.y = 600;
    ladybug.body.velocity.x = -40;
  });
}


var updateCount = 0;

function update() {

  updateCount++;

  ladybugs.forEach(function(ladybug) {
    game.physics.arcade.collide(ladybug, layer);
  });

  game.physics.arcade.collide(player, layer);
  game.camera.follow(player);
  cursors = game.input.keyboard.createCursorKeys();
  player.body.velocity.x = 0;
  player.body.position.y = Math.round(player.body.position.y);
  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    player.animations.play('right');
    player.body.velocity.x += 200;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    player.animations.play('left');
    player.body.velocity.x -= 200;
  } else {
    player.animations.stop(null, true);
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.body.blocked.down) {
    player.body.velocity.y -= 350;
  }
}
