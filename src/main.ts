import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas" style="border:2px solid black"></canvas>
  </div>
`
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d')!;

window.onload = setup;

let sandColor = '360'
const getSandColor = () => {
  return `hsl(${sandColor}, 100%, 50%)`;
}

let hold = false;

const createSandEvent = (e: MouseEvent) => {
  const x = Math.floor(e.offsetX / gridSize);
  const y = Math.floor(e.offsetY / gridSize);
  
  if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return;
  
  let brushSize = 5;
  let brushRadius = Math.floor(brushSize / 2);
  sandColor = (parseInt(sandColor) + 1).toString();
  
  for (let i = -brushRadius; i <= brushRadius; i++) {
    for (let j = -brushRadius; j <= brushRadius; j++) {
      let col = x + i;
      let row = y + j;
      if (col < 0 || col >= gridWidth || row < 0 || row >= gridHeight) continue;
      if (terrain[col][row] === airColor) {
        terrain[col][row] = getSandColor();
      }
    }
  }

}

canvas.addEventListener('mousedown', () => {
  hold = true;
});

canvas.addEventListener('mouseup', () => {
  hold = false;
});

canvas.addEventListener('mousemove', (e) => {
  if (hold) createSandEvent(e);
});

const gridShow = false;
const FPS = 30;

const gridSize = 5;
const gridWidth = 200;
const gridHeight = 100;

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

const airColor = '#123123';
const terrain = create2DArray(gridWidth, gridHeight, airColor);

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

      const current = terrain[x][y];
      const below = terrain[x][y + 1];

      const randomSide = Math.random() > 0.5 ? -1 : 1;
      const belowA = terrain[x - randomSide] ? terrain[x - randomSide][y + 1] : null;
      const belowB = terrain[x + randomSide] ? terrain[x + randomSide][y + 1] : null;

      if (current != airColor) {
        if (below === airColor) {
          updates.push({ x, y, color: airColor });
          updates.push({ x, y: (y + 1), color: current });

        } else if (belowA === airColor) {
          updates.push({ x, y, color: airColor });
          updates.push({ x: (x - randomSide), y: (y + 1), color: current });

        } else if (belowB === airColor) {
          updates.push({ x, y, color: airColor });
          updates.push({ x: (x + randomSide), y: (y + 1), color: current });

        };
      };
    };
  };

  for (const update of updates) {
    terrain[update.x][update.y] = update.color;
  }

}