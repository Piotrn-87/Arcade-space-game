!function(g){var I={};function c(n){if(I[n])return I[n].exports;var i=I[n]={i:n,l:!1,exports:{}};return g[n].call(i.exports,i,i.exports,c),i.l=!0,i.exports}c.m=g,c.c=I,c.d=function(g,I,n){c.o(g,I)||Object.defineProperty(g,I,{enumerable:!0,get:n})},c.r=function(g){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(g,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(g,"__esModule",{value:!0})},c.t=function(g,I){if(1&I&&(g=c(g)),8&I)return g;if(4&I&&"object"==typeof g&&g&&g.__esModule)return g;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:g}),2&I&&"string"!=typeof g)for(var i in g)c.d(n,i,function(I){return g[I]}.bind(null,i));return n},c.n=function(g){var I=g&&g.__esModule?function(){return g.default}:function(){return g};return c.d(I,"a",I),I},c.o=function(g,I){return Object.prototype.hasOwnProperty.call(g,I)},c.p="",c(c.s=0)}([function(module,exports,__webpack_require__){"use strict";eval('\r\n\r\nif ("serviceWorker" in navigator) {\r\n  window.addEventListener("load", function () {\r\n    navigator.serviceWorker.register("serviceworker.js").then(\r\n      function (registration) {\r\n        console.log(\r\n          "ServiceWorker registration successful with scope: ",\r\n          registration.scope\r\n        );\r\n      },\r\n      function (err) {\r\n        console.log("ServiceWorker registration failed: ", err);\r\n      }\r\n    );\r\n  });\r\n}\r\nconsole.log(`it works`);\r\n\r\nconst ASTEROIDNUMBER = 10;\r\nconst ASTEROIDSIZE = 100;\r\nconst ASTEROIDSPEED = 50;\r\nconst ASTEROIDVERT = 10;\r\nconst ASTEROIDJAGGENDESS = 0.5;\r\nconst BLINK = 0.1;\r\nconst FPS = 30;\r\nconst INVISIBILITY = 3;\r\nconst LASER_MAX = 100;\r\nconst LASER_SPEED = 500;\r\nconst SHIPSIZE = 30;\r\nconst TURNSPEED = 270;\r\nconst SHIPFORWARD = 5;\r\nconst SHIPEXPLODEDURATION = 1;\r\n\r\nlet pause = false;\r\nlet canvas = document.getElementById("gameCanvas");\r\nlet ctx = canvas.getContext("2d");\r\nlet hue = 0;\r\nlet asteroids = [];\r\nlet ship = newShip();\r\n\r\nfunction START() {\r\n  window.setInterval(() => {\r\n    if (!pause) {\r\n      UPDATE();\r\n    }\r\n  }, 30);\r\n}\r\nSTART();\r\ncreateAsteroids();\r\n\r\ndocument.addEventListener("keydown", keyDown);\r\ndocument.addEventListener("keyup", keyUp);\r\n\r\nfunction keyDown(e) {\r\n  hue = hue + 10;\r\n  switch (e.keyCode) {\r\n    case 32:\r\n      shootLaser();\r\n      break;\r\n    case 37:\r\n      ship.rotate = ((TURNSPEED / 180) * Math.PI) / FPS;\r\n      break;\r\n    case 38:\r\n      ship.moveForward = true;\r\n      break;\r\n    case 39:\r\n      ship.rotate = ((-TURNSPEED / 180) * Math.PI) / FPS;\r\n      break;\r\n    case 40:\r\n      ship.moveReturn = true;\r\n      break;\r\n    case 80:\r\n      pause = !pause;\r\n      break;\r\n    default:\r\n      break;\r\n  }\r\n}\r\n\r\nfunction keyUp(e) {\r\n  switch (e.keyCode) {\r\n    case 32:\r\n      ship.canShoot = true;\r\n      break;\r\n    case 37:\r\n      ship.rotate = 0;\r\n      break;\r\n    case 38:\r\n      ship.moveForward = false;\r\n      break;\r\n    case 39:\r\n      ship.rotate = 0;\r\n      break;\r\n    case 40:\r\n      ship.moveReturn = false;\r\n      break;\r\n    default:\r\n      break;\r\n  }\r\n}\r\n\r\nfunction createAsteroids() {\r\n  asteroids = [];\r\n  let x, y;\r\n  for (let i = 0; i < ASTEROIDNUMBER; i++) {\r\n    do {\r\n      x = Math.floor(Math.random() * canvas.width);\r\n      y = Math.floor(Math.random() * canvas.height);\r\n    } while (safetyBuffer(ship.x, ship.y, x, y) < ASTEROIDSIZE * 2);\r\n    asteroids.push(newAsteroid(x, y));\r\n  }\r\n}\r\nfunction newShip() {\r\n  return {\r\n    x: Math.floor(Math.random() * canvas.width),\r\n    y: Math.floor(Math.random() * canvas.height),\r\n    r: SHIPSIZE / 2,\r\n    a: Math.PI / 2,\r\n    blinkNum: 30,\r\n    blinkTime: 3,\r\n    canShoot: true,\r\n    exploadingTime: 0,\r\n    forward: {\r\n      x: 0,\r\n      y: 0,\r\n    },\r\n    lasers: [],\r\n    moveForward: false,\r\n    moveReturn: false,\r\n    motion: 0.7,\r\n    rotate: 0,\r\n  };\r\n}\r\n\r\nfunction newAsteroid(x, y) {\r\n  let asteroid = {\r\n    x: x,\r\n    y: y,\r\n    vertically: Math.random() * 10 + ASTEROIDVERT / 2,\r\n    xv: (Math.random() * ASTEROIDSPEED) / FPS < 0.5 ? 1 : -1,\r\n    yv: (Math.random() * ASTEROIDSPEED) / FPS < 0.5 ? 1 : -1,\r\n    r: Math.floor((Math.random() * ASTEROIDSIZE) / 4),\r\n    a: Math.PI * 2,\r\n    jaggedness: [],\r\n  };\r\n  for (let i = 0; i < ASTEROIDVERT; i++) {\r\n    asteroid.jaggedness.push(\r\n      Math.random() * ASTEROIDJAGGENDESS * 2 + 1 - ASTEROIDJAGGENDESS\r\n    );\r\n  }\r\n  return asteroid;\r\n}\r\n\r\nfunction safetyBuffer(x1, y1, x2, y2) {\r\n  let distansBetweenPoints = Math.sqrt(\r\n    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)\r\n  );\r\n  return distansBetweenPoints;\r\n}\r\n\r\nfunction explodeShip() {\r\n  ship.exploadingTime = Math.floor(SHIPEXPLODEDURATION * FPS);\r\n}\r\n\r\nfunction shootLaser() {\r\n  if (ship.canShoot && ship.lasers.length < LASER_MAX) {\r\n    ship.lasers.push({\r\n      x: ship.x + (4 / 3) * ship.r * Math.cos(ship.a),\r\n      y: ship.y - (4 / 3) * ship.r * Math.sin(ship.a),\r\n      xv: (LASER_SPEED * Math.cos(ship.a)) / 50,\r\n      yv: -(LASER_SPEED * Math.sin(ship.a)) / 50,\r\n    });\r\n  }\r\n  ship.canShoot = false;\r\n}\r\n\r\nfunction UPDATE() {\r\n  let blinkingOn = ship.blinkNum % INVISIBILITY === 0;\r\n  let exploding = ship.exploadingTime > 0;\r\n\r\n  // Draw Space\r\n  ctx.fillStyle = "black";\r\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\r\n\r\n  // Draw the ship\r\n  if (!exploding) {\r\n    if (blinkingOn) {\r\n      ctx.strokeStyle = "white";\r\n      ctx.lineWidth = SHIPSIZE / 15;\r\n      ctx.beginPath();\r\n      ctx.moveTo(\r\n        ship.x + (4 / 3) * ship.r * Math.cos(ship.a),\r\n        ship.y - (4 / 3) * ship.r * Math.sin(ship.a)\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - Math.cos(ship.a))\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + Math.cos(ship.a))\r\n      );\r\n      ctx.closePath();\r\n      ctx.stroke();\r\n    }\r\n\r\n    // Blinking On\r\n    if (ship.blinkNum > 0) {\r\n      ship.blinkTime--;\r\n      if (ship.blinkTime === 0) {\r\n        ship.blinkTime = Math.floor(BLINK * FPS);\r\n        ship.blinkNum--;\r\n      }\r\n    }\r\n  }\r\n\r\n  // Explode ship\r\n  else {\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 1, 7, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "red";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 1.4, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "orange";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 1.1, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "yellow";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 0.8, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "white";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 0.5, Math.PI * 2, false);\r\n    ctx.fill();\r\n  }\r\n\r\n  // Move forward in space\r\n  if (ship.moveForward) {\r\n    ship.forward.x += (SHIPFORWARD * Math.cos(ship.a)) / 10;\r\n    ship.forward.y += (SHIPFORWARD * Math.sin(ship.a)) / 10;\r\n\r\n    // Draw Turbo Buster\r\n    if (!exploding && blinkingOn) {\r\n      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;\r\n      ctx.strokeStyle = "yellow";\r\n      ctx.lineWidth = SHIPSIZE / 15;\r\n      ctx.beginPath();\r\n      ctx.moveTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * 2 * Math.cos(ship.a),\r\n        ship.y + ship.r * 2 * Math.sin(ship.a)\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.closePath();\r\n      ctx.fill();\r\n      ctx.stroke();\r\n    }\r\n\r\n    // Move return in space\r\n  } else if (ship.moveReturn && blinkingOn) {\r\n    ship.forward.y -= (SHIPFORWARD * Math.sin(ship.a)) / 20;\r\n    ship.forward.x -= (SHIPFORWARD * Math.cos(ship.a)) / 20;\r\n\r\n    // Draw buster in return\r\n    if (!exploding) {\r\n      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;\r\n      ctx.strokeStyle = "yellow";\r\n      ctx.lineWidth = SHIPSIZE / 15;\r\n      ctx.beginPath();\r\n      ctx.moveTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * Math.cos(ship.a),\r\n        ship.y + ship.r * Math.sin(ship.a)\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.closePath();\r\n      ctx.fill();\r\n      ctx.stroke();\r\n    }\r\n  } else {\r\n    ship.forward.x -= (ship.motion * ship.forward.x) / 5;\r\n    ship.forward.y -= (ship.motion * ship.forward.y) / 5;\r\n  }\r\n\r\n  // Draw Laser\r\n  for (let i = 0; i < ship.lasers.length; i++) {\r\n    ctx.fillStyle = "magenta";\r\n    ctx.beginPath();\r\n    ctx.arc(\r\n      ship.lasers[i].x,\r\n      ship.lasers[i].y,\r\n      SHIPSIZE / 2,\r\n      Math.PI * 2,\r\n      0,\r\n      true\r\n    );\r\n    ctx.fill();\r\n  }\r\n  for (let i = 0; i < ship.lasers.length; i++) {\r\n    ship.lasers[i].x += ship.lasers[i].xv;\r\n    ship.lasers[i].y += ship.lasers[i].yv;\r\n    // if (ship.lasers[i].x < 0) {\r\n    //   ship.lasers[i].x = canvas.width;\r\n    // } else if (ship.lasers[i].x > canvas.width) {\r\n    //   ship.lasers[i].x = 0;\r\n    // }\r\n    // if (ship.lasers[i].y < 0) {\r\n    //   ship.lasers[i].y = canvas.height;\r\n    // } else if (ship.lasers[i].y > canvas.height) {\r\n    //   ship.lasers[i].y = 0;\r\n    // }\r\n  }\r\n\r\n  // Detect laser hits on asteroids\r\n  let asteroid_x, asteroid_y, asteroid_r, laser_x, laser_y;\r\n  for (let i = asteroids.length - 1; i >= 0; i--) {\r\n    asteroid_x = asteroids[i].x;\r\n    asteroid_y = asteroids[i].y;\r\n    asteroid_r = asteroids[i].r;\r\n\r\n    for (let j = ship.lasers.length - 1; j >= 0; j--) {\r\n      laser_x = ship.lasers[j].x;\r\n      laser_y = ship.lasers[j].y;\r\n\r\n      if (safetyBuffer(asteroid_x, asteroid_y, laser_x, laser_y) < asteroid_r) {\r\n        ship.lasers.splice(j, 1);\r\n        asteroids.splice(i, 1);\r\n        break;\r\n      }\r\n    }\r\n  }\r\n\r\n  // Draw asteriods\r\n  let x, y, r, a, vert, jaggedness;\r\n  for (let i = 0; i < asteroids.length; i++) {\r\n    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;\r\n    ctx.lineWidth = SHIPSIZE / 20;\r\n    x = asteroids[i].x;\r\n    y = asteroids[i].y;\r\n    a = asteroids[i].a;\r\n    r = asteroids[i].r;\r\n    vert = asteroids[i].vertically;\r\n    jaggedness = asteroids[i].jaggedness;\r\n    ctx.beginPath();\r\n    ctx.moveTo(\r\n      x + r * jaggedness[0] * Math.cos(a),\r\n      y + r * jaggedness[0] * Math.sin(a)\r\n    );\r\n    for (let j = 1; j < vert; j++) {\r\n      ctx.lineTo(\r\n        x + r * jaggedness[j] * Math.cos(a + (j * Math.PI * 2) / vert),\r\n        y + r * jaggedness[j] * Math.sin(a + (j * Math.PI * 2) / vert)\r\n      );\r\n    }\r\n    ctx.closePath();\r\n    ctx.stroke();\r\n  }\r\n\r\n  // Check for collision\r\n  if (!exploding) {\r\n    if (ship.blinkNum === 0) {\r\n      for (let i = 0; i < asteroids.length; i++) {\r\n        if (\r\n          safetyBuffer(ship.x, ship.y, asteroids[i].x, asteroids[i].y) <=\r\n          ship.r + asteroids[i].r\r\n        ) {\r\n          explodeShip();\r\n        }\r\n      }\r\n    }\r\n\r\n    // Rotate Ship\r\n    ship.a = ship.a + ship.rotate;\r\n\r\n    // Motion Ship\r\n    ship.x = ship.x + ship.forward.x;\r\n    ship.y = ship.y - ship.forward.y;\r\n  } else {\r\n    ship.exploadingTime--;\r\n    if (ship.exploadingTime === 0) {\r\n      ship = newShip();\r\n    }\r\n  }\r\n\r\n  // Edge of screen\r\n  if (ship.x < 0 - ship.r) {\r\n    ship.x = canvas.width + ship.r;\r\n  } else if (ship.x > canvas.width + ship.r) {\r\n    ship.x = 0 - ship.r;\r\n  }\r\n  if (ship.y < 0 - ship.r) {\r\n    ship.y = canvas.height + ship.r;\r\n  } else if (ship.y > canvas.height + ship.r) {\r\n    ship.y = 0 - ship.r;\r\n  }\r\n\r\n  // Move the asteroids\r\n  for (let i = 0; i < asteroids.length; i++) {\r\n    asteroids[i].x = asteroids[i].x + asteroids[i].xv / 2;\r\n    asteroids[i].y = asteroids[i].y + asteroids[i].yv * 2;\r\n\r\n    // Edge of screen asteroids\r\n    if (asteroids[i].x < 0 - asteroids[i].r) {\r\n      asteroids[i].x = canvas.width + asteroids[i].r;\r\n    } else if (asteroids[i].x > canvas.width + asteroids[i].r) {\r\n      asteroids[i].x = 0 - asteroids[i].r;\r\n    }\r\n    if (asteroids[i].y < 0 - asteroids[i].r) {\r\n      asteroids[i].y = canvas.height + asteroids[i].r;\r\n    } else if (asteroids[i].y > canvas.height + asteroids[i].r) {\r\n      asteroids[i].y = 0 - asteroids[i].r;\r\n    }\r\n  }\r\n}\r\n\r\n// function handleKey(event) {\r\n//   console.log(event.keyCode);\r\n// }\r\n// window.addEventListener("keydown", handleKey);\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsb0JBQW9CO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGtCQUFrQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkIsSUFBSTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkIsSUFBSTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsd0JBQXdCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQix3QkFBd0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQ0FBb0MsUUFBUTtBQUM1QztBQUNBO0FBQ0E7O0FBRUEsd0NBQXdDLFFBQVE7QUFDaEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2Qyw2QkFBNkIsSUFBSTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsVUFBVTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixzQkFBc0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pZiAoXCJzZXJ2aWNlV29ya2VyXCIgaW4gbmF2aWdhdG9yKSB7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKFwic2VydmljZXdvcmtlci5qc1wiKS50aGVuKFxyXG4gICAgICBmdW5jdGlvbiAocmVnaXN0cmF0aW9uKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICBcIlNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN1Y2Nlc3NmdWwgd2l0aCBzY29wZTogXCIsXHJcbiAgICAgICAgICByZWdpc3RyYXRpb24uc2NvcGVcclxuICAgICAgICApO1xyXG4gICAgICB9LFxyXG4gICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQ6IFwiLCBlcnIpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH0pO1xyXG59XHJcbmNvbnNvbGUubG9nKGBpdCB3b3Jrc2ApO1xyXG5cclxuY29uc3QgQVNURVJPSUROVU1CRVIgPSAxMDtcclxuY29uc3QgQVNURVJPSURTSVpFID0gMTAwO1xyXG5jb25zdCBBU1RFUk9JRFNQRUVEID0gNTA7XHJcbmNvbnN0IEFTVEVST0lEVkVSVCA9IDEwO1xyXG5jb25zdCBBU1RFUk9JREpBR0dFTkRFU1MgPSAwLjU7XHJcbmNvbnN0IEJMSU5LID0gMC4xO1xyXG5jb25zdCBGUFMgPSAzMDtcclxuY29uc3QgSU5WSVNJQklMSVRZID0gMztcclxuY29uc3QgTEFTRVJfTUFYID0gMTAwO1xyXG5jb25zdCBMQVNFUl9TUEVFRCA9IDUwMDtcclxuY29uc3QgU0hJUFNJWkUgPSAzMDtcclxuY29uc3QgVFVSTlNQRUVEID0gMjcwO1xyXG5jb25zdCBTSElQRk9SV0FSRCA9IDU7XHJcbmNvbnN0IFNISVBFWFBMT0RFRFVSQVRJT04gPSAxO1xyXG5cclxubGV0IHBhdXNlID0gZmFsc2U7XHJcbmxldCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVDYW52YXNcIik7XHJcbmxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5sZXQgaHVlID0gMDtcclxubGV0IGFzdGVyb2lkcyA9IFtdO1xyXG5sZXQgc2hpcCA9IG5ld1NoaXAoKTtcclxuXHJcbmZ1bmN0aW9uIFNUQVJUKCkge1xyXG4gIHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICBpZiAoIXBhdXNlKSB7XHJcbiAgICAgIFVQREFURSgpO1xyXG4gICAgfVxyXG4gIH0sIDMwKTtcclxufVxyXG5TVEFSVCgpO1xyXG5jcmVhdGVBc3Rlcm9pZHMoKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGtleURvd24pO1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwga2V5VXApO1xyXG5cclxuZnVuY3Rpb24ga2V5RG93bihlKSB7XHJcbiAgaHVlID0gaHVlICsgMTA7XHJcbiAgc3dpdGNoIChlLmtleUNvZGUpIHtcclxuICAgIGNhc2UgMzI6XHJcbiAgICAgIHNob290TGFzZXIoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM3OlxyXG4gICAgICBzaGlwLnJvdGF0ZSA9ICgoVFVSTlNQRUVEIC8gMTgwKSAqIE1hdGguUEkpIC8gRlBTO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMzg6XHJcbiAgICAgIHNoaXAubW92ZUZvcndhcmQgPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMzk6XHJcbiAgICAgIHNoaXAucm90YXRlID0gKCgtVFVSTlNQRUVEIC8gMTgwKSAqIE1hdGguUEkpIC8gRlBTO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgNDA6XHJcbiAgICAgIHNoaXAubW92ZVJldHVybiA9IHRydWU7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSA4MDpcclxuICAgICAgcGF1c2UgPSAhcGF1c2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBrZXlVcChlKSB7XHJcbiAgc3dpdGNoIChlLmtleUNvZGUpIHtcclxuICAgIGNhc2UgMzI6XHJcbiAgICAgIHNoaXAuY2FuU2hvb3QgPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMzc6XHJcbiAgICAgIHNoaXAucm90YXRlID0gMDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM4OlxyXG4gICAgICBzaGlwLm1vdmVGb3J3YXJkID0gZmFsc2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzOTpcclxuICAgICAgc2hpcC5yb3RhdGUgPSAwO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgNDA6XHJcbiAgICAgIHNoaXAubW92ZVJldHVybiA9IGZhbHNlO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQXN0ZXJvaWRzKCkge1xyXG4gIGFzdGVyb2lkcyA9IFtdO1xyXG4gIGxldCB4LCB5O1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgQVNURVJPSUROVU1CRVI7IGkrKykge1xyXG4gICAgZG8ge1xyXG4gICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2FudmFzLndpZHRoKTtcclxuICAgICAgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgfSB3aGlsZSAoc2FmZXR5QnVmZmVyKHNoaXAueCwgc2hpcC55LCB4LCB5KSA8IEFTVEVST0lEU0laRSAqIDIpO1xyXG4gICAgYXN0ZXJvaWRzLnB1c2gobmV3QXN0ZXJvaWQoeCwgeSkpO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBuZXdTaGlwKCkge1xyXG4gIHJldHVybiB7XHJcbiAgICB4OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjYW52YXMud2lkdGgpLFxyXG4gICAgeTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2FudmFzLmhlaWdodCksXHJcbiAgICByOiBTSElQU0laRSAvIDIsXHJcbiAgICBhOiBNYXRoLlBJIC8gMixcclxuICAgIGJsaW5rTnVtOiAzMCxcclxuICAgIGJsaW5rVGltZTogMyxcclxuICAgIGNhblNob290OiB0cnVlLFxyXG4gICAgZXhwbG9hZGluZ1RpbWU6IDAsXHJcbiAgICBmb3J3YXJkOiB7XHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDAsXHJcbiAgICB9LFxyXG4gICAgbGFzZXJzOiBbXSxcclxuICAgIG1vdmVGb3J3YXJkOiBmYWxzZSxcclxuICAgIG1vdmVSZXR1cm46IGZhbHNlLFxyXG4gICAgbW90aW9uOiAwLjcsXHJcbiAgICByb3RhdGU6IDAsXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmV3QXN0ZXJvaWQoeCwgeSkge1xyXG4gIGxldCBhc3Rlcm9pZCA9IHtcclxuICAgIHg6IHgsXHJcbiAgICB5OiB5LFxyXG4gICAgdmVydGljYWxseTogTWF0aC5yYW5kb20oKSAqIDEwICsgQVNURVJPSURWRVJUIC8gMixcclxuICAgIHh2OiAoTWF0aC5yYW5kb20oKSAqIEFTVEVST0lEU1BFRUQpIC8gRlBTIDwgMC41ID8gMSA6IC0xLFxyXG4gICAgeXY6IChNYXRoLnJhbmRvbSgpICogQVNURVJPSURTUEVFRCkgLyBGUFMgPCAwLjUgPyAxIDogLTEsXHJcbiAgICByOiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogQVNURVJPSURTSVpFKSAvIDQpLFxyXG4gICAgYTogTWF0aC5QSSAqIDIsXHJcbiAgICBqYWdnZWRuZXNzOiBbXSxcclxuICB9O1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgQVNURVJPSURWRVJUOyBpKyspIHtcclxuICAgIGFzdGVyb2lkLmphZ2dlZG5lc3MucHVzaChcclxuICAgICAgTWF0aC5yYW5kb20oKSAqIEFTVEVST0lESkFHR0VOREVTUyAqIDIgKyAxIC0gQVNURVJPSURKQUdHRU5ERVNTXHJcbiAgICApO1xyXG4gIH1cclxuICByZXR1cm4gYXN0ZXJvaWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhZmV0eUJ1ZmZlcih4MSwgeTEsIHgyLCB5Mikge1xyXG4gIGxldCBkaXN0YW5zQmV0d2VlblBvaW50cyA9IE1hdGguc3FydChcclxuICAgIE1hdGgucG93KHgyIC0geDEsIDIpICsgTWF0aC5wb3coeTIgLSB5MSwgMilcclxuICApO1xyXG4gIHJldHVybiBkaXN0YW5zQmV0d2VlblBvaW50cztcclxufVxyXG5cclxuZnVuY3Rpb24gZXhwbG9kZVNoaXAoKSB7XHJcbiAgc2hpcC5leHBsb2FkaW5nVGltZSA9IE1hdGguZmxvb3IoU0hJUEVYUExPREVEVVJBVElPTiAqIEZQUyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob290TGFzZXIoKSB7XHJcbiAgaWYgKHNoaXAuY2FuU2hvb3QgJiYgc2hpcC5sYXNlcnMubGVuZ3RoIDwgTEFTRVJfTUFYKSB7XHJcbiAgICBzaGlwLmxhc2Vycy5wdXNoKHtcclxuICAgICAgeDogc2hpcC54ICsgKDQgLyAzKSAqIHNoaXAuciAqIE1hdGguY29zKHNoaXAuYSksXHJcbiAgICAgIHk6IHNoaXAueSAtICg0IC8gMykgKiBzaGlwLnIgKiBNYXRoLnNpbihzaGlwLmEpLFxyXG4gICAgICB4djogKExBU0VSX1NQRUVEICogTWF0aC5jb3Moc2hpcC5hKSkgLyA1MCxcclxuICAgICAgeXY6IC0oTEFTRVJfU1BFRUQgKiBNYXRoLnNpbihzaGlwLmEpKSAvIDUwLFxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHNoaXAuY2FuU2hvb3QgPSBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gVVBEQVRFKCkge1xyXG4gIGxldCBibGlua2luZ09uID0gc2hpcC5ibGlua051bSAlIElOVklTSUJJTElUWSA9PT0gMDtcclxuICBsZXQgZXhwbG9kaW5nID0gc2hpcC5leHBsb2FkaW5nVGltZSA+IDA7XHJcblxyXG4gIC8vIERyYXcgU3BhY2VcclxuICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAvLyBEcmF3IHRoZSBzaGlwXHJcbiAgaWYgKCFleHBsb2RpbmcpIHtcclxuICAgIGlmIChibGlua2luZ09uKSB7XHJcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwid2hpdGVcIjtcclxuICAgICAgY3R4LmxpbmVXaWR0aCA9IFNISVBTSVpFIC8gMTU7XHJcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgY3R4Lm1vdmVUbyhcclxuICAgICAgICBzaGlwLnggKyAoNCAvIDMpICogc2hpcC5yICogTWF0aC5jb3Moc2hpcC5hKSxcclxuICAgICAgICBzaGlwLnkgLSAoNCAvIDMpICogc2hpcC5yICogTWF0aC5zaW4oc2hpcC5hKVxyXG4gICAgICApO1xyXG4gICAgICBjdHgubGluZVRvKFxyXG4gICAgICAgIHNoaXAueCAtIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5jb3Moc2hpcC5hKSArIE1hdGguc2luKHNoaXAuYSkpLFxyXG4gICAgICAgIHNoaXAueSArIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5zaW4oc2hpcC5hKSAtIE1hdGguY29zKHNoaXAuYSkpXHJcbiAgICAgICk7XHJcbiAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAgICAgc2hpcC54IC0gc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLmNvcyhzaGlwLmEpIC0gTWF0aC5zaW4oc2hpcC5hKSksXHJcbiAgICAgICAgc2hpcC55ICsgc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLnNpbihzaGlwLmEpICsgTWF0aC5jb3Moc2hpcC5hKSlcclxuICAgICAgKTtcclxuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQmxpbmtpbmcgT25cclxuICAgIGlmIChzaGlwLmJsaW5rTnVtID4gMCkge1xyXG4gICAgICBzaGlwLmJsaW5rVGltZS0tO1xyXG4gICAgICBpZiAoc2hpcC5ibGlua1RpbWUgPT09IDApIHtcclxuICAgICAgICBzaGlwLmJsaW5rVGltZSA9IE1hdGguZmxvb3IoQkxJTksgKiBGUFMpO1xyXG4gICAgICAgIHNoaXAuYmxpbmtOdW0tLTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRXhwbG9kZSBzaGlwXHJcbiAgZWxzZSB7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHguYXJjKHNoaXAueCwgc2hpcC55LCBzaGlwLnIgKiAxLCA3LCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcInJlZFwiO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyhzaGlwLngsIHNoaXAueSwgc2hpcC5yICogMS40LCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcIm9yYW5nZVwiO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyhzaGlwLngsIHNoaXAueSwgc2hpcC5yICogMS4xLCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcInllbGxvd1wiO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyhzaGlwLngsIHNoaXAueSwgc2hpcC5yICogMC44LCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHguYXJjKHNoaXAueCwgc2hpcC55LCBzaGlwLnIgKiAwLjUsIE1hdGguUEkgKiAyLCBmYWxzZSk7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gTW92ZSBmb3J3YXJkIGluIHNwYWNlXHJcbiAgaWYgKHNoaXAubW92ZUZvcndhcmQpIHtcclxuICAgIHNoaXAuZm9yd2FyZC54ICs9IChTSElQRk9SV0FSRCAqIE1hdGguY29zKHNoaXAuYSkpIC8gMTA7XHJcbiAgICBzaGlwLmZvcndhcmQueSArPSAoU0hJUEZPUldBUkQgKiBNYXRoLnNpbihzaGlwLmEpKSAvIDEwO1xyXG5cclxuICAgIC8vIERyYXcgVHVyYm8gQnVzdGVyXHJcbiAgICBpZiAoIWV4cGxvZGluZyAmJiBibGlua2luZ09uKSB7XHJcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBgaHNsKCR7aHVlfSwgMTAwJSwgNTAlKWA7XHJcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwieWVsbG93XCI7XHJcbiAgICAgIGN0eC5saW5lV2lkdGggPSBTSElQU0laRSAvIDE1O1xyXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgIGN0eC5tb3ZlVG8oXHJcbiAgICAgICAgc2hpcC54IC0gc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLmNvcyhzaGlwLmEpICsgMC43ICogTWF0aC5zaW4oc2hpcC5hKSksXHJcbiAgICAgICAgc2hpcC55ICsgc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLnNpbihzaGlwLmEpIC0gMC43ICogTWF0aC5jb3Moc2hpcC5hKSlcclxuICAgICAgKTtcclxuICAgICAgY3R4LmxpbmVUbyhcclxuICAgICAgICBzaGlwLnggLSBzaGlwLnIgKiAyICogTWF0aC5jb3Moc2hpcC5hKSxcclxuICAgICAgICBzaGlwLnkgKyBzaGlwLnIgKiAyICogTWF0aC5zaW4oc2hpcC5hKVxyXG4gICAgICApO1xyXG4gICAgICBjdHgubGluZVRvKFxyXG4gICAgICAgIHNoaXAueCAtIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5jb3Moc2hpcC5hKSAtIDAuNyAqIE1hdGguc2luKHNoaXAuYSkpLFxyXG4gICAgICAgIHNoaXAueSArIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5zaW4oc2hpcC5hKSArIDAuNyAqIE1hdGguY29zKHNoaXAuYSkpXHJcbiAgICAgICk7XHJcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1vdmUgcmV0dXJuIGluIHNwYWNlXHJcbiAgfSBlbHNlIGlmIChzaGlwLm1vdmVSZXR1cm4gJiYgYmxpbmtpbmdPbikge1xyXG4gICAgc2hpcC5mb3J3YXJkLnkgLT0gKFNISVBGT1JXQVJEICogTWF0aC5zaW4oc2hpcC5hKSkgLyAyMDtcclxuICAgIHNoaXAuZm9yd2FyZC54IC09IChTSElQRk9SV0FSRCAqIE1hdGguY29zKHNoaXAuYSkpIC8gMjA7XHJcblxyXG4gICAgLy8gRHJhdyBidXN0ZXIgaW4gcmV0dXJuXHJcbiAgICBpZiAoIWV4cGxvZGluZykge1xyXG4gICAgICBjdHguZmlsbFN0eWxlID0gYGhzbCgke2h1ZX0sIDEwMCUsIDUwJSlgO1xyXG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcInllbGxvd1wiO1xyXG4gICAgICBjdHgubGluZVdpZHRoID0gU0hJUFNJWkUgLyAxNTtcclxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICBjdHgubW92ZVRvKFxyXG4gICAgICAgIHNoaXAueCAtIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5jb3Moc2hpcC5hKSArIDAuNyAqIE1hdGguc2luKHNoaXAuYSkpLFxyXG4gICAgICAgIHNoaXAueSArIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5zaW4oc2hpcC5hKSAtIDAuNyAqIE1hdGguY29zKHNoaXAuYSkpXHJcbiAgICAgICk7XHJcbiAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAgICAgc2hpcC54IC0gc2hpcC5yICogTWF0aC5jb3Moc2hpcC5hKSxcclxuICAgICAgICBzaGlwLnkgKyBzaGlwLnIgKiBNYXRoLnNpbihzaGlwLmEpXHJcbiAgICAgICk7XHJcbiAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAgICAgc2hpcC54IC0gc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLmNvcyhzaGlwLmEpIC0gMC43ICogTWF0aC5zaW4oc2hpcC5hKSksXHJcbiAgICAgICAgc2hpcC55ICsgc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLnNpbihzaGlwLmEpICsgMC43ICogTWF0aC5jb3Moc2hpcC5hKSlcclxuICAgICAgKTtcclxuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICBjdHguZmlsbCgpO1xyXG4gICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHNoaXAuZm9yd2FyZC54IC09IChzaGlwLm1vdGlvbiAqIHNoaXAuZm9yd2FyZC54KSAvIDU7XHJcbiAgICBzaGlwLmZvcndhcmQueSAtPSAoc2hpcC5tb3Rpb24gKiBzaGlwLmZvcndhcmQueSkgLyA1O1xyXG4gIH1cclxuXHJcbiAgLy8gRHJhdyBMYXNlclxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sYXNlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcIm1hZ2VudGFcIjtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoXHJcbiAgICAgIHNoaXAubGFzZXJzW2ldLngsXHJcbiAgICAgIHNoaXAubGFzZXJzW2ldLnksXHJcbiAgICAgIFNISVBTSVpFIC8gMixcclxuICAgICAgTWF0aC5QSSAqIDIsXHJcbiAgICAgIDAsXHJcbiAgICAgIHRydWVcclxuICAgICk7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gIH1cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGFzZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBzaGlwLmxhc2Vyc1tpXS54ICs9IHNoaXAubGFzZXJzW2ldLnh2O1xyXG4gICAgc2hpcC5sYXNlcnNbaV0ueSArPSBzaGlwLmxhc2Vyc1tpXS55djtcclxuICAgIC8vIGlmIChzaGlwLmxhc2Vyc1tpXS54IDwgMCkge1xyXG4gICAgLy8gICBzaGlwLmxhc2Vyc1tpXS54ID0gY2FudmFzLndpZHRoO1xyXG4gICAgLy8gfSBlbHNlIGlmIChzaGlwLmxhc2Vyc1tpXS54ID4gY2FudmFzLndpZHRoKSB7XHJcbiAgICAvLyAgIHNoaXAubGFzZXJzW2ldLnggPSAwO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gaWYgKHNoaXAubGFzZXJzW2ldLnkgPCAwKSB7XHJcbiAgICAvLyAgIHNoaXAubGFzZXJzW2ldLnkgPSBjYW52YXMuaGVpZ2h0O1xyXG4gICAgLy8gfSBlbHNlIGlmIChzaGlwLmxhc2Vyc1tpXS55ID4gY2FudmFzLmhlaWdodCkge1xyXG4gICAgLy8gICBzaGlwLmxhc2Vyc1tpXS55ID0gMDtcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG4gIC8vIERldGVjdCBsYXNlciBoaXRzIG9uIGFzdGVyb2lkc1xyXG4gIGxldCBhc3Rlcm9pZF94LCBhc3Rlcm9pZF95LCBhc3Rlcm9pZF9yLCBsYXNlcl94LCBsYXNlcl95O1xyXG4gIGZvciAobGV0IGkgPSBhc3Rlcm9pZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgIGFzdGVyb2lkX3ggPSBhc3Rlcm9pZHNbaV0ueDtcclxuICAgIGFzdGVyb2lkX3kgPSBhc3Rlcm9pZHNbaV0ueTtcclxuICAgIGFzdGVyb2lkX3IgPSBhc3Rlcm9pZHNbaV0ucjtcclxuXHJcbiAgICBmb3IgKGxldCBqID0gc2hpcC5sYXNlcnMubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcclxuICAgICAgbGFzZXJfeCA9IHNoaXAubGFzZXJzW2pdLng7XHJcbiAgICAgIGxhc2VyX3kgPSBzaGlwLmxhc2Vyc1tqXS55O1xyXG5cclxuICAgICAgaWYgKHNhZmV0eUJ1ZmZlcihhc3Rlcm9pZF94LCBhc3Rlcm9pZF95LCBsYXNlcl94LCBsYXNlcl95KSA8IGFzdGVyb2lkX3IpIHtcclxuICAgICAgICBzaGlwLmxhc2Vycy5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgYXN0ZXJvaWRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRHJhdyBhc3RlcmlvZHNcclxuICBsZXQgeCwgeSwgciwgYSwgdmVydCwgamFnZ2VkbmVzcztcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFzdGVyb2lkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYGhzbCgke2h1ZX0sIDEwMCUsIDUwJSlgO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IFNISVBTSVpFIC8gMjA7XHJcbiAgICB4ID0gYXN0ZXJvaWRzW2ldLng7XHJcbiAgICB5ID0gYXN0ZXJvaWRzW2ldLnk7XHJcbiAgICBhID0gYXN0ZXJvaWRzW2ldLmE7XHJcbiAgICByID0gYXN0ZXJvaWRzW2ldLnI7XHJcbiAgICB2ZXJ0ID0gYXN0ZXJvaWRzW2ldLnZlcnRpY2FsbHk7XHJcbiAgICBqYWdnZWRuZXNzID0gYXN0ZXJvaWRzW2ldLmphZ2dlZG5lc3M7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKFxyXG4gICAgICB4ICsgciAqIGphZ2dlZG5lc3NbMF0gKiBNYXRoLmNvcyhhKSxcclxuICAgICAgeSArIHIgKiBqYWdnZWRuZXNzWzBdICogTWF0aC5zaW4oYSlcclxuICAgICk7XHJcbiAgICBmb3IgKGxldCBqID0gMTsgaiA8IHZlcnQ7IGorKykge1xyXG4gICAgICBjdHgubGluZVRvKFxyXG4gICAgICAgIHggKyByICogamFnZ2VkbmVzc1tqXSAqIE1hdGguY29zKGEgKyAoaiAqIE1hdGguUEkgKiAyKSAvIHZlcnQpLFxyXG4gICAgICAgIHkgKyByICogamFnZ2VkbmVzc1tqXSAqIE1hdGguc2luKGEgKyAoaiAqIE1hdGguUEkgKiAyKSAvIHZlcnQpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBDaGVjayBmb3IgY29sbGlzaW9uXHJcbiAgaWYgKCFleHBsb2RpbmcpIHtcclxuICAgIGlmIChzaGlwLmJsaW5rTnVtID09PSAwKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXN0ZXJvaWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgc2FmZXR5QnVmZmVyKHNoaXAueCwgc2hpcC55LCBhc3Rlcm9pZHNbaV0ueCwgYXN0ZXJvaWRzW2ldLnkpIDw9XHJcbiAgICAgICAgICBzaGlwLnIgKyBhc3Rlcm9pZHNbaV0uclxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgZXhwbG9kZVNoaXAoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSb3RhdGUgU2hpcFxyXG4gICAgc2hpcC5hID0gc2hpcC5hICsgc2hpcC5yb3RhdGU7XHJcblxyXG4gICAgLy8gTW90aW9uIFNoaXBcclxuICAgIHNoaXAueCA9IHNoaXAueCArIHNoaXAuZm9yd2FyZC54O1xyXG4gICAgc2hpcC55ID0gc2hpcC55IC0gc2hpcC5mb3J3YXJkLnk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNoaXAuZXhwbG9hZGluZ1RpbWUtLTtcclxuICAgIGlmIChzaGlwLmV4cGxvYWRpbmdUaW1lID09PSAwKSB7XHJcbiAgICAgIHNoaXAgPSBuZXdTaGlwKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBFZGdlIG9mIHNjcmVlblxyXG4gIGlmIChzaGlwLnggPCAwIC0gc2hpcC5yKSB7XHJcbiAgICBzaGlwLnggPSBjYW52YXMud2lkdGggKyBzaGlwLnI7XHJcbiAgfSBlbHNlIGlmIChzaGlwLnggPiBjYW52YXMud2lkdGggKyBzaGlwLnIpIHtcclxuICAgIHNoaXAueCA9IDAgLSBzaGlwLnI7XHJcbiAgfVxyXG4gIGlmIChzaGlwLnkgPCAwIC0gc2hpcC5yKSB7XHJcbiAgICBzaGlwLnkgPSBjYW52YXMuaGVpZ2h0ICsgc2hpcC5yO1xyXG4gIH0gZWxzZSBpZiAoc2hpcC55ID4gY2FudmFzLmhlaWdodCArIHNoaXAucikge1xyXG4gICAgc2hpcC55ID0gMCAtIHNoaXAucjtcclxuICB9XHJcblxyXG4gIC8vIE1vdmUgdGhlIGFzdGVyb2lkc1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXN0ZXJvaWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBhc3Rlcm9pZHNbaV0ueCA9IGFzdGVyb2lkc1tpXS54ICsgYXN0ZXJvaWRzW2ldLnh2IC8gMjtcclxuICAgIGFzdGVyb2lkc1tpXS55ID0gYXN0ZXJvaWRzW2ldLnkgKyBhc3Rlcm9pZHNbaV0ueXYgKiAyO1xyXG5cclxuICAgIC8vIEVkZ2Ugb2Ygc2NyZWVuIGFzdGVyb2lkc1xyXG4gICAgaWYgKGFzdGVyb2lkc1tpXS54IDwgMCAtIGFzdGVyb2lkc1tpXS5yKSB7XHJcbiAgICAgIGFzdGVyb2lkc1tpXS54ID0gY2FudmFzLndpZHRoICsgYXN0ZXJvaWRzW2ldLnI7XHJcbiAgICB9IGVsc2UgaWYgKGFzdGVyb2lkc1tpXS54ID4gY2FudmFzLndpZHRoICsgYXN0ZXJvaWRzW2ldLnIpIHtcclxuICAgICAgYXN0ZXJvaWRzW2ldLnggPSAwIC0gYXN0ZXJvaWRzW2ldLnI7XHJcbiAgICB9XHJcbiAgICBpZiAoYXN0ZXJvaWRzW2ldLnkgPCAwIC0gYXN0ZXJvaWRzW2ldLnIpIHtcclxuICAgICAgYXN0ZXJvaWRzW2ldLnkgPSBjYW52YXMuaGVpZ2h0ICsgYXN0ZXJvaWRzW2ldLnI7XHJcbiAgICB9IGVsc2UgaWYgKGFzdGVyb2lkc1tpXS55ID4gY2FudmFzLmhlaWdodCArIGFzdGVyb2lkc1tpXS5yKSB7XHJcbiAgICAgIGFzdGVyb2lkc1tpXS55ID0gMCAtIGFzdGVyb2lkc1tpXS5yO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gZnVuY3Rpb24gaGFuZGxlS2V5KGV2ZW50KSB7XHJcbi8vICAgY29uc29sZS5sb2coZXZlbnQua2V5Q29kZSk7XHJcbi8vIH1cclxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGhhbmRsZUtleSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///0\n')}]);