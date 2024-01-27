import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas" style="border:2px solid black"></canvas>
  </div>
`
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d')!;

window.onload = setup;

canvas.addEventListener('click', (e) => {
  const x = Math.floor(e.offsetX / gridSize);
  const y = Math.floor(e.offsetY / gridSize);
  terrain[x][y] = 'red';
});

const gridShow = false;
const FPS = 10;

const gridSize = 10;
const gridWidth = 100;
const gridHeight = 50;

const canvasWidth = gridWidth * gridSize;
const canvasHeight = gridHeight * gridSize;

const gridColor = 'black';

const create2DArray = (rows: number, cols: number, defaultValue: any = null) => {
  let arr: any[][] = new Array(rows);
  for (let i = 0; i < rows; i++) {
    arr[i] = new Array(cols);
  };

  if (defaultValue) {
    for (let i = 0; i < rows; i++) {
      arr[i].fill(defaultValue);
    };
  };

  return arr;
}

const terrainColor = 'white';
const terrain = create2DArray(gridWidth, gridHeight, terrainColor);
terrain[50][0] = 'red';

function setup() {
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  setInterval(tick, 1000 / FPS);
}

const renderGrid = () => {
  ctx.fillStyle = gridColor;
  
  for (let i = 0; i < gridHeight; i++) {
    if (i === 0) continue;
    ctx.fillRect(0, (i * gridSize), canvas.width, 1);
  }
  
  for (let i = 0; i < gridWidth; i++) {
    if (i === 0) continue;
    ctx.fillRect((i * gridSize), 0, 1, canvas.height);
  }
};

const renderTerrain = () => {
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      ctx.fillStyle = terrain[i][j];
      ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
    }
  }
};

interface RenderUpdate {
  x: number;
  y: number;
  color: string;
}

const tick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  renderTerrain();
  if (gridShow) renderGrid();
  
  const updates: RenderUpdate[] = [];
  
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      if (j === gridHeight - 1) continue;
      const current = terrain[i][j];
      const below = terrain[i][j + 1];
      
      if (current === 'red' && below === 'white') {
        updates.push({ x: i, y: j, color: 'white' });
        updates.push({ x: i, y: (j + 1), color: 'red' });
      };

    }
  }

  for (const update of updates) {
    terrain[update.x][update.y] = update.color;
  }

}