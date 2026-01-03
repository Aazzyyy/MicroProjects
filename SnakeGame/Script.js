const board = document.getElementById("board");
const scoreEl = document.getElementById("current_score");
const highScoreEl = document.getElementById("Heigh_score");
const timeEl = document.getElementById("Time_taken");
const overlay = document.getElementById("overlay");
const restartBtn = document.getElementById("restartBtn");

const size = 20;
const total = size * size;
const speed = 180;
const baseSnake = [210, 209, 208];

let cells = [];
let snake = [];
let food = null;
let dir = 1;
let loop;
let timer;
let startTime;

let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.textContent = highScore;

function build() {
  board.innerHTML = "";
  cells = [];
  for (let i = 0; i < total; i++) {
    const d = document.createElement("div");
    d.className = "cell";
    board.appendChild(d);
    cells.push(d);
  }
}

function draw() {
  snake.forEach(i => cells[i].classList.add("snake"));
}

function clear() {
  snake.forEach(i => cells[i].classList.remove("snake"));
}

function foodSpawn() {
  if (food !== null) cells[food].classList.remove("food");
  do {
    food = Math.floor(Math.random() * total);
  } while (snake.includes(food));
  cells[food].classList.add("food");
}

function scoreUpdate() {
  const s = snake.length - baseSnake.length;
  scoreEl.textContent = s;
  if (s > highScore) {
    highScore = s;
    localStorage.setItem("highScore", highScore);
    highScoreEl.textContent = highScore;
  }
}

function timeUpdate() {
  timeEl.textContent = Math.floor((Date.now() - startTime) / 1000) + "s";
}

function over() {
  clearInterval(loop);
  clearInterval(timer);
  overlay.classList.add("active");
}

function setDir(n) {
  if (dir + n !== 0) dir = n;
}

function step() {
  const head = snake[0];
  const next = head + dir;
  const body = next === food ? snake : snake.slice(0, -1);

  if (
    (dir === 1 && head % size === size - 1) ||
    (dir === -1 && head % size === 0) ||
    (dir === size && next >= total) ||
    (dir === -size && next < 0) ||
    body.includes(next)
  ) {
    over();
    return;
  }

  clear();
  snake.unshift(next);

  if (next === food) {
    foodSpawn();
    scoreUpdate();
  } else {
    snake.pop();
  }

  draw();
}

function start() {
  clearInterval(loop);
  clearInterval(timer);

  overlay.classList.remove("active");

  snake = [...baseSnake];
  dir = 1;

  scoreEl.textContent = "0";
  timeEl.textContent = "0s";
  startTime = Date.now();

  build();
  draw();
  foodSpawn();

  loop = setInterval(step, speed);
  timer = setInterval(timeUpdate, 1000);

  board.focus();
}

let sx = 0;
let sy = 0;

board.addEventListener("pointerdown", e => {
  sx = e.clientX;
  sy = e.clientY;
});

board.addEventListener("pointerup", e => {
  const dx = e.clientX - sx;
  const dy = e.clientY - sy;

  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    dx > 0 ? setDir(1) : setDir(-1);
  } else {
    dy > 0 ? setDir(size) : setDir(-size);
  }
});

window.addEventListener("keydown", e => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
  if (e.key === "ArrowRight") setDir(1);
  if (e.key === "ArrowLeft") setDir(-1);
  if (e.key === "ArrowUp") setDir(-size);
  if (e.key === "ArrowDown") setDir(size);
});

restartBtn.addEventListener("click", start);

start();
