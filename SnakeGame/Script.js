const board = document.getElementById("board");
const width = 20;
const totalCells = width * width;


for (let i = 0; i < totalCells; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  board.appendChild(cell);
}

const cells = document.querySelectorAll(".cell");
let snake = [210, 209, 208]; // middle start
let foodIndex;
let direction = 1; // right


function drawSnake() {
  snake.forEach(index => {
    cells[index].classList.add("snake");
  });
}

function eraseSnake() {
  snake.forEach(index => {
    cells[index].classList.remove("snake");
  });
}

function drawFood() {
  cells[foodIndex].classList.add("food");
}

function eraseFood() {
  cells[foodIndex].classList.remove("food");
}


function generateFood() {
  do {
    foodIndex = Math.floor(Math.random() * totalCells);
  } while (snake.includes(foodIndex));

  drawFood();
}

function moveSnake() {
  eraseSnake();

  const head = snake[0];
  const newHead = head + direction;

  // wall collision
  if (
    (direction === 1 && head % width === width - 1) ||
    (direction === -1 && head % width === 0) ||
    (direction === width && head + width >= totalCells) ||
    (direction === -width && head - width < 0)
  ) {
    clearInterval(gameInterval);
    alert("Game Over");
    return;
  }

  snake.unshift(newHead);


  if (newHead === foodIndex) {
    eraseFood();
    generateFood();
  } else {
    snake.pop();
  }

  drawSnake();
}


document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" && direction !== -1) direction = 1;
  if (e.key === "ArrowLeft" && direction !== 1) direction = -1;
  if (e.key === "ArrowUp" && direction !== width) direction = -width;
  if (e.key === "ArrowDown" && direction !== -width) direction = width;
});


drawSnake();
generateFood();

let gameInterval = setInterval(moveSnake, 200);
