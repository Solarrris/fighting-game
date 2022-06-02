const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1529.5;
canvas.height = 889;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.4;

// Background Image
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },

  imageSrc: "./img/background.jpg",

  scale: 3.5,
});

// Player initialisation
const player1 = new Fighter({
  position: {
    x: 50,
    y: 0,
  },

  velocity: {
    x: 0,
    y: 0,
  },

  offset: {
    x: 50,
    y: 50,
  },

  imageSrc: "./img/Player1-sheet.png",
  scale: 4.2,
  framesMax: 6,
});

// Enemy initialisation
const player2 = new Fighter({
  position: {
    x: 1200,
    y: 100,
  },

  velocity: {
    x: 0,
    y: 0,
  },

  offset: {
    x: -70,
    y: 50,
  },

  imageSrc: "./img/Player2-sheet.png",
  scale: 4.2,
  framesMax: 6,
});

const keys = {
  q: {
    pressed: false,
  },

  d: {
    pressed: false,
  },

  arrowRight: {
    pressed: false,
  },

  arrowLeft: {
    pressed: false,
  },
};

let lastKey;

function playerCollision(player1, player2) {
  return (
    player1.attackBox.position.x + player1.attackBox.width >=
      player2.position.x &&
    player1.attackBox.position.x <= player2.position.x + player2.width &&
    player1.attackBox.position.y + player1.attackBox.height >=
      player2.position.y &&
    player1.attackBox.position.y <= player2.position.y + player2.height
  );
}

function determineWinner(player1, player2, timeout) {
  clearTimeout(timeout);
  let text = document.getElementById("displayText");
  text.style.display = "flex";
  if (player1.health === player2.health) {
    text.innerHTML = "Tie";
  } else if (player1.health > player2.health) {
    text.innerHTML = "Player 1 Wins";
  } else {
    text.innerHTML = "Player 2 Wins";
  }
}

let timer = 60;
function decreaseTimer() {
  timeout = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.getElementById("timer").innerHTML = timer;
  }

  let text = document.getElementById("displayText");

  if (timer === 0) {
    determineWinner(player1, player2, timeout);
  }
}

decreaseTimer();

function animate() {
  if (player1.health > 0 && player2.health > 0) {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    player1.update();
    player2.update();

    player1.velocity.x = 0;
    player2.velocity.x = 0;

    if (keys.q.pressed && player1.lastKey === "q") {
      player1.velocity.x = -8;
    } else if (keys.d.pressed && player1.lastKey === "d") {
      player1.velocity.x = 8;
    }

    if (keys.arrowLeft.pressed && player2.lastKey === "ArrowLeft") {
      player2.velocity.x = -8;
    } else if (keys.arrowRight.pressed && player2.lastKey === "ArrowRight") {
      player2.velocity.x = 8;
    }

    // Detect collision
    if (player1.isAttacking && playerCollision(player1, player2)) {
      player1.isAttacking = false;
      player2.health -= 20;
      document.getElementById("player2Health").style.width =
        100 - player2.health + "%";
    }

    if (player2.isAttacking && playerCollision(player2, player1)) {
      player2.isAttacking = false;
      player1.health -= 20;
      document.getElementById("player1Health").style.width =
        100 - player1.health + "%";
    }

    // End game
    if (player1.health <= 0 || player2.health <= 0) {
      determineWinner(player1, player2, timeout);
    }
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player1.lastKey = "d";
      break;

    case "q":
      keys.q.pressed = true;
      player1.lastKey = "q";
      break;

    case " ":
      if (player1.onGround) {
        player1.velocity.y = -12;
      }
      break;

    case "ArrowRight":
      keys.arrowRight.pressed = true;
      player2.lastKey = "ArrowRight";
      break;

    case "ArrowLeft":
      keys.arrowLeft.pressed = true;
      player2.lastKey = "ArrowLeft";
      break;

    case "ArrowUp":
      if (player2.onGround) {
        player2.velocity.y = -12;
      }
      break;

    case "Enter":
      if (player2.canAttack) {
        player2.attack();
      }
      break;
  }
});

window.addEventListener("keyup", (event) => {
  //Player1 Keys
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;

    case "q":
      keys.q.pressed = false;
      break;
  }

  // Player2 Keys
  switch (event.key) {
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      break;

    case "ArrowRight":
      keys.arrowRight.pressed = false;
      break;
  }
});

function delayAttack(player) {
  setTimeout(() => {
    player.attack();
    setTimeout(() => {
      player.isAttacking = false;
    }, 50);
  }, 300);
}

window.addEventListener("mousedown", () => {
  if (player1.canAttack) {
    player1.framesElapsed = 0;
    player1.framesCurrent = 0;
    player1.framesMax = 3;
    player1.image.src = "./img/Player1-attack.png";
    delayAttack(player1);
    setTimeout(() => {
      player1.framesElapsed = 0;
      player1.framesCurrent = 0;
      player1.framesMax = 6;
      player1.image.src = "./img/Player1-sheet.png";
    }, 600);
  }
});
