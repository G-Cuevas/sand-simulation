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
  
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {

      if (y === gridHeight - 1) continue;
      
      const current = terrain[x][y];
      const below = terrain[x][y + 1];
      const belowLeft = terrain[x - 1] ? terrain[x - 1][y + 1] : null;
      const belowRight = terrain[x + 1] ? terrain[x + 1][y + 1] : null;

      if (current === 'white') continue;

      if (current === 'red') {
        if (below && below === 'white') {
          updates.push({ x, y, color: 'white' });
          updates.push({ x, y: (y + 1), color: 'red' });
        };
  

        if (below === 'red' && belowLeft && belowLeft === 'white') {
          updates.push({ x, y, color: 'white' });
          updates.push({ x: (x - 1), y: (y + 1), color: 'red' });
        };
  
        if (below === 'red' && belowLeft === 'red' && belowRight && belowRight === 'white') {
          updates.push({ x, y, color: 'white' });
          updates.push({ x: (x + 1), y: (y + 1), color: 'red' });
        };
      };
    };
  };

  for (const update of updates) {
    terrain[update.x][update.y] = update.color;
  }

}