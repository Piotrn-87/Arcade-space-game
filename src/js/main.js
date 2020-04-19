("use strict");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("serviceworker.js").then(
      function (registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}
console.log(`it works`);

const ASTEROID_NUMBER = 2;
const ASTEROID_SIZE = 50;
const ASTEROID_SPEED = 40;
const ASTEROID_VERT = 10;
const ASTEROID_JAGGENDESS = 0.5;
const BLINK = 0.1;
const FPS = 30;
const GAME_LIVE = 3;
const INVISIBILITY = 3;
const LASER_MAX = 120;
const LASER_SPEED = 500;
const POINTS_FOR_LARGE_ASTEROID = 10;
const POINTS_FOR_SMALL_ASTEROID = 20;
const SHIP_SIZE = 30;
const SHIP_FORWARD = 5;
const SHIP_EXPLODEDURATION = 1;
const TURN_SPEED = 270;
const TEXT_FADE_TIME = 3;

let asteroids = [];
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let hue = 0;
let level;
let lives = 3;
let livesColour;
let pause = false;
let ship;
let text;
let textAlpha;
let score;

let shoot = new soundEffect("../assets/sounds/Shoot.wav", 0.4, 10);
let shipBlowingUp = new soundEffect("../assets/sounds/Ship_Explosion.wav");
let rocketThruster = new soundEffect("../assets/sounds/Rocket_Thrusters.wav");
let crushing = new soundEffect("../assets/sounds/Crushing.wav", 1.0, 5);

function soundEffect(src, soundVolume = 1.0, maxSeries = 1) {
  let shootSeries = this.shootSeries;
  let streams = this.streams;
  shootSeries = 1;
  streams = [];
  for (let i = 0; i <= maxSeries; i++) {
    streams.push(new Audio(src));
    streams[i].volume = soundVolume;
  }
  this.play = function () {
    shootSeries = (shootSeries + 1) % maxSeries;
    streams[shootSeries].play();
  };
  this.stop = function () {
    streams[shootSeries].pause();
    streams[shootSeries].currentTime = 0;
  };
}

newGame();

function StartStop() {
  window.setInterval(() => {
    if (!pause) {
      UPDATE();
    }
  }, 30);
}
StartStop();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
  if (ship.dead) {
    return;
  }
  hue = hue + 10;
  switch (e.keyCode) {
    case 32:
      shootLaser();
      break;
    case 37:
      ship.rotate = ((TURN_SPEED / 180) * Math.PI) / FPS;
      break;
    case 38:
      ship.moveForward = true;
      break;
    case 39:
      ship.rotate = ((-TURN_SPEED / 180) * Math.PI) / FPS;
      break;
    case 40:
      ship.moveReturn = true;
      break;
    case 80:
      pause = !pause;
      break;
    default:
      break;
  }
}

function keyUp(e) {
  if (ship.dead) {
    return;
  }
  switch (e.keyCode) {
    case 32:
      ship.canShoot = true;
      break;
    case 37:
      ship.rotate = 0;
      break;
    case 38:
      ship.moveForward = false;
      break;
    case 39:
      ship.rotate = 0;
      break;
    case 40:
      ship.moveReturn = false;
      break;
    default:
      break;
  }
}

function newGame() {
  level = 0;
  score = 0;
  lives = GAME_LIVE;
  ship = newShip();
  nextLevel();
}

function gameOver() {
  ship.dead = true;
  text = "Game Over";
  textAlpha = 1.0;
}

function nextLevel() {
  text = "Level " + (level + 1);
  textAlpha = 1.0;
  createAsteroids();
}

