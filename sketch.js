//black bloxprojeto de coleta maça simples
let player;
let apples = [];
let rocks = [];
let score = 0;
let playerSize = 50;
let appleSize = 30;
let rockSize = 40;
let gameOver = false;

let scoreboardDiv;
let instructionsDiv;

function setup() {
  createCanvas(600, 400);
  player = new Player();
  spawnApple();
  spawnRock();
  frameRate(60);

  // Create scoreboard div
  scoreboardDiv = createDiv('Maçãs coletadas: 0');
  scoreboardDiv.style('position', 'absolute');
  scoreboardDiv.style('top', '15px');
  scoreboardDiv.style('left', '15px');
  scoreboardDiv.style('font-size', '1.5rem');
  scoreboardDiv.style('font-weight', 'bold');
  scoreboardDiv.style('color', 'white');
  scoreboardDiv.style('text-shadow', '2px 2px 4px #276419');
  scoreboardDiv.style('font-family', "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");

  // Create instructions div
  instructionsDiv = createDiv('Use as setas do teclado para mover o personagem.<br />Colete as maçãs vermelhas. Evite as pedras cinzas!');
  instructionsDiv.style('position', 'absolute');
  instructionsDiv.style('bottom', '15px');
  instructionsDiv.style('left', '15px');
  instructionsDiv.style('font-size', '1rem');
  instructionsDiv.style('color', 'white');
  instructionsDiv.style('max-width', '250px');
  instructionsDiv.style('text-shadow', '1px 1px 3px #276419');
  instructionsDiv.style('font-family', "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
}

function draw() {
  background('#70b551');

  if (gameOver) {
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(48);
    text('Fim de jogo!', width / 2, height / 2 - 40);
    textSize(24);
    text('Atualize a página para jogar novamente', width / 2, height / 2 + 20);
    noLoop();
    return;
  }

  player.move();
  player.show();

  // Show and move apples
  for (let i = apples.length - 1; i >= 0; i--) {
    apples[i].show();
    apples[i].fall();

    if (apples[i].offScreen()) {
      apples.splice(i, 1);
      spawnApple();
    } else if (apples[i].hits(player)) {
      score++;
      updateScore();
      apples.splice(i, 1);
      spawnApple();
    }
  }

  // Show and move rocks
  for (let i = rocks.length - 1; i >= 0; i--) {
    rocks[i].show();
    rocks[i].fall();

    if (rocks[i].offScreen()) {
      rocks.splice(i, 1);
      spawnRock();
    } else if (rocks[i].hits(player)) {
      gameOver = true;
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    player.setDir(-1);
  } else if (keyCode === RIGHT_ARROW) {
    player.setDir(1);
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    player.setDir(0);
  }
}

function updateScore() {
  scoreboardDiv.html('Maçãs coletadas: ' + score);
}

function spawnApple() {
  let x = random(appleSize / 2, width - appleSize / 2);
  let y = -appleSize;
  apples.push(new Apple(x, y));
}

function spawnRock() {
  let x = random(rockSize / 2, width - rockSize / 2);
  let y = -rockSize;
  rocks.push(new Rock(x, y));
}

// Player class - a basket for collecting apples
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - playerSize / 2 - 10;
    this.dir = 0;
    this.speed = 7;
    this.size = playerSize;
  }

  move() {
    this.x += this.dir * this.speed;
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
  }

  setDir(dir) {
    this.dir = dir;
  }

  show() {
    noStroke();
    // Basket representation - brown rectangle with handles
    fill('#7B3F00');
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size / 2, 10);
    stroke('#5a2d00');
    strokeWeight(4);
    // handles
    line(this.x - this.size / 2 + 5, this.y, this.x - this.size / 2 + 5, this.y - 20);
    line(this.x + this.size / 2 - 5, this.y, this.x + this.size / 2 - 5, this.y - 20);
    noStroke();
  }
}

// Apple class
class Apple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = appleSize;
    this.speed = 3 + random(0, 1.5);
  }

  fall() {
    this.y += this.speed;
  }

  offScreen() {
    return this.y - this.size / 2 > height;
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < this.size / 2 + player.size / 4;
  }

  show() {
    push();
    translate(this.x, this.y);
    // Apple body
    fill('#ff3d3d');
    ellipse(0, 0, this.size, this.size);

    // Apple leaf
    fill('#2e7d32');
    triangle(-this.size / 10, -this.size / 2.5, 0, -this.size / 2 - 5, this.size / 10, -this.size / 2.5);

    // Apple stem
    stroke('#8b5a2b');
    strokeWeight(3);
    line(0, -this.size / 2, 0, -this.size / 1.7);

    pop();
  }
}

// Rock class (obstacle)
class Rock {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = rockSize;
    this.speed = 2 + random(0, 1.5);
  }

  fall() {
    this.y += this.speed;
  }

  offScreen() {
    return this.y - this.size / 2 > height;
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < this.size / 2 + player.size / 4;
  }

  show() {
    push();
    translate(this.x, this.y);
    fill('#7d7d7d');
    ellipse(0, 0, this.size, this.size * 0.7);
    pop();
  }
}

