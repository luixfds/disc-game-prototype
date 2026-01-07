const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#2b2b2b",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: { preload, create, update },
};

const game = new Phaser.Game(config);

let player;
let cursors;
let playerColor = 0x00ff00;

function preload() {}

function create() {
  const colorInput = document.getElementById("playerColor");

  playerColor = parseInt(colorInput.value.replace("#", "0x"));

  player = this.add.rectangle(400, 300, 32, 32, playerColor);
  this.physics.add.existing(player);
  player.body.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  colorInput.addEventListener("input", () => {
    player.fillColor = parseInt(colorInput.value.replace("#", "0x"));
  });
}

function update() {
  const speed = 200;
  player.body.setVelocity(0);

  if (cursors.left.isDown) player.body.setVelocityX(-speed);
  if (cursors.right.isDown) player.body.setVelocityX(speed);
  if (cursors.up.isDown) player.body.setVelocityY(-speed);
  if (cursors.down.isDown) player.body.setVelocityY(speed);
}
