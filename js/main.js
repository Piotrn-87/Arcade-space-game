!function(g){var I={};function c(n){if(I[n])return I[n].exports;var r=I[n]={i:n,l:!1,exports:{}};return g[n].call(r.exports,r,r.exports,c),r.l=!0,r.exports}c.m=g,c.c=I,c.d=function(g,I,n){c.o(g,I)||Object.defineProperty(g,I,{enumerable:!0,get:n})},c.r=function(g){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(g,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(g,"__esModule",{value:!0})},c.t=function(g,I){if(1&I&&(g=c(g)),8&I)return g;if(4&I&&"object"==typeof g&&g&&g.__esModule)return g;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:g}),2&I&&"string"!=typeof g)for(var r in g)c.d(n,r,function(I){return g[I]}.bind(null,r));return n},c.n=function(g){var I=g&&g.__esModule?function(){return g.default}:function(){return g};return c.d(I,"a",I),I},c.o=function(g,I){return Object.prototype.hasOwnProperty.call(g,I)},c.p="",c(c.s=0)}([function(module,exports,__webpack_require__){"use strict";eval('\r\n\r\nif ("serviceWorker" in navigator) {\r\n  window.addEventListener("load", function() {\r\n    navigator.serviceWorker.register("serviceworker.js").then(\r\n      function(registration) {\r\n        console.log(\r\n          "ServiceWorker registration successful with scope: ",\r\n          registration.scope\r\n        );\r\n      },\r\n      function(err) {\r\n        console.log("ServiceWorker registration failed: ", err);\r\n      }\r\n    );\r\n  });\r\n}\r\nconsole.log(`it works`);\r\n\r\nconst FPS = 30;\r\nconst SHIPSIZE = 30;\r\nconst TURNSPEED = 270;\r\nconst SHIPFORWARD = 5;\r\nconst ASTEROIDNUMBER = 30;\r\nconst ASTEROIDSIZE = 100;\r\nconst ASTEROIDSPEED = 50;\r\nconst ASTEROIDVERT = 10;\r\nconst ASTEROIDJAGGENDESS = 0.5;\r\nconst SHIPEXPLODEDURATION = 1;\r\nconst BLINK = 0.1;\r\nconst INVISIBILITY = 3;\r\n\r\nlet pause = false;\r\nlet canvas = document.getElementById("gameCanvas");\r\nlet ctx = canvas.getContext("2d");\r\nlet hue = 0;\r\nlet asteroids = [];\r\nlet ship = newShip();\r\n\r\nfunction START() {\r\n  window.setInterval(() => {\r\n    if (!pause) {\r\n      UPDATE();\r\n    }\r\n  }, 30);\r\n}\r\nSTART();\r\ncreateAsteroids();\r\n\r\ndocument.addEventListener("keydown", keyDown);\r\ndocument.addEventListener("keyup", keyUp);\r\n\r\nfunction keyDown(e) {\r\n  hue = hue + 10;\r\n  switch (e.keyCode) {\r\n    case 37:\r\n      ship.rotate = ((TURNSPEED / 180) * Math.PI) / FPS;\r\n      break;\r\n    case 38:\r\n      ship.moveForward = true;\r\n      break;\r\n    case 39:\r\n      ship.rotate = ((-TURNSPEED / 180) * Math.PI) / FPS;\r\n      break;\r\n    case 40:\r\n      ship.moveReturn = true;\r\n      break;\r\n    case 80:\r\n      pause = !pause;\r\n      break;\r\n    default:\r\n      break;\r\n  }\r\n}\r\n\r\nfunction keyUp(e) {\r\n  switch (e.keyCode) {\r\n    case 37:\r\n      ship.rotate = 0;\r\n      break;\r\n    case 38:\r\n      ship.moveForward = false;\r\n      break;\r\n    case 39:\r\n      ship.rotate = 0;\r\n      break;\r\n    case 40:\r\n      ship.moveReturn = false;\r\n      break;\r\n    default:\r\n      break;\r\n  }\r\n}\r\n\r\nfunction createAsteroids() {\r\n  asteroids = [];\r\n  let x, y;\r\n  for (let i = 0; i < ASTEROIDNUMBER; i++) {\r\n    do {\r\n      x = Math.floor(Math.random() * canvas.width);\r\n      y = Math.floor(Math.random() * canvas.height);\r\n    } while (safetyBuffer(ship.x, ship.y, x, y) < ASTEROIDSIZE * 2);\r\n    asteroids.push(newAsteroid(x, y));\r\n  }\r\n}\r\nfunction newShip() {\r\n  return {\r\n    x: Math.floor(Math.random() * canvas.width),\r\n    y: Math.floor(Math.random() * canvas.height),\r\n    r: SHIPSIZE / 2,\r\n    a: Math.PI / 2,\r\n    blinkNum: 30,\r\n    blinkTime: 3,\r\n    rotate: 0,\r\n    moveForward: false,\r\n    moveReturn: false,\r\n    motion: 0.7,\r\n    exploadingTime: 0,\r\n    forward: {\r\n      x: 0,\r\n      y: 0\r\n    }\r\n  };\r\n}\r\n\r\nfunction newAsteroid(x, y) {\r\n  let asteroid = {\r\n    x: x,\r\n    y: y,\r\n    vertically: Math.random() * 10 + ASTEROIDVERT / 2,\r\n    xv: (Math.random() * ASTEROIDSPEED) / FPS < 0.5 ? 1 : -1,\r\n    yv: (Math.random() * ASTEROIDSPEED) / FPS < 0.5 ? 1 : -1,\r\n    r: Math.floor((Math.random() * ASTEROIDSIZE) / 4),\r\n    a: Math.PI * 2,\r\n    jaggedness: []\r\n  };\r\n  for (let i = 0; i < ASTEROIDVERT; i++) {\r\n    asteroid.jaggedness.push(\r\n      Math.random() * ASTEROIDJAGGENDESS * 2 + 1 - ASTEROIDJAGGENDESS\r\n    );\r\n  }\r\n  return asteroid;\r\n}\r\n\r\nfunction safetyBuffer(x1, y1, x2, y2) {\r\n  let distansBetweenShip = Math.sqrt(\r\n    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)\r\n  );\r\n  return distansBetweenShip;\r\n}\r\n\r\nfunction explodeShip() {\r\n  ship.exploadingTime = Math.floor(SHIPEXPLODEDURATION * FPS);\r\n}\r\n\r\nfunction UPDATE() {\r\n  let blinkingOn = ship.blinkNum % INVISIBILITY === 0;\r\n  let exploding = ship.exploadingTime > 0;\r\n\r\n  // Draw Space\r\n  ctx.fillStyle = "black";\r\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\r\n\r\n  // Draw the ship\r\n  if (!exploding) {\r\n    if (blinkingOn) {\r\n      ctx.strokeStyle = "white";\r\n      ctx.lineWidth = SHIPSIZE / 15;\r\n      ctx.beginPath();\r\n      ctx.moveTo(\r\n        ship.x + (4 / 3) * ship.r * Math.cos(ship.a),\r\n        ship.y - (4 / 3) * ship.r * Math.sin(ship.a)\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - Math.cos(ship.a))\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + Math.cos(ship.a))\r\n      );\r\n      ctx.closePath();\r\n      ctx.stroke();\r\n    }\r\n\r\n    // BlinkingOn\r\n    if (ship.blinkNum > 0) {\r\n      ship.blinkTime--;\r\n      if (ship.blinkTime === 0) {\r\n        ship.blinkTime = Math.floor(BLINK * FPS);\r\n        ship.blinkNum--;\r\n      }\r\n    }\r\n  }\r\n\r\n  // Explode\r\n  else {\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 1, 7, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "red";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 1.4, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "orange";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 1.1, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "yellow";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 0.8, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "white";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 0.5, Math.PI * 2, false);\r\n    ctx.fill();\r\n  }\r\n\r\n  // Move forward in space\r\n  if (ship.moveForward) {\r\n    ship.forward.x += (SHIPFORWARD * Math.cos(ship.a)) / 10;\r\n    ship.forward.y += (SHIPFORWARD * Math.sin(ship.a)) / 10;\r\n\r\n    // Draw Turbo Buster\r\n    if (!exploding) {\r\n      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;\r\n      ctx.strokeStyle = "yellow";\r\n      ctx.lineWidth = SHIPSIZE / 15;\r\n      ctx.beginPath();\r\n      ctx.moveTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * 2 * Math.cos(ship.a),\r\n        ship.y + ship.r * 2 * Math.sin(ship.a)\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.closePath();\r\n      ctx.fill();\r\n      ctx.stroke();\r\n    }\r\n\r\n    // Move return in space\r\n  } else if (ship.moveReturn) {\r\n    ship.forward.y -= (SHIPFORWARD * Math.sin(ship.a)) / 20;\r\n    ship.forward.x -= (SHIPFORWARD * Math.cos(ship.a)) / 20;\r\n\r\n    // Draw buster in return\r\n    if (!exploding) {\r\n      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;\r\n      ctx.strokeStyle = "yellow";\r\n      ctx.lineWidth = SHIPSIZE / 15;\r\n      ctx.beginPath();\r\n      ctx.moveTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * Math.cos(ship.a),\r\n        ship.y + ship.r * Math.sin(ship.a)\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.closePath();\r\n      ctx.fill();\r\n      ctx.stroke();\r\n    }\r\n  } else {\r\n    ship.forward.x -= (ship.motion * ship.forward.x) / 5;\r\n    ship.forward.y -= (ship.motion * ship.forward.y) / 5;\r\n  }\r\n\r\n  // Draw asteriods\r\n  let x, y, r, a, vert, jaggedness;\r\n  for (let i = 0; i < asteroids.length; i++) {\r\n    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;\r\n    ctx.lineWidth = SHIPSIZE / 20;\r\n    x = asteroids[i].x;\r\n    y = asteroids[i].y;\r\n    a = asteroids[i].a;\r\n    r = asteroids[i].r;\r\n    vert = asteroids[i].vertically;\r\n    jaggedness = asteroids[i].jaggedness;\r\n    ctx.beginPath();\r\n    ctx.moveTo(\r\n      x + r * jaggedness[0] * Math.cos(a),\r\n      y + r * jaggedness[0] * Math.sin(a)\r\n    );\r\n    for (let j = 1; j < vert; j++) {\r\n      ctx.lineTo(\r\n        x + r * jaggedness[j] * Math.cos(a + (j * Math.PI * 2) / vert),\r\n        y + r * jaggedness[j] * Math.sin(a + (j * Math.PI * 2) / vert)\r\n      );\r\n    }\r\n    ctx.closePath();\r\n    ctx.stroke();\r\n  }\r\n\r\n  // Check for collision\r\n  if (!exploding) {\r\n    if (ship.blinkNum === 0) {\r\n      for (let i = 0; i < asteroids.length; i++) {\r\n        if (\r\n          safetyBuffer(ship.x, ship.y, asteroids[i].x, asteroids[i].y) <=\r\n          ship.r + asteroids[i].r\r\n        ) {\r\n          explodeShip();\r\n        }\r\n      }\r\n    }\r\n\r\n    // Rotate Ship\r\n    ship.a = ship.a + ship.rotate;\r\n\r\n    // Motion Ship\r\n    ship.x = ship.x + ship.forward.x;\r\n    ship.y = ship.y - ship.forward.y;\r\n  } else {\r\n    ship.exploadingTime--;\r\n    if (ship.exploadingTime === 0) {\r\n      ship = newShip();\r\n    }\r\n  }\r\n\r\n  // Edge of screen\r\n  if (ship.x < 0 - ship.r) {\r\n    ship.x = canvas.width + ship.r;\r\n  } else if (ship.x > canvas.width + ship.r) {\r\n    ship.x = 0 - ship.r;\r\n  }\r\n  if (ship.y < 0 - ship.r) {\r\n    ship.y = canvas.height + ship.r;\r\n  } else if (ship.y > canvas.height + ship.r) {\r\n    ship.y = 0 - ship.r;\r\n  }\r\n\r\n  // Move the asteroids\r\n  for (let i = 0; i < asteroids.length; i++) {\r\n    asteroids[i].x = asteroids[i].x + asteroids[i].xv / 2;\r\n    asteroids[i].y = asteroids[i].y + asteroids[i].yv * 2;\r\n\r\n    // Edge of screen asteroids\r\n    if (asteroids[i].x < 0 - asteroids[i].r) {\r\n      asteroids[i].x = canvas.width + asteroids[i].r;\r\n    } else if (asteroids[i].x > canvas.width + asteroids[i].r) {\r\n      asteroids[i].x = 0 - asteroids[i].r;\r\n    }\r\n    if (asteroids[i].y < 0 - asteroids[i].r) {\r\n      asteroids[i].y = canvas.height + asteroids[i].r;\r\n    } else if (asteroids[i].y > canvas.height + asteroids[i].r) {\r\n      asteroids[i].y = 0 - asteroids[i].r;\r\n    }\r\n  }\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsa0JBQWtCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkJBQTZCLElBQUk7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkJBQTZCLElBQUk7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDLDZCQUE2QixJQUFJO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixVQUFVO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmlmIChcInNlcnZpY2VXb3JrZXJcIiBpbiBuYXZpZ2F0b3IpIHtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihcInNlcnZpY2V3b3JrZXIuanNcIikudGhlbihcclxuICAgICAgZnVuY3Rpb24ocmVnaXN0cmF0aW9uKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICBcIlNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN1Y2Nlc3NmdWwgd2l0aCBzY29wZTogXCIsXHJcbiAgICAgICAgICByZWdpc3RyYXRpb24uc2NvcGVcclxuICAgICAgICApO1xyXG4gICAgICB9LFxyXG4gICAgICBmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogXCIsIGVycik7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfSk7XHJcbn1cclxuY29uc29sZS5sb2coYGl0IHdvcmtzYCk7XHJcblxyXG5jb25zdCBGUFMgPSAzMDtcclxuY29uc3QgU0hJUFNJWkUgPSAzMDtcclxuY29uc3QgVFVSTlNQRUVEID0gMjcwO1xyXG5jb25zdCBTSElQRk9SV0FSRCA9IDU7XHJcbmNvbnN0IEFTVEVST0lETlVNQkVSID0gMzA7XHJcbmNvbnN0IEFTVEVST0lEU0laRSA9IDEwMDtcclxuY29uc3QgQVNURVJPSURTUEVFRCA9IDUwO1xyXG5jb25zdCBBU1RFUk9JRFZFUlQgPSAxMDtcclxuY29uc3QgQVNURVJPSURKQUdHRU5ERVNTID0gMC41O1xyXG5jb25zdCBTSElQRVhQTE9ERURVUkFUSU9OID0gMTtcclxuY29uc3QgQkxJTksgPSAwLjE7XHJcbmNvbnN0IElOVklTSUJJTElUWSA9IDM7XHJcblxyXG5sZXQgcGF1c2UgPSBmYWxzZTtcclxubGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZUNhbnZhc1wiKTtcclxubGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbmxldCBodWUgPSAwO1xyXG5sZXQgYXN0ZXJvaWRzID0gW107XHJcbmxldCBzaGlwID0gbmV3U2hpcCgpO1xyXG5cclxuZnVuY3Rpb24gU1RBUlQoKSB7XHJcbiAgd2luZG93LnNldEludGVydmFsKCgpID0+IHtcclxuICAgIGlmICghcGF1c2UpIHtcclxuICAgICAgVVBEQVRFKCk7XHJcbiAgICB9XHJcbiAgfSwgMzApO1xyXG59XHJcblNUQVJUKCk7XHJcbmNyZWF0ZUFzdGVyb2lkcygpO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwga2V5RG93bik7XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBrZXlVcCk7XHJcblxyXG5mdW5jdGlvbiBrZXlEb3duKGUpIHtcclxuICBodWUgPSBodWUgKyAxMDtcclxuICBzd2l0Y2ggKGUua2V5Q29kZSkge1xyXG4gICAgY2FzZSAzNzpcclxuICAgICAgc2hpcC5yb3RhdGUgPSAoKFRVUk5TUEVFRCAvIDE4MCkgKiBNYXRoLlBJKSAvIEZQUztcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM4OlxyXG4gICAgICBzaGlwLm1vdmVGb3J3YXJkID0gdHJ1ZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM5OlxyXG4gICAgICBzaGlwLnJvdGF0ZSA9ICgoLVRVUk5TUEVFRCAvIDE4MCkgKiBNYXRoLlBJKSAvIEZQUztcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDQwOlxyXG4gICAgICBzaGlwLm1vdmVSZXR1cm4gPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgODA6XHJcbiAgICAgIHBhdXNlID0gIXBhdXNlO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24ga2V5VXAoZSkge1xyXG4gIHN3aXRjaCAoZS5rZXlDb2RlKSB7XHJcbiAgICBjYXNlIDM3OlxyXG4gICAgICBzaGlwLnJvdGF0ZSA9IDA7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzODpcclxuICAgICAgc2hpcC5tb3ZlRm9yd2FyZCA9IGZhbHNlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMzk6XHJcbiAgICAgIHNoaXAucm90YXRlID0gMDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDQwOlxyXG4gICAgICBzaGlwLm1vdmVSZXR1cm4gPSBmYWxzZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUFzdGVyb2lkcygpIHtcclxuICBhc3Rlcm9pZHMgPSBbXTtcclxuICBsZXQgeCwgeTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IEFTVEVST0lETlVNQkVSOyBpKyspIHtcclxuICAgIGRvIHtcclxuICAgICAgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNhbnZhcy53aWR0aCk7XHJcbiAgICAgIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjYW52YXMuaGVpZ2h0KTtcclxuICAgIH0gd2hpbGUgKHNhZmV0eUJ1ZmZlcihzaGlwLngsIHNoaXAueSwgeCwgeSkgPCBBU1RFUk9JRFNJWkUgKiAyKTtcclxuICAgIGFzdGVyb2lkcy5wdXNoKG5ld0FzdGVyb2lkKHgsIHkpKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gbmV3U2hpcCgpIHtcclxuICByZXR1cm4ge1xyXG4gICAgeDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2FudmFzLndpZHRoKSxcclxuICAgIHk6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNhbnZhcy5oZWlnaHQpLFxyXG4gICAgcjogU0hJUFNJWkUgLyAyLFxyXG4gICAgYTogTWF0aC5QSSAvIDIsXHJcbiAgICBibGlua051bTogMzAsXHJcbiAgICBibGlua1RpbWU6IDMsXHJcbiAgICByb3RhdGU6IDAsXHJcbiAgICBtb3ZlRm9yd2FyZDogZmFsc2UsXHJcbiAgICBtb3ZlUmV0dXJuOiBmYWxzZSxcclxuICAgIG1vdGlvbjogMC43LFxyXG4gICAgZXhwbG9hZGluZ1RpbWU6IDAsXHJcbiAgICBmb3J3YXJkOiB7XHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDBcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBuZXdBc3Rlcm9pZCh4LCB5KSB7XHJcbiAgbGV0IGFzdGVyb2lkID0ge1xyXG4gICAgeDogeCxcclxuICAgIHk6IHksXHJcbiAgICB2ZXJ0aWNhbGx5OiBNYXRoLnJhbmRvbSgpICogMTAgKyBBU1RFUk9JRFZFUlQgLyAyLFxyXG4gICAgeHY6IChNYXRoLnJhbmRvbSgpICogQVNURVJPSURTUEVFRCkgLyBGUFMgPCAwLjUgPyAxIDogLTEsXHJcbiAgICB5djogKE1hdGgucmFuZG9tKCkgKiBBU1RFUk9JRFNQRUVEKSAvIEZQUyA8IDAuNSA/IDEgOiAtMSxcclxuICAgIHI6IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBBU1RFUk9JRFNJWkUpIC8gNCksXHJcbiAgICBhOiBNYXRoLlBJICogMixcclxuICAgIGphZ2dlZG5lc3M6IFtdXHJcbiAgfTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IEFTVEVST0lEVkVSVDsgaSsrKSB7XHJcbiAgICBhc3Rlcm9pZC5qYWdnZWRuZXNzLnB1c2goXHJcbiAgICAgIE1hdGgucmFuZG9tKCkgKiBBU1RFUk9JREpBR0dFTkRFU1MgKiAyICsgMSAtIEFTVEVST0lESkFHR0VOREVTU1xyXG4gICAgKTtcclxuICB9XHJcbiAgcmV0dXJuIGFzdGVyb2lkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzYWZldHlCdWZmZXIoeDEsIHkxLCB4MiwgeTIpIHtcclxuICBsZXQgZGlzdGFuc0JldHdlZW5TaGlwID0gTWF0aC5zcXJ0KFxyXG4gICAgTWF0aC5wb3coeDIgLSB4MSwgMikgKyBNYXRoLnBvdyh5MiAtIHkxLCAyKVxyXG4gICk7XHJcbiAgcmV0dXJuIGRpc3RhbnNCZXR3ZWVuU2hpcDtcclxufVxyXG5cclxuZnVuY3Rpb24gZXhwbG9kZVNoaXAoKSB7XHJcbiAgc2hpcC5leHBsb2FkaW5nVGltZSA9IE1hdGguZmxvb3IoU0hJUEVYUExPREVEVVJBVElPTiAqIEZQUyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFVQREFURSgpIHtcclxuICBsZXQgYmxpbmtpbmdPbiA9IHNoaXAuYmxpbmtOdW0gJSBJTlZJU0lCSUxJVFkgPT09IDA7XHJcbiAgbGV0IGV4cGxvZGluZyA9IHNoaXAuZXhwbG9hZGluZ1RpbWUgPiAwO1xyXG5cclxuICAvLyBEcmF3IFNwYWNlXHJcbiAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgLy8gRHJhdyB0aGUgc2hpcFxyXG4gIGlmICghZXhwbG9kaW5nKSB7XHJcbiAgICBpZiAoYmxpbmtpbmdPbikge1xyXG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcIndoaXRlXCI7XHJcbiAgICAgIGN0eC5saW5lV2lkdGggPSBTSElQU0laRSAvIDE1O1xyXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgIGN0eC5tb3ZlVG8oXHJcbiAgICAgICAgc2hpcC54ICsgKDQgLyAzKSAqIHNoaXAuciAqIE1hdGguY29zKHNoaXAuYSksXHJcbiAgICAgICAgc2hpcC55IC0gKDQgLyAzKSAqIHNoaXAuciAqIE1hdGguc2luKHNoaXAuYSlcclxuICAgICAgKTtcclxuICAgICAgY3R4LmxpbmVUbyhcclxuICAgICAgICBzaGlwLnggLSBzaGlwLnIgKiAoKDIgLyAzKSAqIE1hdGguY29zKHNoaXAuYSkgKyBNYXRoLnNpbihzaGlwLmEpKSxcclxuICAgICAgICBzaGlwLnkgKyBzaGlwLnIgKiAoKDIgLyAzKSAqIE1hdGguc2luKHNoaXAuYSkgLSBNYXRoLmNvcyhzaGlwLmEpKVxyXG4gICAgICApO1xyXG4gICAgICBjdHgubGluZVRvKFxyXG4gICAgICAgIHNoaXAueCAtIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5jb3Moc2hpcC5hKSAtIE1hdGguc2luKHNoaXAuYSkpLFxyXG4gICAgICAgIHNoaXAueSArIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5zaW4oc2hpcC5hKSArIE1hdGguY29zKHNoaXAuYSkpXHJcbiAgICAgICk7XHJcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEJsaW5raW5nT25cclxuICAgIGlmIChzaGlwLmJsaW5rTnVtID4gMCkge1xyXG4gICAgICBzaGlwLmJsaW5rVGltZS0tO1xyXG4gICAgICBpZiAoc2hpcC5ibGlua1RpbWUgPT09IDApIHtcclxuICAgICAgICBzaGlwLmJsaW5rVGltZSA9IE1hdGguZmxvb3IoQkxJTksgKiBGUFMpO1xyXG4gICAgICAgIHNoaXAuYmxpbmtOdW0tLTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRXhwbG9kZVxyXG4gIGVsc2Uge1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyhzaGlwLngsIHNoaXAueSwgc2hpcC5yICogMSwgNywgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoc2hpcC54LCBzaGlwLnksIHNoaXAuciAqIDEuNCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJvcmFuZ2VcIjtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoc2hpcC54LCBzaGlwLnksIHNoaXAuciAqIDEuMSwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJ5ZWxsb3dcIjtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoc2hpcC54LCBzaGlwLnksIHNoaXAuciAqIDAuOCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyhzaGlwLngsIHNoaXAueSwgc2hpcC5yICogMC41LCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICB9XHJcblxyXG4gIC8vIE1vdmUgZm9yd2FyZCBpbiBzcGFjZVxyXG4gIGlmIChzaGlwLm1vdmVGb3J3YXJkKSB7XHJcbiAgICBzaGlwLmZvcndhcmQueCArPSAoU0hJUEZPUldBUkQgKiBNYXRoLmNvcyhzaGlwLmEpKSAvIDEwO1xyXG4gICAgc2hpcC5mb3J3YXJkLnkgKz0gKFNISVBGT1JXQVJEICogTWF0aC5zaW4oc2hpcC5hKSkgLyAxMDtcclxuXHJcbiAgICAvLyBEcmF3IFR1cmJvIEJ1c3RlclxyXG4gICAgaWYgKCFleHBsb2RpbmcpIHtcclxuICAgICAgY3R4LmZpbGxTdHlsZSA9IGBoc2woJHtodWV9LCAxMDAlLCA1MCUpYDtcclxuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJ5ZWxsb3dcIjtcclxuICAgICAgY3R4LmxpbmVXaWR0aCA9IFNISVBTSVpFIC8gMTU7XHJcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgY3R4Lm1vdmVUbyhcclxuICAgICAgICBzaGlwLnggLSBzaGlwLnIgKiAoKDIgLyAzKSAqIE1hdGguY29zKHNoaXAuYSkgKyAwLjcgKiBNYXRoLnNpbihzaGlwLmEpKSxcclxuICAgICAgICBzaGlwLnkgKyBzaGlwLnIgKiAoKDIgLyAzKSAqIE1hdGguc2luKHNoaXAuYSkgLSAwLjcgKiBNYXRoLmNvcyhzaGlwLmEpKVxyXG4gICAgICApO1xyXG4gICAgICBjdHgubGluZVRvKFxyXG4gICAgICAgIHNoaXAueCAtIHNoaXAuciAqIDIgKiBNYXRoLmNvcyhzaGlwLmEpLFxyXG4gICAgICAgIHNoaXAueSArIHNoaXAuciAqIDIgKiBNYXRoLnNpbihzaGlwLmEpXHJcbiAgICAgICk7XHJcbiAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAgICAgc2hpcC54IC0gc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLmNvcyhzaGlwLmEpIC0gMC43ICogTWF0aC5zaW4oc2hpcC5hKSksXHJcbiAgICAgICAgc2hpcC55ICsgc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLnNpbihzaGlwLmEpICsgMC43ICogTWF0aC5jb3Moc2hpcC5hKSlcclxuICAgICAgKTtcclxuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICBjdHguZmlsbCgpO1xyXG4gICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTW92ZSByZXR1cm4gaW4gc3BhY2VcclxuICB9IGVsc2UgaWYgKHNoaXAubW92ZVJldHVybikge1xyXG4gICAgc2hpcC5mb3J3YXJkLnkgLT0gKFNISVBGT1JXQVJEICogTWF0aC5zaW4oc2hpcC5hKSkgLyAyMDtcclxuICAgIHNoaXAuZm9yd2FyZC54IC09IChTSElQRk9SV0FSRCAqIE1hdGguY29zKHNoaXAuYSkpIC8gMjA7XHJcblxyXG4gICAgLy8gRHJhdyBidXN0ZXIgaW4gcmV0dXJuXHJcbiAgICBpZiAoIWV4cGxvZGluZykge1xyXG4gICAgICBjdHguZmlsbFN0eWxlID0gYGhzbCgke2h1ZX0sIDEwMCUsIDUwJSlgO1xyXG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcInllbGxvd1wiO1xyXG4gICAgICBjdHgubGluZVdpZHRoID0gU0hJUFNJWkUgLyAxNTtcclxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICBjdHgubW92ZVRvKFxyXG4gICAgICAgIHNoaXAueCAtIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5jb3Moc2hpcC5hKSArIDAuNyAqIE1hdGguc2luKHNoaXAuYSkpLFxyXG4gICAgICAgIHNoaXAueSArIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5zaW4oc2hpcC5hKSAtIDAuNyAqIE1hdGguY29zKHNoaXAuYSkpXHJcbiAgICAgICk7XHJcbiAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAgICAgc2hpcC54IC0gc2hpcC5yICogTWF0aC5jb3Moc2hpcC5hKSxcclxuICAgICAgICBzaGlwLnkgKyBzaGlwLnIgKiBNYXRoLnNpbihzaGlwLmEpXHJcbiAgICAgICk7XHJcbiAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAgICAgc2hpcC54IC0gc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLmNvcyhzaGlwLmEpIC0gMC43ICogTWF0aC5zaW4oc2hpcC5hKSksXHJcbiAgICAgICAgc2hpcC55ICsgc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLnNpbihzaGlwLmEpICsgMC43ICogTWF0aC5jb3Moc2hpcC5hKSlcclxuICAgICAgKTtcclxuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICBjdHguZmlsbCgpO1xyXG4gICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHNoaXAuZm9yd2FyZC54IC09IChzaGlwLm1vdGlvbiAqIHNoaXAuZm9yd2FyZC54KSAvIDU7XHJcbiAgICBzaGlwLmZvcndhcmQueSAtPSAoc2hpcC5tb3Rpb24gKiBzaGlwLmZvcndhcmQueSkgLyA1O1xyXG4gIH1cclxuXHJcbiAgLy8gRHJhdyBhc3RlcmlvZHNcclxuICBsZXQgeCwgeSwgciwgYSwgdmVydCwgamFnZ2VkbmVzcztcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFzdGVyb2lkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYGhzbCgke2h1ZX0sIDEwMCUsIDUwJSlgO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IFNISVBTSVpFIC8gMjA7XHJcbiAgICB4ID0gYXN0ZXJvaWRzW2ldLng7XHJcbiAgICB5ID0gYXN0ZXJvaWRzW2ldLnk7XHJcbiAgICBhID0gYXN0ZXJvaWRzW2ldLmE7XHJcbiAgICByID0gYXN0ZXJvaWRzW2ldLnI7XHJcbiAgICB2ZXJ0ID0gYXN0ZXJvaWRzW2ldLnZlcnRpY2FsbHk7XHJcbiAgICBqYWdnZWRuZXNzID0gYXN0ZXJvaWRzW2ldLmphZ2dlZG5lc3M7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKFxyXG4gICAgICB4ICsgciAqIGphZ2dlZG5lc3NbMF0gKiBNYXRoLmNvcyhhKSxcclxuICAgICAgeSArIHIgKiBqYWdnZWRuZXNzWzBdICogTWF0aC5zaW4oYSlcclxuICAgICk7XHJcbiAgICBmb3IgKGxldCBqID0gMTsgaiA8IHZlcnQ7IGorKykge1xyXG4gICAgICBjdHgubGluZVRvKFxyXG4gICAgICAgIHggKyByICogamFnZ2VkbmVzc1tqXSAqIE1hdGguY29zKGEgKyAoaiAqIE1hdGguUEkgKiAyKSAvIHZlcnQpLFxyXG4gICAgICAgIHkgKyByICogamFnZ2VkbmVzc1tqXSAqIE1hdGguc2luKGEgKyAoaiAqIE1hdGguUEkgKiAyKSAvIHZlcnQpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBDaGVjayBmb3IgY29sbGlzaW9uXHJcbiAgaWYgKCFleHBsb2RpbmcpIHtcclxuICAgIGlmIChzaGlwLmJsaW5rTnVtID09PSAwKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXN0ZXJvaWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgc2FmZXR5QnVmZmVyKHNoaXAueCwgc2hpcC55LCBhc3Rlcm9pZHNbaV0ueCwgYXN0ZXJvaWRzW2ldLnkpIDw9XHJcbiAgICAgICAgICBzaGlwLnIgKyBhc3Rlcm9pZHNbaV0uclxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgZXhwbG9kZVNoaXAoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSb3RhdGUgU2hpcFxyXG4gICAgc2hpcC5hID0gc2hpcC5hICsgc2hpcC5yb3RhdGU7XHJcblxyXG4gICAgLy8gTW90aW9uIFNoaXBcclxuICAgIHNoaXAueCA9IHNoaXAueCArIHNoaXAuZm9yd2FyZC54O1xyXG4gICAgc2hpcC55ID0gc2hpcC55IC0gc2hpcC5mb3J3YXJkLnk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNoaXAuZXhwbG9hZGluZ1RpbWUtLTtcclxuICAgIGlmIChzaGlwLmV4cGxvYWRpbmdUaW1lID09PSAwKSB7XHJcbiAgICAgIHNoaXAgPSBuZXdTaGlwKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBFZGdlIG9mIHNjcmVlblxyXG4gIGlmIChzaGlwLnggPCAwIC0gc2hpcC5yKSB7XHJcbiAgICBzaGlwLnggPSBjYW52YXMud2lkdGggKyBzaGlwLnI7XHJcbiAgfSBlbHNlIGlmIChzaGlwLnggPiBjYW52YXMud2lkdGggKyBzaGlwLnIpIHtcclxuICAgIHNoaXAueCA9IDAgLSBzaGlwLnI7XHJcbiAgfVxyXG4gIGlmIChzaGlwLnkgPCAwIC0gc2hpcC5yKSB7XHJcbiAgICBzaGlwLnkgPSBjYW52YXMuaGVpZ2h0ICsgc2hpcC5yO1xyXG4gIH0gZWxzZSBpZiAoc2hpcC55ID4gY2FudmFzLmhlaWdodCArIHNoaXAucikge1xyXG4gICAgc2hpcC55ID0gMCAtIHNoaXAucjtcclxuICB9XHJcblxyXG4gIC8vIE1vdmUgdGhlIGFzdGVyb2lkc1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXN0ZXJvaWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBhc3Rlcm9pZHNbaV0ueCA9IGFzdGVyb2lkc1tpXS54ICsgYXN0ZXJvaWRzW2ldLnh2IC8gMjtcclxuICAgIGFzdGVyb2lkc1tpXS55ID0gYXN0ZXJvaWRzW2ldLnkgKyBhc3Rlcm9pZHNbaV0ueXYgKiAyO1xyXG5cclxuICAgIC8vIEVkZ2Ugb2Ygc2NyZWVuIGFzdGVyb2lkc1xyXG4gICAgaWYgKGFzdGVyb2lkc1tpXS54IDwgMCAtIGFzdGVyb2lkc1tpXS5yKSB7XHJcbiAgICAgIGFzdGVyb2lkc1tpXS54ID0gY2FudmFzLndpZHRoICsgYXN0ZXJvaWRzW2ldLnI7XHJcbiAgICB9IGVsc2UgaWYgKGFzdGVyb2lkc1tpXS54ID4gY2FudmFzLndpZHRoICsgYXN0ZXJvaWRzW2ldLnIpIHtcclxuICAgICAgYXN0ZXJvaWRzW2ldLnggPSAwIC0gYXN0ZXJvaWRzW2ldLnI7XHJcbiAgICB9XHJcbiAgICBpZiAoYXN0ZXJvaWRzW2ldLnkgPCAwIC0gYXN0ZXJvaWRzW2ldLnIpIHtcclxuICAgICAgYXN0ZXJvaWRzW2ldLnkgPSBjYW52YXMuaGVpZ2h0ICsgYXN0ZXJvaWRzW2ldLnI7XHJcbiAgICB9IGVsc2UgaWYgKGFzdGVyb2lkc1tpXS55ID4gY2FudmFzLmhlaWdodCArIGFzdGVyb2lkc1tpXS5yKSB7XHJcbiAgICAgIGFzdGVyb2lkc1tpXS55ID0gMCAtIGFzdGVyb2lkc1tpXS5yO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n')}]);