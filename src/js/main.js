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
const fps = 30;
const shipSize = 30;
const turnSpeed = 360;

let ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: shipSize / 2,
  a: (90 / 180) * Math.PI,
  rotate: 0
};

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

setInterval(update, 1000 / fps);

function keyDown(e) {
  switch (e.keyCode) {
    case 37:
      ship.rotate = ((turnSpeed / 180) * Math.PI) / fps;
      console.log("Left", ship.rotate);
      break;
    case 39:
      ship.rotate = ((-turnSpeed / 180) * Math.PI) / fps;
      console.log("Right", ship.rotate);
      break;
    default:
      break;
  }
}

function keyUp(e) {
  switch (e.keyCode) {
    case 37:
      ship.rotate = 0;
      console.log("Left");
      break;
    case 39:
      ship.rotate = 0;
      console.log("Right");
      break;
    default:
      break;
  }
}

function update() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "green";
  ctx.lineWidth = shipSize / 10;
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

  ship.a += ship.rotate;
}
