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
    arcade: {
      debug: false,
    },
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
let lastDirection = "down";

const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 2000;
const PLAYER_SIZE = 32;

// =====================================================
// PRELOAD
// =====================================================
function preload() {
  this.load.image("floor", "assets/cenario/floor.png");

  // FRENTE
  this.load.image("front-idle", "assets/player/player-front1.png");
  this.load.image("front-walk1", "assets/player/player-front2.png");
  this.load.image("front-walk2", "assets/player/player-front3.png");

  // COSTAS
  this.load.image("back-idle", "assets/player/player-back1.png");
  this.load.image("back-walk1", "assets/player/player-back2.png");
  this.load.image("back-walk2", "assets/player/player-back3.png");

  // DIREITA
  this.load.image("right-idle", "assets/player/player-right1.png");
  this.load.image("right-walk1", "assets/player/player-right2.png");
  this.load.image("right-walk2", "assets/player/player-right3.png");

  // LEFT
  this.load.image("left-idle", "assets/player/player-left1.png");
  this.load.image("left-walk1", "assets/player/player-left2.png");
  this.load.image("left-walk2", "assets/player/player-left3.png");
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
  background.setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT);
  background.setDepth(-1);

  // -------------------------------
  // Player
  // -------------------------------
  player = this.add.sprite(
    WORLD_WIDTH / 2,
    WORLD_HEIGHT / 2,
    "player-front-idle"
  );

  player.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE);
  player.setTint(initialColor);

  // Pixel art nítido
  [
    "front-idle",
    "front-walk1",
    "front-walk2",
    "back-idle",
    "back-walk1",
    "back-walk2",
    "left-idle",
    "left-walk1",
    "left-walk2",
    "right-idle",
    "right-walk1",
    "right-walk2",
  ].forEach((key) => {
    this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
  });

  this.physics.add.existing(player);
  player.body.setCollideWorldBounds(true);

  // Hitbox inteira (Pokémon style)
  player.body.setSize(PLAYER_SIZE, PLAYER_SIZE);
  player.body.setOffset(6, 12);

  // -------------------------------
  // Nome do player
  // -------------------------------
  playerNameText = this.add.text(player.x, player.y - 20, nameInput.value, {
    fontSize: "14px",
    color: "#ffffff",
    fontFamily: "Arial",
  });
  playerNameText.setOrigin(0.5);

  // -------------------------------
  // Animações (Pokémon Fire Red)
  // -------------------------------
  this.anims.create({
    key: "walk-down",
    frames: [
      { key: "player", frame: 1 },
      { key: "player", frame: 2 },
    ],
    frameRate: 6,
    repeat: -1,
  });

  // -------------------------------
  // Câmera
  // -------------------------------
  this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  this.cameras.main.startFollow(player, true, 0.15, 0.15);
  this.cameras.main.setZoom(2);

  // -------------------------------
  // Input
  // -------------------------------
  cursors = this.input.keyboard.createCursorKeys();

  colorInput.addEventListener("input", () => {
    const color = parseInt(colorInput.value.replace("#", "0x"));
    player.setTint(color);
  });

  nameInput.addEventListener("input", () => {
    playerNameText.setText(nameInput.value);
  });

}

// =====================================================
// UPDATE
// =====================================================
function update(time, delta) {
  const speed = 200;
  const frameDelay = 180;

  player.body.setVelocity(0);
  let moving = false;

  // =========================
  // DESCER
  // =========================
  if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
    lastDirection = "down";
    moving = true;

    walkTimer += delta;
    if (walkTimer >= frameDelay) {
      walkFrame = walkFrame === 1 ? 2 : 1;
      player.setTexture(walkFrame === 1 ? "front-walk1" : "front-walk2");
      walkTimer = 0;
    }
  }

  // =========================
  // SUBIR
  // =========================
  else if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
    lastDirection = "up";
    moving = true;

    walkTimer += delta;
    if (walkTimer >= frameDelay) {
      walkFrame = walkFrame === 1 ? 2 : 1;
      player.setTexture(walkFrame === 1 ? "back-walk1" : "back-walk2");
      walkTimer = 0;
    }
  }

  // =========================
  // DIREITA
  // =========================
  else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
    lastDirection = "right";
    moving = true;

    walkTimer += delta;
    if (walkTimer >= frameDelay) {
      walkFrame = walkFrame === 1 ? 2 : 1;
      player.setTexture(walkFrame === 1 ? "right-walk1" : "right-walk2");
      walkTimer = 0;
    }
  }

  // =========================
  // LEFT
  // =========================
  else if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
    lastDirection = "left";
    moving = true;

    walkTimer += delta;
    if (walkTimer >= frameDelay) {
      walkFrame = walkFrame === 1 ? 2 : 1;
      player.setTexture(walkFrame === 1 ? "left-walk1" : "left-walk2");
      walkTimer = 0;
    }
  }

  // =========================
  // PARADO
  // =========================
  if (!moving) {
    walkFrame = 0;
    walkTimer = 0;

    if (lastDirection === "down") {
      player.setTexture("front-idle");
    } else if (lastDirection === "up") {
      player.setTexture("back-idle");
    } else if (lastDirection === "right") {
      player.setTexture("right-idle");
    } else if (lastDirection === "left") {
      player.setTexture("left-idle");
    }
  }

  // nome acompanha
  playerNameText.x = player.x;
  playerNameText.y = player.y - 18;

  player.setDepth(player.y);
  playerNameText.setDepth(player.y + 1);
}