const gridSize = 10; //– размер игрового поля (10x10)
const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];// массив, в котором указаны размеры кораблей
let playerGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));//двумерный массив (10x10), представляющий игровое поле,
let hits = 0;//счётчик попаданий.

//Размещение кораблей
//Проходим по списку размеров кораблей (shipSizes).
//Для каждого корабля:
//Генерируем случайные координаты (x, y).
//Определяем направление (H – горизонтально, V – вертикально).
//Проверяем, можно ли разместить корабль в этом месте (canPlaceShip).
//Если можно – размещаем (placeShip).
function placeShips() {
    for (let size of shipSizes) {
        let placed = false;
        while (!placed) {
            let x = Math.floor(Math.random() * gridSize);
            let y = Math.floor(Math.random() * gridSize);
            let direction = Math.random() > 0.5 ? 'H' : 'V';
            if (canPlaceShip(x, y, size, direction)) {
                placeShip(x, y, size, direction);
                placed = true;
            }
        }
    }
}

//Проверка возможности размещения корабля
//Проверяем, чтобы корабль не выходил за границы поля.
//Проверяем, чтобы клетки, куда ставится корабль, были пустыми (0).
//Если всё в порядке – возвращаем true, иначе false.
function canPlaceShip(x, y, size, direction) {
    if (direction === 'H' && x + size > gridSize) return false;
    if (direction === 'V' && y + size > gridSize) return false;
    for (let i = 0; i < size; i++) {
        if (direction === 'H' && playerGrid[y][x + i] !== 0) return false;
        if (direction === 'V' && playerGrid[y + i][x] !== 0) return false;
    }
    return true;
}

//Размещение корабля
//Заполняем клетки на поле playerGrid[y][x] = 1, помечая их как корабли (1).
function placeShip(x, y, size, direction) {
    for (let i = 0; i < size; i++) {
        if (direction === 'H') playerGrid[y][x + i] = 1;
        else playerGrid[y + i][x] = 1;
    }
}

//Создание игрового поля
//Создаём игровое поле (10x10 клеток).
//Каждая клетка – это div, у которого есть data-x и data-y (координаты).
//Добавляем обработчик клика (handleShot).
function createGrid() {
    let grid = document.getElementById('grid');
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener('click', handleShot);
            grid.appendChild(cell);
        }
    }
}

//Обработка выстрела
//Читаем координаты x, y из нажатой клетки.
//Проверяем playerGrid[y][x]:
//Если там 1 (корабль), то:
//Меняем стиль на hit (попадание).
//Меняем значение клетки на 2 (повреждённый корабль).
//Увеличиваем hits.
//Если все корабли уничтожены, выводим "Вы победили!".
//Если там 0 (мимо), меняем стиль на miss и ставим -1.
function handleShot(event) {
    let x = event.target.dataset.x;
    let y = event.target.dataset.y;
    if (playerGrid[y][x] === 1) {
        event.target.classList.add('hit');
        playerGrid[y][x] = 2;
        hits++;
        if (hits === shipSizes.reduce((a, b) => a + b, 0)) {
            alert('Вы победили!');
        }
    } else {
        event.target.classList.add('miss');
        playerGrid[y][x] = -1;
    }
}

//Запуск игры
//Когда страница загрузилась:
//Размещаем корабли (placeShips()).
//Создаём игровое поле (createGrid()).

document.addEventListener('DOMContentLoaded', () => {
    placeShips();
    createGrid();
});