function drawShip(x, y, a, colour = "white") {
  ctx.strokeStyle = colour;
  ctx.lineWidth = SHIP_SIZE / 15;
  ctx.beginPath();
  ctx.moveTo(
    x + (4 / 3) * ship.r * Math.cos(a),
    y - (4 / 3) * ship.r * Math.sin(a)
  );
  ctx.lineTo(
    x - ship.r * ((2 / 3) * Math.cos(a) + Math.sin(a)),
    y + ship.r * ((2 / 3) * Math.sin(a) - Math.cos(a))
  );
  ctx.lineTo(
    x - ship.r * ((2 / 3) * Math.cos(a) - Math.sin(a)),
    y + ship.r * ((2 / 3) * Math.sin(a) + Math.cos(a))
  );
  ctx.closePath();
  ctx.stroke();
}

function newShip() {
  return {
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height),
    r: SHIP_SIZE / 2,
    a: Math.PI / 2,
    blinkNum: 30,
    blinkTime: 3,
    canShoot: true,
    dead: false,
    exploadingTime: 0,
    forward: {
      x: 0,
      y: 0,
    },
    lasers: [],
    moveForward: false,
    moveReturn: false,
    motion: 0.7,
    rotate: 0,
  };
}

function createAsteroids() {
  asteroids = [];
  let x, y;
  for (let i = 0; i < ASTEROID_NUMBER + level; i++) {
    do {
      x = Math.floor(Math.random() * canvas.width);
      y = Math.floor(Math.random() * canvas.height);
    } while (safetyBuffer(ship.x, ship.y, x, y) < ASTEROID_SIZE * 2 + ship.r);
    asteroids.push(newAsteroid(x, y, Math.ceil(ASTEROID_SIZE / 2)));
  }
}

function newAsteroid(x, y, r) {
  let asteroidLevel = 1 + 0.1 * level;
  console.log("R", r);
  let asteroid = {
    x: x,
    y: y,
    vertically: Math.random() * 2 + ASTEROID_VERT,
    xv:
      ((Math.random() * ASTEROID_SPEED * asteroidLevel) / FPS) *
      (Math.random() < 0.5 ? 1 : -1),
    yv:
      ((Math.random() * ASTEROID_SPEED * asteroidLevel) / FPS) *
      (Math.random() < 0.5 ? 1 : -1),
    r: r,
    a: Math.PI * 2,
    jaggedness: [],
  };

  for (let i = 0; i < ASTEROID_VERT; i++) {
    asteroid.jaggedness.push(
      Math.random() * ASTEROID_JAGGENDESS * 2 + 1 - ASTEROID_JAGGENDESS
    );
  }
  return asteroid;
}

function destroyAsteroid(index) {
  let x = asteroids[index].x;
  let y = asteroids[index].y;
  let r = asteroids[index].r;
  crushing.play();

  if (r == Math.ceil(ASTEROID_SIZE / 2)) {
    score = score + POINTS_FOR_LARGE_ASTEROID;
    asteroids.push(newAsteroid(x, y, Math.ceil(ASTEROID_SIZE / 4)));
    asteroids.push(newAsteroid(x, y, Math.ceil(ASTEROID_SIZE / 4)));
  } else {
    score = score + POINTS_FOR_SMALL_ASTEROID;
  }
  asteroids.splice(index, 1);
  if (asteroids.length === 0) {
    level++;
    nextLevel();
  }
}

function explodeShip() {
  ship.exploadingTime = Math.floor(SHIP_EXPLODEDURATION * FPS);
  shipBlowingUp.play();
}

function safetyBuffer(x1, y1, x2, y2) {
  let distansBetweenPoints = Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
  );
  return distansBetweenPoints;
}

function shootLaser() {
  if (ship.canShoot) {
    ship.lasers.push({
      x: ship.x + (4 / 3) * ship.r * Math.cos(ship.a),
      y: ship.y - (4 / 3) * ship.r * Math.sin(ship.a),
      xv: (LASER_SPEED * Math.cos(ship.a)) / 50,
      yv: -(LASER_SPEED * Math.sin(ship.a)) / 50,
    });
    shoot.play();
  }
  ship.canShoot = false;
}

