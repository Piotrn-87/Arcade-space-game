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

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const fps = 30;
const shipSize = 30;

let ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: shipSize / 2,
  a: (90 / 180) * Math.PI
};

setInterval(update(), 1000 / fps);

function update() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "white";
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

  (ctx.fillStyle = "coral"), ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
}
