!function(g){var c={};function I(r){if(c[r])return c[r].exports;var n=c[r]={i:r,l:!1,exports:{}};return g[r].call(n.exports,n,n.exports,I),n.l=!0,n.exports}I.m=g,I.c=c,I.d=function(g,c,r){I.o(g,c)||Object.defineProperty(g,c,{enumerable:!0,get:r})},I.r=function(g){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(g,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(g,"__esModule",{value:!0})},I.t=function(g,c){if(1&c&&(g=I(g)),8&c)return g;if(4&c&&"object"==typeof g&&g&&g.__esModule)return g;var r=Object.create(null);if(I.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:g}),2&c&&"string"!=typeof g)for(var n in g)I.d(r,n,function(c){return g[c]}.bind(null,n));return r},I.n=function(g){var c=g&&g.__esModule?function(){return g.default}:function(){return g};return I.d(c,"a",c),c},I.o=function(g,c){return Object.prototype.hasOwnProperty.call(g,c)},I.p="",I(I.s=0)}([function(module,exports,__webpack_require__){"use strict";eval('\r\n\r\nif ("serviceWorker" in navigator) {\r\n  window.addEventListener("load", function() {\r\n    navigator.serviceWorker.register("serviceworker.js").then(\r\n      function(registration) {\r\n        console.log(\r\n          "ServiceWorker registration successful with scope: ",\r\n          registration.scope\r\n        );\r\n      },\r\n      function(err) {\r\n        console.log("ServiceWorker registration failed: ", err);\r\n      }\r\n    );\r\n  });\r\n}\r\n\r\nconsole.log(`it works`);\r\n\r\nconst fps = 30;\r\nconst shipSize = 30;\r\nconst turnSpeed = 270;\r\nconst shipForward = 5;\r\nconst asteroidNumber = 10;\r\nconst asteroidSize = 100;\r\nconst asteroidSpeed = 50;\r\nconst asteroidVert = 10;\r\nconst asteroidJaggedness = 0.5;\r\nconst shipExplodeDuration = 1;\r\n\r\nlet pause = false;\r\nlet canvas = document.getElementById("gameCanvas");\r\nlet ctx = canvas.getContext("2d");\r\nlet hue = 0;\r\nlet asteroids = [];\r\nlet bounding = false;\r\nlet ship = newShip();\r\n\r\nfunction START() {\r\n  window.setInterval(() => {\r\n    if (!pause) {\r\n      UPDATE();\r\n    }\r\n  }, 30);\r\n}\r\nSTART();\r\ncreateAsteroids();\r\n\r\ndocument.addEventListener("keydown", keyDown);\r\ndocument.addEventListener("keyup", keyUp);\r\n\r\nfunction keyDown(e) {\r\n  hue = hue + 10;\r\n  switch (e.keyCode) {\r\n    case 37:\r\n      ship.rotate = ((turnSpeed / 180) * Math.PI) / fps;\r\n      break;\r\n    case 38:\r\n      ship.moveForward = true;\r\n      break;\r\n    case 39:\r\n      ship.rotate = ((-turnSpeed / 180) * Math.PI) / fps;\r\n      break;\r\n    case 40:\r\n      ship.moveReturn = true;\r\n      break;\r\n    case 80:\r\n      pause = !pause;\r\n      break;\r\n    default:\r\n      break;\r\n  }\r\n}\r\n\r\nfunction keyUp(e) {\r\n  switch (e.keyCode) {\r\n    case 37:\r\n      ship.rotate = 0;\r\n      break;\r\n    case 38:\r\n      ship.moveForward = false;\r\n      break;\r\n    case 39:\r\n      ship.rotate = 0;\r\n      break;\r\n    case 40:\r\n      ship.moveReturn = false;\r\n      break;\r\n    default:\r\n      break;\r\n  }\r\n}\r\n\r\nfunction createAsteroids() {\r\n  asteroids = [];\r\n  let x, y;\r\n  for (let i = 0; i < asteroidNumber; i++) {\r\n    do {\r\n      x = Math.floor(Math.random() * canvas.width);\r\n      y = Math.floor(Math.random() * canvas.height);\r\n    } while (safetyBuffer(ship.x, ship.y, x, y) < asteroidSize * 2);\r\n    asteroids.push(newAsteroid(x, y));\r\n  }\r\n}\r\nfunction newShip() {\r\n  return {\r\n    x: Math.floor(Math.random() * canvas.width),\r\n    y: Math.floor(Math.random() * canvas.height),\r\n    retu: Math.floor(Math.random() * -1 * canvas.height),\r\n    r: shipSize / 2,\r\n    a: Math.PI / 2,\r\n    rotate: 0,\r\n    moveForward: false,\r\n    moveReturn: false,\r\n    motion: 0.7,\r\n    exploadingTime: 0,\r\n    forward: {\r\n      x: 0,\r\n      y: 0\r\n    }\r\n  };\r\n}\r\n\r\nfunction newAsteroid(x, y) {\r\n  let asteroid = {\r\n    x: x,\r\n    y: y,\r\n    vertically: Math.random() * 10 + asteroidVert / 2,\r\n    xv: (Math.random() * asteroidSpeed) / fps < 0.5 ? 1 : -1,\r\n    yv: (Math.random() * asteroidSpeed) / fps < 0.5 ? 1 : -1,\r\n    r: Math.floor((Math.random() * asteroidSize) / 4),\r\n    a: Math.PI * 2,\r\n    jaggedness: []\r\n  };\r\n  for (let i = 0; i < asteroidVert; i++) {\r\n    asteroid.jaggedness.push(\r\n      Math.random() * asteroidJaggedness * 2 + 1 - asteroidJaggedness\r\n    );\r\n  }\r\n  return asteroid;\r\n}\r\n\r\nfunction safetyBuffer(x1, y1, x2, y2) {\r\n  let distansBetweenShip = Math.sqrt(\r\n    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)\r\n  );\r\n  return distansBetweenShip;\r\n}\r\n\r\nfunction explodeShip() {\r\n  ship.exploadingTime = Math.floor(shipExplodeDuration * fps);\r\n}\r\n\r\nfunction UPDATE() {\r\n  let exploding = ship.exploadingTime > 0;\r\n\r\n  // Draw Space\r\n  ctx.fillStyle = "black";\r\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\r\n\r\n  // Draw the ship\r\n\r\n  if (!exploding) {\r\n    ctx.strokeStyle = "white";\r\n    ctx.lineWidth = shipSize / 15;\r\n    ctx.beginPath();\r\n    ctx.moveTo(\r\n      ship.x + (4 / 3) * ship.r * Math.cos(ship.a),\r\n      ship.y - (4 / 3) * ship.r * Math.sin(ship.a)\r\n    );\r\n    ctx.lineTo(\r\n      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + Math.sin(ship.a)),\r\n      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - Math.cos(ship.a))\r\n    );\r\n    ctx.lineTo(\r\n      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - Math.sin(ship.a)),\r\n      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + Math.cos(ship.a))\r\n    );\r\n    ctx.closePath();\r\n    ctx.stroke();\r\n  } else {\r\n    ctx.fillStyle = "darkred";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 1, 7, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "red";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 1.4, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "orange";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 1.1, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "yellow";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 0.8, Math.PI * 2, false);\r\n    ctx.fill();\r\n    ctx.fillStyle = "white";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r * 0.5, Math.PI * 2, false);\r\n    ctx.fill();\r\n  }\r\n\r\n  if (bounding) {\r\n    ctx.strokeStyle = "red";\r\n    ctx.beginPath();\r\n    ctx.arc(ship.x, ship.y, ship.r, Math.PI * 2, false);\r\n    ctx.stroke();\r\n  }\r\n\r\n  // Move forward in space\r\n  if (ship.moveForward) {\r\n    ship.forward.x += (shipForward * Math.cos(ship.a)) / 10;\r\n    ship.forward.y += (shipForward * Math.sin(ship.a)) / 10;\r\n\r\n    // Draw Turbo Buster\r\n    if (!exploding) {\r\n      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;\r\n      ctx.strokeStyle = "yellow";\r\n      ctx.lineWidth = shipSize / 15;\r\n      ctx.beginPath();\r\n      ctx.moveTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * 2 * Math.cos(ship.a),\r\n        ship.y + ship.r * 2 * Math.sin(ship.a)\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.closePath();\r\n      ctx.fill();\r\n      ctx.stroke();\r\n    }\r\n\r\n    // Move return in space\r\n  } else if (ship.moveReturn) {\r\n    ship.forward.y -= (shipForward * Math.sin(ship.a)) / 20;\r\n    ship.forward.x -= (shipForward * Math.cos(ship.a)) / 20;\r\n\r\n    // Draw buster in return\r\n    if (!exploding) {\r\n      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;\r\n      ctx.strokeStyle = "yellow";\r\n      ctx.lineWidth = shipSize / 15;\r\n      ctx.beginPath();\r\n      ctx.moveTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * Math.cos(ship.a),\r\n        ship.y + ship.r * Math.sin(ship.a)\r\n      );\r\n      ctx.lineTo(\r\n        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.7 * Math.sin(ship.a)),\r\n        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.7 * Math.cos(ship.a))\r\n      );\r\n      ctx.closePath();\r\n      ctx.fill();\r\n      ctx.stroke();\r\n    }\r\n  } else {\r\n    ship.forward.x -= (ship.motion * ship.forward.x) / 5;\r\n    ship.forward.y -= (ship.motion * ship.forward.y) / 5;\r\n  }\r\n\r\n  // Draw asteriods\r\n  let x, y, r, a, vert, jaggedness;\r\n  for (let i = 0; i < asteroids.length; i++) {\r\n    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;\r\n    ctx.lineWidth = shipSize / 20;\r\n    x = asteroids[i].x;\r\n    y = asteroids[i].y;\r\n    a = asteroids[i].a;\r\n    r = asteroids[i].r;\r\n    vert = asteroids[i].vertically;\r\n    jaggedness = asteroids[i].jaggedness;\r\n    ctx.beginPath();\r\n    ctx.moveTo(\r\n      x + r * jaggedness[0] * Math.cos(a),\r\n      y + r * jaggedness[0] * Math.sin(a)\r\n    );\r\n    for (let j = 1; j < vert; j++) {\r\n      ctx.lineTo(\r\n        x + r * jaggedness[j] * Math.cos(a + (j * Math.PI * 2) / vert),\r\n        y + r * jaggedness[j] * Math.sin(a + (j * Math.PI * 2) / vert)\r\n      );\r\n    }\r\n    ctx.closePath();\r\n    ctx.stroke();\r\n\r\n    if (bounding) {\r\n      ctx.strokeStyle = "red";\r\n      ctx.beginPath();\r\n      ctx.arc(x, y, r, Math.PI * 2, false);\r\n      ctx.stroke();\r\n    }\r\n  }\r\n  // Check for asteroid collision\r\n  if (!exploding) {\r\n    for (let i = 0; i < asteroids.length; i++) {\r\n      if (\r\n        safetyBuffer(ship.x, ship.y, asteroids[i].x, asteroids[i].y) <=\r\n        ship.r + asteroids[i].r\r\n      ) {\r\n        explodeShip();\r\n        console.log("boom");\r\n      }\r\n    }\r\n    // Rotate Ship\r\n    ship.a = ship.a + ship.rotate;\r\n\r\n    // Motion Ship\r\n    ship.x = ship.x + ship.forward.x;\r\n    ship.y = ship.y - ship.forward.y;\r\n  } else {\r\n    ship.exploadingTime--;\r\n    if (ship.exploadingTime === 0) {\r\n      ship = newShip();\r\n    }\r\n    console.log(ship.exploadingTime);\r\n  }\r\n\r\n  // Edge of screen\r\n  if (ship.x < 0 - ship.r) {\r\n    ship.x = canvas.width + ship.r;\r\n  } else if (ship.x > canvas.width + ship.r) {\r\n    ship.x = 0 - ship.r;\r\n  }\r\n  if (ship.y < 0 - ship.r) {\r\n    ship.y = canvas.height + ship.r;\r\n  } else if (ship.y > canvas.height + ship.r) {\r\n    ship.y = 0 - ship.r;\r\n  }\r\n\r\n  // Move the asteroids\r\n  for (let i = 0; i < asteroids.length; i++) {\r\n    asteroids[i].x = asteroids[i].x + asteroids[i].xv / 2;\r\n    asteroids[i].y = asteroids[i].y + asteroids[i].yv * 2;\r\n\r\n    // Edge of screen asteroids\r\n    if (asteroids[i].x < 0 - asteroids[i].r) {\r\n      asteroids[i].x = canvas.width + asteroids[i].r;\r\n    } else if (asteroids[i].x > canvas.width + asteroids[i].r) {\r\n      asteroids[i].x = 0 - asteroids[i].r;\r\n    }\r\n    if (asteroids[i].y < 0 - asteroids[i].r) {\r\n      asteroids[i].y = canvas.height + asteroids[i].r;\r\n    } else if (asteroids[i].y > canvas.height + asteroids[i].r) {\r\n      asteroids[i].y = 0 - asteroids[i].r;\r\n    }\r\n  }\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG9CQUFvQjtBQUNyQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsa0JBQWtCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkIsSUFBSTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkIsSUFBSTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixzQkFBc0I7QUFDdkMsNkJBQTZCLElBQUk7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFVBQVU7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pZiAoXCJzZXJ2aWNlV29ya2VyXCIgaW4gbmF2aWdhdG9yKSB7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoXCJzZXJ2aWNld29ya2VyLmpzXCIpLnRoZW4oXHJcbiAgICAgIGZ1bmN0aW9uKHJlZ2lzdHJhdGlvbikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgXCJTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdWNjZXNzZnVsIHdpdGggc2NvcGU6IFwiLFxyXG4gICAgICAgICAgcmVnaXN0cmF0aW9uLnNjb3BlXHJcbiAgICAgICAgKTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQ6IFwiLCBlcnIpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH0pO1xyXG59XHJcblxyXG5jb25zb2xlLmxvZyhgaXQgd29ya3NgKTtcclxuXHJcbmNvbnN0IGZwcyA9IDMwO1xyXG5jb25zdCBzaGlwU2l6ZSA9IDMwO1xyXG5jb25zdCB0dXJuU3BlZWQgPSAyNzA7XHJcbmNvbnN0IHNoaXBGb3J3YXJkID0gNTtcclxuY29uc3QgYXN0ZXJvaWROdW1iZXIgPSAxMDtcclxuY29uc3QgYXN0ZXJvaWRTaXplID0gMTAwO1xyXG5jb25zdCBhc3Rlcm9pZFNwZWVkID0gNTA7XHJcbmNvbnN0IGFzdGVyb2lkVmVydCA9IDEwO1xyXG5jb25zdCBhc3Rlcm9pZEphZ2dlZG5lc3MgPSAwLjU7XHJcbmNvbnN0IHNoaXBFeHBsb2RlRHVyYXRpb24gPSAxO1xyXG5cclxubGV0IHBhdXNlID0gZmFsc2U7XHJcbmxldCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVDYW52YXNcIik7XHJcbmxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5sZXQgaHVlID0gMDtcclxubGV0IGFzdGVyb2lkcyA9IFtdO1xyXG5sZXQgYm91bmRpbmcgPSBmYWxzZTtcclxubGV0IHNoaXAgPSBuZXdTaGlwKCk7XHJcblxyXG5mdW5jdGlvbiBTVEFSVCgpIHtcclxuICB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgaWYgKCFwYXVzZSkge1xyXG4gICAgICBVUERBVEUoKTtcclxuICAgIH1cclxuICB9LCAzMCk7XHJcbn1cclxuU1RBUlQoKTtcclxuY3JlYXRlQXN0ZXJvaWRzKCk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBrZXlEb3duKTtcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGtleVVwKTtcclxuXHJcbmZ1bmN0aW9uIGtleURvd24oZSkge1xyXG4gIGh1ZSA9IGh1ZSArIDEwO1xyXG4gIHN3aXRjaCAoZS5rZXlDb2RlKSB7XHJcbiAgICBjYXNlIDM3OlxyXG4gICAgICBzaGlwLnJvdGF0ZSA9ICgodHVyblNwZWVkIC8gMTgwKSAqIE1hdGguUEkpIC8gZnBzO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMzg6XHJcbiAgICAgIHNoaXAubW92ZUZvcndhcmQgPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMzk6XHJcbiAgICAgIHNoaXAucm90YXRlID0gKCgtdHVyblNwZWVkIC8gMTgwKSAqIE1hdGguUEkpIC8gZnBzO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgNDA6XHJcbiAgICAgIHNoaXAubW92ZVJldHVybiA9IHRydWU7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSA4MDpcclxuICAgICAgcGF1c2UgPSAhcGF1c2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBrZXlVcChlKSB7XHJcbiAgc3dpdGNoIChlLmtleUNvZGUpIHtcclxuICAgIGNhc2UgMzc6XHJcbiAgICAgIHNoaXAucm90YXRlID0gMDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM4OlxyXG4gICAgICBzaGlwLm1vdmVGb3J3YXJkID0gZmFsc2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzOTpcclxuICAgICAgc2hpcC5yb3RhdGUgPSAwO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgNDA6XHJcbiAgICAgIHNoaXAubW92ZVJldHVybiA9IGZhbHNlO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQXN0ZXJvaWRzKCkge1xyXG4gIGFzdGVyb2lkcyA9IFtdO1xyXG4gIGxldCB4LCB5O1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXN0ZXJvaWROdW1iZXI7IGkrKykge1xyXG4gICAgZG8ge1xyXG4gICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2FudmFzLndpZHRoKTtcclxuICAgICAgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgfSB3aGlsZSAoc2FmZXR5QnVmZmVyKHNoaXAueCwgc2hpcC55LCB4LCB5KSA8IGFzdGVyb2lkU2l6ZSAqIDIpO1xyXG4gICAgYXN0ZXJvaWRzLnB1c2gobmV3QXN0ZXJvaWQoeCwgeSkpO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBuZXdTaGlwKCkge1xyXG4gIHJldHVybiB7XHJcbiAgICB4OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjYW52YXMud2lkdGgpLFxyXG4gICAgeTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2FudmFzLmhlaWdodCksXHJcbiAgICByZXR1OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAtMSAqIGNhbnZhcy5oZWlnaHQpLFxyXG4gICAgcjogc2hpcFNpemUgLyAyLFxyXG4gICAgYTogTWF0aC5QSSAvIDIsXHJcbiAgICByb3RhdGU6IDAsXHJcbiAgICBtb3ZlRm9yd2FyZDogZmFsc2UsXHJcbiAgICBtb3ZlUmV0dXJuOiBmYWxzZSxcclxuICAgIG1vdGlvbjogMC43LFxyXG4gICAgZXhwbG9hZGluZ1RpbWU6IDAsXHJcbiAgICBmb3J3YXJkOiB7XHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDBcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBuZXdBc3Rlcm9pZCh4LCB5KSB7XHJcbiAgbGV0IGFzdGVyb2lkID0ge1xyXG4gICAgeDogeCxcclxuICAgIHk6IHksXHJcbiAgICB2ZXJ0aWNhbGx5OiBNYXRoLnJhbmRvbSgpICogMTAgKyBhc3Rlcm9pZFZlcnQgLyAyLFxyXG4gICAgeHY6IChNYXRoLnJhbmRvbSgpICogYXN0ZXJvaWRTcGVlZCkgLyBmcHMgPCAwLjUgPyAxIDogLTEsXHJcbiAgICB5djogKE1hdGgucmFuZG9tKCkgKiBhc3Rlcm9pZFNwZWVkKSAvIGZwcyA8IDAuNSA/IDEgOiAtMSxcclxuICAgIHI6IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBhc3Rlcm9pZFNpemUpIC8gNCksXHJcbiAgICBhOiBNYXRoLlBJICogMixcclxuICAgIGphZ2dlZG5lc3M6IFtdXHJcbiAgfTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFzdGVyb2lkVmVydDsgaSsrKSB7XHJcbiAgICBhc3Rlcm9pZC5qYWdnZWRuZXNzLnB1c2goXHJcbiAgICAgIE1hdGgucmFuZG9tKCkgKiBhc3Rlcm9pZEphZ2dlZG5lc3MgKiAyICsgMSAtIGFzdGVyb2lkSmFnZ2VkbmVzc1xyXG4gICAgKTtcclxuICB9XHJcbiAgcmV0dXJuIGFzdGVyb2lkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzYWZldHlCdWZmZXIoeDEsIHkxLCB4MiwgeTIpIHtcclxuICBsZXQgZGlzdGFuc0JldHdlZW5TaGlwID0gTWF0aC5zcXJ0KFxyXG4gICAgTWF0aC5wb3coeDIgLSB4MSwgMikgKyBNYXRoLnBvdyh5MiAtIHkxLCAyKVxyXG4gICk7XHJcbiAgcmV0dXJuIGRpc3RhbnNCZXR3ZWVuU2hpcDtcclxufVxyXG5cclxuZnVuY3Rpb24gZXhwbG9kZVNoaXAoKSB7XHJcbiAgc2hpcC5leHBsb2FkaW5nVGltZSA9IE1hdGguZmxvb3Ioc2hpcEV4cGxvZGVEdXJhdGlvbiAqIGZwcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFVQREFURSgpIHtcclxuICBsZXQgZXhwbG9kaW5nID0gc2hpcC5leHBsb2FkaW5nVGltZSA+IDA7XHJcblxyXG4gIC8vIERyYXcgU3BhY2VcclxuICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAvLyBEcmF3IHRoZSBzaGlwXHJcblxyXG4gIGlmICghZXhwbG9kaW5nKSB7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBcIndoaXRlXCI7XHJcbiAgICBjdHgubGluZVdpZHRoID0gc2hpcFNpemUgLyAxNTtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5tb3ZlVG8oXHJcbiAgICAgIHNoaXAueCArICg0IC8gMykgKiBzaGlwLnIgKiBNYXRoLmNvcyhzaGlwLmEpLFxyXG4gICAgICBzaGlwLnkgLSAoNCAvIDMpICogc2hpcC5yICogTWF0aC5zaW4oc2hpcC5hKVxyXG4gICAgKTtcclxuICAgIGN0eC5saW5lVG8oXHJcbiAgICAgIHNoaXAueCAtIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5jb3Moc2hpcC5hKSArIE1hdGguc2luKHNoaXAuYSkpLFxyXG4gICAgICBzaGlwLnkgKyBzaGlwLnIgKiAoKDIgLyAzKSAqIE1hdGguc2luKHNoaXAuYSkgLSBNYXRoLmNvcyhzaGlwLmEpKVxyXG4gICAgKTtcclxuICAgIGN0eC5saW5lVG8oXHJcbiAgICAgIHNoaXAueCAtIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5jb3Moc2hpcC5hKSAtIE1hdGguc2luKHNoaXAuYSkpLFxyXG4gICAgICBzaGlwLnkgKyBzaGlwLnIgKiAoKDIgLyAzKSAqIE1hdGguc2luKHNoaXAuYSkgKyBNYXRoLmNvcyhzaGlwLmEpKVxyXG4gICAgKTtcclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgIGN0eC5zdHJva2UoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiZGFya3JlZFwiO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyhzaGlwLngsIHNoaXAueSwgc2hpcC5yICogMSwgNywgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoc2hpcC54LCBzaGlwLnksIHNoaXAuciAqIDEuNCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJvcmFuZ2VcIjtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoc2hpcC54LCBzaGlwLnksIHNoaXAuciAqIDEuMSwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJ5ZWxsb3dcIjtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoc2hpcC54LCBzaGlwLnksIHNoaXAuciAqIDAuOCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyhzaGlwLngsIHNoaXAueSwgc2hpcC5yICogMC41LCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICB9XHJcblxyXG4gIGlmIChib3VuZGluZykge1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCJyZWRcIjtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoc2hpcC54LCBzaGlwLnksIHNoaXAuciwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIGN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIC8vIE1vdmUgZm9yd2FyZCBpbiBzcGFjZVxyXG4gIGlmIChzaGlwLm1vdmVGb3J3YXJkKSB7XHJcbiAgICBzaGlwLmZvcndhcmQueCArPSAoc2hpcEZvcndhcmQgKiBNYXRoLmNvcyhzaGlwLmEpKSAvIDEwO1xyXG4gICAgc2hpcC5mb3J3YXJkLnkgKz0gKHNoaXBGb3J3YXJkICogTWF0aC5zaW4oc2hpcC5hKSkgLyAxMDtcclxuXHJcbiAgICAvLyBEcmF3IFR1cmJvIEJ1c3RlclxyXG4gICAgaWYgKCFleHBsb2RpbmcpIHtcclxuICAgICAgY3R4LmZpbGxTdHlsZSA9IGBoc2woJHtodWV9LCAxMDAlLCA1MCUpYDtcclxuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJ5ZWxsb3dcIjtcclxuICAgICAgY3R4LmxpbmVXaWR0aCA9IHNoaXBTaXplIC8gMTU7XHJcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgY3R4Lm1vdmVUbyhcclxuICAgICAgICBzaGlwLnggLSBzaGlwLnIgKiAoKDIgLyAzKSAqIE1hdGguY29zKHNoaXAuYSkgKyAwLjcgKiBNYXRoLnNpbihzaGlwLmEpKSxcclxuICAgICAgICBzaGlwLnkgKyBzaGlwLnIgKiAoKDIgLyAzKSAqIE1hdGguc2luKHNoaXAuYSkgLSAwLjcgKiBNYXRoLmNvcyhzaGlwLmEpKVxyXG4gICAgICApO1xyXG4gICAgICBjdHgubGluZVRvKFxyXG4gICAgICAgIHNoaXAueCAtIHNoaXAuciAqIDIgKiBNYXRoLmNvcyhzaGlwLmEpLFxyXG4gICAgICAgIHNoaXAueSArIHNoaXAuciAqIDIgKiBNYXRoLnNpbihzaGlwLmEpXHJcbiAgICAgICk7XHJcbiAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAgICAgc2hpcC54IC0gc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLmNvcyhzaGlwLmEpIC0gMC43ICogTWF0aC5zaW4oc2hpcC5hKSksXHJcbiAgICAgICAgc2hpcC55ICsgc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLnNpbihzaGlwLmEpICsgMC43ICogTWF0aC5jb3Moc2hpcC5hKSlcclxuICAgICAgKTtcclxuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICBjdHguZmlsbCgpO1xyXG4gICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTW92ZSByZXR1cm4gaW4gc3BhY2VcclxuICB9IGVsc2UgaWYgKHNoaXAubW92ZVJldHVybikge1xyXG4gICAgc2hpcC5mb3J3YXJkLnkgLT0gKHNoaXBGb3J3YXJkICogTWF0aC5zaW4oc2hpcC5hKSkgLyAyMDtcclxuICAgIHNoaXAuZm9yd2FyZC54IC09IChzaGlwRm9yd2FyZCAqIE1hdGguY29zKHNoaXAuYSkpIC8gMjA7XHJcblxyXG4gICAgLy8gRHJhdyBidXN0ZXIgaW4gcmV0dXJuXHJcbiAgICBpZiAoIWV4cGxvZGluZykge1xyXG4gICAgICBjdHguZmlsbFN0eWxlID0gYGhzbCgke2h1ZX0sIDEwMCUsIDUwJSlgO1xyXG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcInllbGxvd1wiO1xyXG4gICAgICBjdHgubGluZVdpZHRoID0gc2hpcFNpemUgLyAxNTtcclxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICBjdHgubW92ZVRvKFxyXG4gICAgICAgIHNoaXAueCAtIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5jb3Moc2hpcC5hKSArIDAuNyAqIE1hdGguc2luKHNoaXAuYSkpLFxyXG4gICAgICAgIHNoaXAueSArIHNoaXAuciAqICgoMiAvIDMpICogTWF0aC5zaW4oc2hpcC5hKSAtIDAuNyAqIE1hdGguY29zKHNoaXAuYSkpXHJcbiAgICAgICk7XHJcbiAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAgICAgc2hpcC54IC0gc2hpcC5yICogTWF0aC5jb3Moc2hpcC5hKSxcclxuICAgICAgICBzaGlwLnkgKyBzaGlwLnIgKiBNYXRoLnNpbihzaGlwLmEpXHJcbiAgICAgICk7XHJcbiAgICAgIGN0eC5saW5lVG8oXHJcbiAgICAgICAgc2hpcC54IC0gc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLmNvcyhzaGlwLmEpIC0gMC43ICogTWF0aC5zaW4oc2hpcC5hKSksXHJcbiAgICAgICAgc2hpcC55ICsgc2hpcC5yICogKCgyIC8gMykgKiBNYXRoLnNpbihzaGlwLmEpICsgMC43ICogTWF0aC5jb3Moc2hpcC5hKSlcclxuICAgICAgKTtcclxuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICBjdHguZmlsbCgpO1xyXG4gICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHNoaXAuZm9yd2FyZC54IC09IChzaGlwLm1vdGlvbiAqIHNoaXAuZm9yd2FyZC54KSAvIDU7XHJcbiAgICBzaGlwLmZvcndhcmQueSAtPSAoc2hpcC5tb3Rpb24gKiBzaGlwLmZvcndhcmQueSkgLyA1O1xyXG4gIH1cclxuXHJcbiAgLy8gRHJhdyBhc3RlcmlvZHNcclxuICBsZXQgeCwgeSwgciwgYSwgdmVydCwgamFnZ2VkbmVzcztcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFzdGVyb2lkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYGhzbCgke2h1ZX0sIDEwMCUsIDUwJSlgO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IHNoaXBTaXplIC8gMjA7XHJcbiAgICB4ID0gYXN0ZXJvaWRzW2ldLng7XHJcbiAgICB5ID0gYXN0ZXJvaWRzW2ldLnk7XHJcbiAgICBhID0gYXN0ZXJvaWRzW2ldLmE7XHJcbiAgICByID0gYXN0ZXJvaWRzW2ldLnI7XHJcbiAgICB2ZXJ0ID0gYXN0ZXJvaWRzW2ldLnZlcnRpY2FsbHk7XHJcbiAgICBqYWdnZWRuZXNzID0gYXN0ZXJvaWRzW2ldLmphZ2dlZG5lc3M7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKFxyXG4gICAgICB4ICsgciAqIGphZ2dlZG5lc3NbMF0gKiBNYXRoLmNvcyhhKSxcclxuICAgICAgeSArIHIgKiBqYWdnZWRuZXNzWzBdICogTWF0aC5zaW4oYSlcclxuICAgICk7XHJcbiAgICBmb3IgKGxldCBqID0gMTsgaiA8IHZlcnQ7IGorKykge1xyXG4gICAgICBjdHgubGluZVRvKFxyXG4gICAgICAgIHggKyByICogamFnZ2VkbmVzc1tqXSAqIE1hdGguY29zKGEgKyAoaiAqIE1hdGguUEkgKiAyKSAvIHZlcnQpLFxyXG4gICAgICAgIHkgKyByICogamFnZ2VkbmVzc1tqXSAqIE1hdGguc2luKGEgKyAoaiAqIE1hdGguUEkgKiAyKSAvIHZlcnQpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgaWYgKGJvdW5kaW5nKSB7XHJcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwicmVkXCI7XHJcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgY3R4LmFyYyh4LCB5LCByLCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIENoZWNrIGZvciBhc3Rlcm9pZCBjb2xsaXNpb25cclxuICBpZiAoIWV4cGxvZGluZykge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhc3Rlcm9pZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHNhZmV0eUJ1ZmZlcihzaGlwLngsIHNoaXAueSwgYXN0ZXJvaWRzW2ldLngsIGFzdGVyb2lkc1tpXS55KSA8PVxyXG4gICAgICAgIHNoaXAuciArIGFzdGVyb2lkc1tpXS5yXHJcbiAgICAgICkge1xyXG4gICAgICAgIGV4cGxvZGVTaGlwKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJib29tXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBSb3RhdGUgU2hpcFxyXG4gICAgc2hpcC5hID0gc2hpcC5hICsgc2hpcC5yb3RhdGU7XHJcblxyXG4gICAgLy8gTW90aW9uIFNoaXBcclxuICAgIHNoaXAueCA9IHNoaXAueCArIHNoaXAuZm9yd2FyZC54O1xyXG4gICAgc2hpcC55ID0gc2hpcC55IC0gc2hpcC5mb3J3YXJkLnk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNoaXAuZXhwbG9hZGluZ1RpbWUtLTtcclxuICAgIGlmIChzaGlwLmV4cGxvYWRpbmdUaW1lID09PSAwKSB7XHJcbiAgICAgIHNoaXAgPSBuZXdTaGlwKCk7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhzaGlwLmV4cGxvYWRpbmdUaW1lKTtcclxuICB9XHJcblxyXG4gIC8vIEVkZ2Ugb2Ygc2NyZWVuXHJcbiAgaWYgKHNoaXAueCA8IDAgLSBzaGlwLnIpIHtcclxuICAgIHNoaXAueCA9IGNhbnZhcy53aWR0aCArIHNoaXAucjtcclxuICB9IGVsc2UgaWYgKHNoaXAueCA+IGNhbnZhcy53aWR0aCArIHNoaXAucikge1xyXG4gICAgc2hpcC54ID0gMCAtIHNoaXAucjtcclxuICB9XHJcbiAgaWYgKHNoaXAueSA8IDAgLSBzaGlwLnIpIHtcclxuICAgIHNoaXAueSA9IGNhbnZhcy5oZWlnaHQgKyBzaGlwLnI7XHJcbiAgfSBlbHNlIGlmIChzaGlwLnkgPiBjYW52YXMuaGVpZ2h0ICsgc2hpcC5yKSB7XHJcbiAgICBzaGlwLnkgPSAwIC0gc2hpcC5yO1xyXG4gIH1cclxuXHJcbiAgLy8gTW92ZSB0aGUgYXN0ZXJvaWRzXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhc3Rlcm9pZHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGFzdGVyb2lkc1tpXS54ID0gYXN0ZXJvaWRzW2ldLnggKyBhc3Rlcm9pZHNbaV0ueHYgLyAyO1xyXG4gICAgYXN0ZXJvaWRzW2ldLnkgPSBhc3Rlcm9pZHNbaV0ueSArIGFzdGVyb2lkc1tpXS55diAqIDI7XHJcblxyXG4gICAgLy8gRWRnZSBvZiBzY3JlZW4gYXN0ZXJvaWRzXHJcbiAgICBpZiAoYXN0ZXJvaWRzW2ldLnggPCAwIC0gYXN0ZXJvaWRzW2ldLnIpIHtcclxuICAgICAgYXN0ZXJvaWRzW2ldLnggPSBjYW52YXMud2lkdGggKyBhc3Rlcm9pZHNbaV0ucjtcclxuICAgIH0gZWxzZSBpZiAoYXN0ZXJvaWRzW2ldLnggPiBjYW52YXMud2lkdGggKyBhc3Rlcm9pZHNbaV0ucikge1xyXG4gICAgICBhc3Rlcm9pZHNbaV0ueCA9IDAgLSBhc3Rlcm9pZHNbaV0ucjtcclxuICAgIH1cclxuICAgIGlmIChhc3Rlcm9pZHNbaV0ueSA8IDAgLSBhc3Rlcm9pZHNbaV0ucikge1xyXG4gICAgICBhc3Rlcm9pZHNbaV0ueSA9IGNhbnZhcy5oZWlnaHQgKyBhc3Rlcm9pZHNbaV0ucjtcclxuICAgIH0gZWxzZSBpZiAoYXN0ZXJvaWRzW2ldLnkgPiBjYW52YXMuaGVpZ2h0ICsgYXN0ZXJvaWRzW2ldLnIpIHtcclxuICAgICAgYXN0ZXJvaWRzW2ldLnkgPSAwIC0gYXN0ZXJvaWRzW2ldLnI7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///0\n')}]);