function UPDATE() {
  let blinkingOn = ship.blinkNum % INVISIBILITY === 0;
  let exploding = ship.exploadingTime > 0;

  // Draw Space
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the ship
  if (!exploding) {
    if (blinkingOn && !ship.dead) {
      drawShip(ship.x, ship.y, ship.a);
    }

    // Blinking On
    if (ship.blinkNum > 0) {
      ship.blinkTime--;
      if (ship.blinkTime === 0) {
        ship.blinkTime = Math.floor(BLINK * FPS);
        ship.blinkNum--;
      }
    }
  }

  // Explode ship
  else {
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 1, 7, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 1.4, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 1.1, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 0.8, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 0.5, Math.PI * 2, false);
    ctx.fill();
  }

  // Move forward in space
  if (ship.moveForward) {
    ship.forward.x += (SHIP_FORWARD * Math.cos(ship.a)) / 10;
    ship.forward.y += (SHIP_FORWARD * Math.sin(ship.a)) / 10;
    // rocketThruster.play();

    // Draw Turbo Buster
    if (!exploding && blinkingOn) {
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = SHIP_SIZE / 15;
      ctx.beginPath();
      ctx.moveTo(
        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.7 * Math.sin(ship.a)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.7 * Math.cos(ship.a))
      );
      ctx.lineTo(
        ship.x - ship.r * 2 * Math.cos(ship.a),
        ship.y + ship.r * 2 * Math.sin(ship.a)
      );
      ctx.lineTo(
        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.7 * Math.sin(ship.a)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.7 * Math.cos(ship.a))
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Move return in space
  } else if (ship.moveReturn && blinkingOn) {
    ship.forward.y -= (SHIP_FORWARD * Math.sin(ship.a)) / 20;
    ship.forward.x -= (SHIP_FORWARD * Math.cos(ship.a)) / 20;
    rocketThruster.stop();

    // Draw buster in return
    if (!exploding) {
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = SHIP_SIZE / 15;
      ctx.beginPath();
      ctx.moveTo(
        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.7 * Math.sin(ship.a)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.7 * Math.cos(ship.a))
      );
      ctx.lineTo(
        ship.x - ship.r * Math.cos(ship.a),
        ship.y + ship.r * Math.sin(ship.a)
      );
      ctx.lineTo(
        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.7 * Math.sin(ship.a)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.7 * Math.cos(ship.a))
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else {
    ship.forward.x -= (ship.motion * ship.forward.x) / 5;
    ship.forward.y -= (ship.motion * ship.forward.y) / 5;
  }

  // Draw Laser
  for (let i = 0; i < ship.lasers.length; i++) {
    ctx.fillStyle = "magenta";
    ctx.beginPath();
    ctx.arc(
      ship.lasers[i].x,
      ship.lasers[i].y,
      SHIP_SIZE / 2,
      Math.PI * 2,
      0,
      true
    );
    ctx.fill();
  }
  for (let i = 0; i < ship.lasers.length; i++) {
    ship.lasers[i].x += ship.lasers[i].xv;
    ship.lasers[i].y += ship.lasers[i].yv;
    // if (ship.lasers[i].x < 0) {
    //   ship.lasers[i].x = canvas.width;
    // } else if (ship.lasers[i].x > canvas.width) {
    //   ship.lasers[i].x = 0;
    // }
    // if (ship.lasers[i].y < 0) {
    //   ship.lasers[i].y = canvas.height;
    // } else if (ship.lasers[i].y > canvas.height) {
    //   ship.lasers[i].y = 0;
    // }
  }

  // Draw level text
  if (textAlpha >= 0) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(200, 200, 200, " + textAlpha + ")";
    ctx.font = "normal 32px algerian ";
    ctx.fillText(text, canvas.width / 2, canvas.height * 0.1);
    textAlpha = textAlpha - 1.0 / TEXT_FADE_TIME / FPS;
  } else if (ship.dead) {
    newGame();
  }

  // Draw lives
  for (let i = 0; i < lives; i++) {
    livesColour = exploding && i === lives - 1 ? "green" : "lime";
    drawShip(
      SHIP_SIZE + i * SHIP_SIZE * 1.2,
      SHIP_SIZE,
      0.5 * Math.PI,
      livesColour
    );
  }

  // Draw Score
  ctx.textAlign = "right";
  ctx.textBaseline = "right";
  ctx.fillStyle = "rgba(200, 200, 200)";
  ctx.font = "normal 18px arial";
  ctx.fillText("Score: " + score, canvas.width - SHIP_SIZE, SHIP_SIZE);

  // Detect laser hits on asteroids
  let asteroid_x, asteroid_y, asteroid_r, laser_x, laser_y;
  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroid_x = asteroids[i].x;
    asteroid_y = asteroids[i].y;
    asteroid_r = asteroids[i].r;

    for (let j = ship.lasers.length - 1; j >= 0; j--) {
      laser_x = ship.lasers[j].x;
      laser_y = ship.lasers[j].y;

      if (safetyBuffer(asteroid_x, asteroid_y, laser_x, laser_y) < asteroid_r) {
        ship.lasers.splice(j, 1);
        destroyAsteroid(i, 1);
        break;
      }
    }
  }

  // Draw asteriods
  let x, y, r, a, vert, jaggedness;
  for (let i = 0; i < asteroids.length; i++) {
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.lineWidth = SHIP_SIZE / 20;
    x = asteroids[i].x;
    y = asteroids[i].y;
    a = asteroids[i].a;
    r = asteroids[i].r;
    vert = asteroids[i].vertically;
    jaggedness = asteroids[i].jaggedness;
    ctx.beginPath();
    ctx.moveTo(
      x + r * jaggedness[0] * Math.cos(a),
      y + r * jaggedness[0] * Math.sin(a)
    );
    for (let j = 1; j < vert; j++) {
      ctx.lineTo(
        x + r * jaggedness[j] * Math.cos(a + (j * Math.PI * 2) / vert),
        y + r * jaggedness[j] * Math.sin(a + (j * Math.PI * 2) / vert)
      );
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Check for collision
  if (!exploding) {
    if (ship.blinkNum === 0) {
      for (let i = 0; i < asteroids.length; i++) {
        if (
          safetyBuffer(ship.x, ship.y, asteroids[i].x, asteroids[i].y) <
          ship.r + asteroids[i].r
        ) {
          explodeShip();
          destroyAsteroid(i);
          break;
        }
      }
    }

    // Rotate Ship
    ship.a = ship.a + ship.rotate;

    // Motion Ship
    ship.x = ship.x + ship.forward.x;
    ship.y = ship.y - ship.forward.y;
  } else {
    ship.exploadingTime--;
    if (ship.exploadingTime === 0) {
      lives--;
      if (lives === 0) {
        gameOver();
      } else {
        ship = newShip();
      }
    }
  }

  // Edge of screen
  if (ship.x < 0 - ship.r) {
    ship.x = canvas.width + ship.r;
  } else if (ship.x > canvas.width + ship.r) {
    ship.x = 0 - ship.r;
  }
  if (ship.y < 0 - ship.r) {
    ship.y = canvas.height + ship.r;
  } else if (ship.y > canvas.height + ship.r) {
    ship.y = 0 - ship.r;
  }

  // Move the asteroids
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].x = asteroids[i].x + asteroids[i].xv / 2;
    asteroids[i].y = asteroids[i].y + asteroids[i].yv * 2;

    // Edge of screen asteroids
    if (asteroids[i].x < 0 - asteroids[i].r) {
      asteroids[i].x = canvas.width + asteroids[i].r;
    } else if (asteroids[i].x > canvas.width + asteroids[i].r) {
      asteroids[i].x = 0 - asteroids[i].r;
    }
    if (asteroids[i].y < 0 - asteroids[i].r) {
      asteroids[i].y = canvas.height + asteroids[i].r;
    } else if (asteroids[i].y > canvas.height + asteroids[i].r) {
      asteroids[i].y = 0 - asteroids[i].r;
    }
  }
}

// function handleKey(event) {
//   console.log(event.keyCode);
// }
// window.addEventListener("keydown", handleKey);
