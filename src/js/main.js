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

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let hue = 0;

const fps = 30;
const shipSize = 30;
const turnSpeed = 360;
const shipForward = 5;
const motion = 0.7;

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
let xx = ship.a;

console.log("cos a", Math.cos((90 / 180) * Math.PI));

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

setInterval(update, 30);

function keyDown(e) {
  hue = hue + 10;
  console.log("hue", hue);
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

  // Move Forward Space
  if (ship.moveForward) {
    ship.forward.x += (shipForward * Math.cos(ship.a)) / fps;
    ship.forward.y -= (shipForward * Math.sin(ship.a)) / fps;

    // Draw Turbo Buster
    // ctx.fillStyle = "red";
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
    ship.forward.x -= (motion * ship.forward.x) / fps;
    ship.forward.y -= (motion * ship.forward.y) / fps;
  }

  // Draw the ship
  ctx.strokeStyle = "#fff";
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

  // Rotate Ship
  ship.a += ship.rotate;
  // Motio Ship
  ship.x += ship.forward.x;
  ship.y += ship.forward.y;

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
