"use strict";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("serviceworker.js").then(
      function(registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function(err) {
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

console.log(`it works`);

const fps = 30;
const shipSize = 30;
const turnSpeed = 360;
const shipForward = 5;
const motion = 0.7;
const asteroidNumber = 10;
const asteroidSize = 100;
const asteroidSpeed = 50;
const asteroidVert = 10;
const asteroidJaggedness = 0.5;

let pause = false;
let time;
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let hue = 0;
let asteroids = [];

let ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: shipSize / 2,
  a: (90 / 180) * Math.PI,
  rotate: 0,
  moveForward: false,
  forward: {
    x: 0,
    y: 0
  }
};

createAsteroids();

function start() {
  time = window.setInterval(() => {
    if (!pause) {
      update();
    }
  }, 30);
}
start();

// setInterval(update, 30);

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function createAsteroids() {
  asteroids = [];
  let x, y;
  for (let i = 0; i < asteroidNumber; i++) {
    do {
      x = Math.floor(Math.random() * canvas.width);
      y = Math.floor(Math.random() * canvas.height);
    } while (buffer(ship.x, ship.y, x, y) < asteroidSize * 2);
    asteroids.push(newAsteroid(x, y));
  }
}

function newAsteroid(x, y) {
  let asteroid = {
    x: x,
    y: y,
    vertically: Math.floor(
      Math.random() * (asteroidVert + 1) + asteroidVert / 2
    ),
    xv:
      ((Math.random() * asteroidSpeed) / fps) * (Math.random() < 0.5 ? 1 : -1),
    yv:
      ((Math.random() * asteroidSpeed) / fps) * (Math.random() < 0.5 ? 1 : -1),
    r: Math.floor((Math.random() * asteroidSize) / 2),
    a: Math.random() * Math.PI * 2,
    jaggedness: []
  };

  for (let i = 0; i < asteroidVert; i++) {
    asteroid.jaggedness.push(
      Math.random() * asteroidJaggedness * 2 + 1 - asteroidJaggedness
    );
  }

  return asteroid;
}

function buffer(x1, y1, x2, y2) {
  let distansBetweenShip = Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
  );
  return distansBetweenShip;
}

function keyDown(e) {
  hue = hue + 10;
  switch (e.keyCode) {
    case 37:
      ship.rotate = ((turnSpeed / 180) * Math.PI) / fps;
      break;
    case 38:
      ship.moveForward = true;
      break;
    case 39:
      ship.rotate = ((-turnSpeed / 180) * Math.PI) / fps;
      break;
    case 80:
      pause = !pause;
      break;
    default:
      break;
  }
}

function keyUp(e) {
  switch (e.keyCode) {
    case 37:
      ship.rotate = 0;
      break;
    case 38:
      ship.moveForward = false;
      break;
    case 39:
      ship.rotate = 0;
      break;
    default:
      break;
  }
}

function update() {
  // Draw Space
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the ship
  ctx.fillStyle = "green";
  ctx.strokeStyle = "white";
  ctx.lineWidth = shipSize / 15;
  ctx.beginPath();
  ctx.moveTo(
    ship.x + (4 / 3) * ship.r * Math.cos(ship.a),
    ship.y - (4 / 3) * ship.r * Math.sin(ship.a)
  );
  ctx.lineTo(
    ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + Math.sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - Math.cos(ship.a))
  );
  ctx.lineTo(
    ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - Math.sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + Math.cos(ship.a))
  );
  ctx.closePath();
  ctx.stroke();

  // Move forward in space
  if (ship.moveForward) {
    ship.forward.x += (shipForward * Math.cos(ship.a)) / 10;
    ship.forward.y -= (shipForward * Math.sin(ship.a)) / 10;

    // Draw Turbo Buster
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = shipSize / 15;
    ctx.beginPath();
    ctx.moveTo(
      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.7 * Math.sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.7 * Math.cos(ship.a))
    );
    ctx.lineTo(
      ship.x - ((ship.r * 6) / 3) * Math.cos(ship.a),
      ship.y + ((ship.r * 6) / 3) * Math.sin(ship.a)
    );
    ctx.lineTo(
      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.7 * Math.sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.7 * Math.cos(ship.a))
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ship.forward.x -= (motion * ship.forward.x) / 10;
    ship.forward.y -= (motion * ship.forward.y) / 10;
  }

  // Draw asteriods
  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.lineWidth = shipSize / 20;
  let x, y, r, a, vert, jaggedness;
  for (let i = 0; i < asteroids.length; i++) {
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

    // Move the asteroids
    asteroids[i].x = asteroids[i].x + asteroids[i].xv;
    asteroids[i].y = asteroids[i].y + asteroids[i].yv;

    // Edge of screen asteroids
    if (asteroids[i].x < 0 - asteroids[i].r) {
      asteroids[i].x = canvas.width + asteroids[i].r;
    } else if (asteroids[i].x > canvas.width + asteroids[i].r) {
      asteroids[i].x = 0 - asteroids[i].r;
    }
    if (asteroids[i].y < 0 - asteroids[i].r) {
      asteroids[i].y = canvas.height + asteroids[i].r;
    } else if (asteroids[i].x > canvas.height + asteroids[i].r) {
      asteroids[i].y = 0 - asteroids[i].r;
    }

    ctx.closePath();
    ctx.stroke();
  }

  // Rotate Ship
  ship.a = ship.a + ship.rotate;

  // Motion Ship
  ship.x = ship.x + ship.forward.x;
  ship.y = ship.y + ship.forward.y;

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
}
