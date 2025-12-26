const board = document.getElementById("board");
const scoreEl = document.getElementById("current_score");
const highScoreEl = document.getElementById("Heigh_score");
const timeEl = document.getElementById("Time_taken");
const overlay = document.getElementById("overlay");

const width = 20;
const totalCells = width * width;
const speed = 180;
const initialSnake = [210, 209, 208];

let cells = [];
let snake = [];
let foodIndex;
let direction = 1;
let gameInterval;
let timeInterval;
let startTime;
let paused = false;

let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.textContent = highScore;

function createBoard() {
  board.innerHTML = "";
  cells = [];
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
    cells.push(cell);
  }
}

function drawSnake() {
  snake.forEach(i => cells[i].classList.add("snake"));
}

function eraseSnake() {
  snake.forEach(i => cells[i].classList.remove("snake"));
}

function generateFood() {
  do {
    foodIndex = Math.floor(Math.random() * totalCells);
  } while (snake.includes(foodIndex));
  cells[foodIndex].classList.add("food");
}

function eraseFood() {
  cells[foodIndex]?.classList.remove("food");
}

function updateScore() {
  const score = snake.length - initialSnake.length;
  scoreEl.textContent = score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreEl.textContent = highScore;
  }
}

function updateTime() {
  timeEl.textContent = Math.floor((Date.now() - startTime) / 1000) + "s";
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timeInterval);
  overlay.classList.add("active");
}

function moveSnake() {
  if (paused) return;

  const head = snake[0];
  const newHead = head + direction;

  if (
    (direction === 1 && head % width === width - 1) ||
    (direction === -1 && head % width === 0) ||
    (direction === width && newHead >= totalCells) ||
    (direction === -width && newHead < 0) ||
    snake.includes(newHead)
  ) {
    endGame();
    return;
  }

  eraseSnake();
  snake.unshift(newHead);

  if (newHead === foodIndex) {
    eraseFood();
    generateFood();
    updateScore();
  } else {
    snake.pop();
  }

  drawSnake();
}

function moveSnakeTouch(){
  let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && direction !== -1) direction = 1;
    if (diffX < 0 && direction !== 1) direction = -1;
  } else {
    if (diffY > 0 && direction !== -width) direction = width;
    if (diffY < 0 && direction !== width) direction = -width;
  }
});
}

function startGame() {
  clearInterval(gameInterval);
  clearInterval(timeInterval);

  overlay.classList.remove("active");

  snake = [...initialSnake];
  direction = 1;
  paused = false;

  scoreEl.textContent = "0";
  timeEl.textContent = "0s";
  startTime = Date.now();

  createBoard();
  drawSnake();
  generateFood();

  gameInterval = setInterval(moveSnake, speed);
  timeInterval = setInterval(updateTime, 1000);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" && direction !== -1) direction = 1;
  if (e.key === "ArrowLeft" && direction !== 1) direction = -1;
  if (e.key === "ArrowUp" && direction !== width) direction = -width;
  if (e.key === "ArrowDown" && direction !== -width) direction = width;

  if ((e.key === "Enter" || e.key === " ") && overlay.classList.contains("active")) {
    startGame();
  }
});

startGame();
