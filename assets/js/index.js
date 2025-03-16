const gameMusic = document.querySelector(".gameMusic");
const startMusicButton = document.querySelector(".startMusic");
const stopMusicButton = document.querySelector(".stopMusic");
const turnMessage = document.querySelector(".turnMessage");

const gridSize = 10;
const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
let playerGrids = [
  Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0)),
  Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0)),
];
let hits = [0, 0];
let currentPlayer = 0;

gameMusic.volume = 0.5; // Громкость музыки

let musicStarted = false; // Флаг для отслеживания запуска музыки


startMusicButton.addEventListener("click", () => {
  if (!musicStarted) {
    gameMusic.play();
    musicStarted = true;
  }
});

stopMusicButton.addEventListener("click", () => {
  if (musicStarted) {
    gameMusic.pause();
    musicStarted = false;
  }
});

// Функция обновления сообщения о текущем ходе
function updateTurnMessage() {
  turnMessage.innerText = `Ход игрока ${
    currentPlayer + 1
  }`;
}

// Функция размещения кораблей на поле игрока
function placeShips(player) {
  for (let size of shipSizes) {
    let placed = false;
    while (!placed) {
      let x = Math.floor(Math.random() * gridSize);
      let y = Math.floor(Math.random() * gridSize);
      let direction = Math.random() > 0.5 ? "H" : "V"; // Горизонтальное или вертикальное размещение
      if (canPlaceShip(x, y, size, direction, player)) {
        placeShip(x, y, size, direction, player);
        placed = true;
      }
    }
  }
}

// Проверка возможности размещения корабля в заданных координатах
function canPlaceShip(x, y, size, direction, player) {
  if (direction === "H" && x + size > gridSize) return false;
  if (direction === "V" && y + size > gridSize) return false;
  for (let i = 0; i < size; i++) {
    if (direction === "H" && playerGrids[player][y][x + i] !== 0) return false;
    if (direction === "V" && playerGrids[player][y + i][x] !== 0) return false;
  }
  return true;
}

// Размещение корабля на поле
function placeShip(x, y, size, direction, player) {
  for (let i = 0; i < size; i++) {
    if (direction === "H") playerGrids[player][y][x + i] = 1;
    else playerGrids[player][y + i][x] = 1;
  }
}

// Создание игрового поля для игрока
function createGrid(player) {
  let grid = document.getElementById(`grid${player}`);
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.dataset.player = player;
      cell.addEventListener("click", handleShot);
      grid.appendChild(cell);
    }
  }
}

// Функция обработки выстрела игрока
function handleShot(event) {
  let x = event.target.dataset.x;
  let y = event.target.dataset.y;
  let player = event.target.dataset.player;
  let opponent = 1 - currentPlayer; // Определение противника

  if (player != opponent) {
    alert("Вы не можете стрелять в свою доску!");
    return;
  }

  if (playerGrids[opponent][y][x] === 1) {
    event.target.classList.add("hit"); // Попадание
    playerGrids[opponent][y][x] = 2;
    hits[currentPlayer]++;
    if (hits[currentPlayer] === shipSizes.reduce((a, b) => a + b, 0)) {
      alert(`Игрок ${currentPlayer + 1} победил!`);
      return;
    }
  } else {
    event.target.classList.add("miss"); // Промах
    playerGrids[opponent][y][x] = -1;
  }
  currentPlayer = 1 - currentPlayer; // Смена хода
  updateTurnMessage();
}

// Запуск игры после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
  placeShips(0);
  placeShips(1);
  createGrid(0);
  createGrid(1);

  // Создание и добавление сообщения о текущем ходе
  let turnMessage = document.createElement("h2");
  turnMessage.id = "turnMessage";
  document.body.insertBefore(turnMessage, document.body.firstChild);
  updateTurnMessage();
});
