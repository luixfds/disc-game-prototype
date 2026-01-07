// =====================================================
// CONFIGURAÇÃO DO JOGO
// =====================================================
const config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 900,
  backgroundColor: "#2b2b2b",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);

// =====================================================
// VARIÁVEIS GLOBAIS
// =====================================================
let player;
let playerNameText;
let cursors;

const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 2000;
const PLAYER_SIZE = 32;

// =====================================================
// PRELOAD
// =====================================================
function preload() {
  this.load.image("floor", "assets/floor.jpg");
  this.load.image("crate", "assets/crate.png");
  this.load.image("player", "assets/player.png");
}

// =====================================================
// CREATE
// =====================================================
function create() {
  // -------------------------------
  // UI (HTML)
  // -------------------------------
  const colorInput = document.getElementById("playerColor");
  const nameInput = document.getElementById("playerName");

  const initialColor = parseInt(colorInput.value.replace("#", "0x"));

  // -------------------------------
  // Mundo
  // -------------------------------
  this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  const background = this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, "floor");

  // ocupa exatamente o mundo inteiro
  background.setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT);

  // garante que fique no fundo
  background.setDepth(-100);

  // -------------------------------
  // Player
  // -------------------------------
  player = this.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, "player");

  // Visual
  player.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE);
  player.setTint(initialColor);

  // Pixel art sem blur
  this.textures.get("player").setFilter(Phaser.Textures.FilterMode.NEAREST);

  // Física
  this.physics.add.existing(player);
  player.body.setCollideWorldBounds(true);

  // Hitbox apenas nos pés
  player.body.setSize(PLAYER_SIZE, PLAYER_SIZE / 3);

  // Move a hitbox para a parte de baixo do sprite
  player.body.setOffset(0, PLAYER_SIZE - PLAYER_SIZE / 3);

  // -------------------------------
  // Nome do player
  // -------------------------------
  playerNameText = this.add.text(player.x, player.y - 28, nameInput.value, {
    fontSize: "14px",
    color: "#ffffff",
    fontFamily: "Arial",
  });
  playerNameText.setOrigin(0.5);

  // -------------------------------
  // Câmera
  // -------------------------------
  this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  this.cameras.main.startFollow(player, true, 0.1, 0.1);
  this.cameras.main.setZoom(2);

  // -------------------------------
  // Input
  // -------------------------------
  cursors = this.input.keyboard.createCursorKeys();

  // Mudar cor do player (tint)
  colorInput.addEventListener("input", () => {
    const color = parseInt(colorInput.value.replace("#", "0x"));
    player.setTint(color);
  });

  // Mudar nome do player
  nameInput.addEventListener("input", () => {
    playerNameText.setText(nameInput.value);
  });

  // -------------------------------
  // Objeto (crate)
  // -------------------------------
  const object = this.add.sprite(
    WORLD_WIDTH / 2 + 100,
    WORLD_HEIGHT / 2 + 100,
    "crate"
  );

  object.setDisplaySize(32, 48);

  this.textures.get("crate").setFilter(Phaser.Textures.FilterMode.NEAREST);

  this.physics.add.existing(object, true);
  object.body.setSize(32, 16);
  object.body.setOffset(0, 32);

  this.physics.add.collider(player, object);
  object.setDepth(object.y);
}

// =====================================================
// UPDATE
// =====================================================
function update() {
  const speed = 400;

  player.body.setVelocity(0);

  if (cursors.left.isDown) player.body.setVelocityX(-speed);
  if (cursors.right.isDown) player.body.setVelocityX(speed);
  if (cursors.up.isDown) player.body.setVelocityY(-speed);
  if (cursors.down.isDown) player.body.setVelocityY(speed);

  // Nome acompanha o player
  playerNameText.x = player.x;
  playerNameText.y = player.y - 28;

  player.setDepth(player.y);

  playerNameText.setDepth(player.y + 1);
}
