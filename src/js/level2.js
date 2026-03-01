/**
 * Nivel 2: laberinto sobre el piso — paredes, techo (tapa la luz), cuartos ciegos.
 * Salida: tubo verde que termina al aire libre con castillo y moneda final.
 * Sin plataformas; se juega todo sobre el suelo.
 */

import { createCoin, createEnemy, ASSET_PATHS } from './level.js';
import { onCoinCollect } from './game-state.js';

const CELL = 3;           // tamaño de celda (ancho de pasillo)
const WALL_H = 8;         // altura de paredes y techo (alto para evitar bug al saltar sobre goombas)
const MAZE_ORIGIN_X = 0;  // origen del laberinto en X (centro)
const MAZE_ORIGIN_Z = 0;  // origen del laberinto en Z

// Grid: # = pared, ' ' = pasillo, S = inicio, E = salida (sin techo), C = moneda, G = enemigo
// Filas = Z (arriba abajo), columnas = X (izq der). Mundo: x = col*CELL + offsetX, z = row*CELL + offsetZ
const MAZE_GRID = [
  '###################',
  '#                 #',
  '# #############   #',
  '#    C     G    ###',
  '##############    #',
  '#    C    G       #',
  '# ############### #',
  '#     C      G    #',
  '### ######## ## ###',
  '#   #  C    G  #  #',
  '# ############### #',
  '#   C        G    #',
  '######### #########',
  '#    G     #      #',
  '# ######### #######',
  '#     C      G    #',
  '#### ############ #',
  '#    #  G    C  G #',
  '# #### ########## #',
  '#    G            #',
  '########### ##### #',
  '#   G   C         #',
  '# ############### #',
  '#   C        G    #',
  '#S#################',
];

const COLS = 19;
const ROWS = 25;
const OFFSET_X = -(COLS / 2) * CELL + CELL / 2;
const OFFSET_Z = -(ROWS / 2) * CELL + CELL / 2;

function worldX(col) { return col * CELL + OFFSET_X; }
function worldZ(row) { return row * CELL + OFFSET_Z; }

/** Zona de salida (sin techo): columnas 11–18 y filas 0,1 para que la escalera de 16 escalones quede al descubierto */
function isExitZone(col, row) {
  return col >= 11 && col <= 18 && row <= 1;
}

/** Celdas alcanzables desde (startRow, startCol) sin atravesar paredes. */
function getReachableCells(grid, startRow, startCol) {
  const reachable = new Set();
  const queue = [[startRow, startCol]];
  reachable.add(`${startRow},${startCol}`);
  while (queue.length) {
    const [r, c] = queue.shift();
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const r2 = r + dr, c2 = c + dc;
      if (r2 < 0 || r2 >= ROWS || c2 < 0 || c2 >= COLS) continue;
      if (reachable.has(`${r2},${c2}`)) continue;
      if (grid[r2][c2] === 0) continue;
      reachable.add(`${r2},${c2}`);
      queue.push([r2, c2]);
    }
  }
  return reachable;
}

function createWall(parent, id, x, y, z, usePhysics) {
  const el = document.createElement('a-box');
  el.setAttribute('id', id);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('width', CELL);
  el.setAttribute('height', WALL_H);
  el.setAttribute('depth', CELL);
  el.setAttribute('material', 'src: #tex-ladrillos-azules; repeat: 2 2; color: #FFFFFF; metalness: 0; roughness: 1');
  el.setAttribute('shadow', 'cast: true; receive: true');
  el.setAttribute('class', 'platform maze-wall');
  el.setAttribute('data-width', String(CELL));
  el.setAttribute('data-height', String(WALL_H));
  el.setAttribute('data-depth', String(CELL));
  if (usePhysics) el.setAttribute('static-body', '');
  parent.appendChild(el);
}

const CEILING_OVERLAP = 0.15;
const CEILING_TILE_SIZE = CELL + CEILING_OVERLAP;
const CEILING_HEIGHT = 1.0;

function createCeilingTile(parent, id, x, z, usePhysics) {
  const el = document.createElement('a-box');
  el.setAttribute('id', id);
  el.setAttribute('position', `${x} ${WALL_H} ${z}`);
  el.setAttribute('width', CEILING_TILE_SIZE);
  el.setAttribute('height', CEILING_HEIGHT);
  el.setAttribute('depth', CEILING_TILE_SIZE);
  el.setAttribute('data-width', String(CEILING_TILE_SIZE));
  el.setAttribute('data-height', String(CEILING_HEIGHT));
  el.setAttribute('data-depth', String(CEILING_TILE_SIZE));
  el.setAttribute('rotation', '0 0 0');
  el.setAttribute('material', 'src: #tex-ladrillos-azules; repeat: 2 1; color: #FFFFFF; metalness: 0; roughness: 1');
  el.setAttribute('shadow', 'cast: true; receive: true');
  el.setAttribute('class', 'ceiling');
  if (usePhysics) el.setAttribute('static-body', '');
  parent.appendChild(el);
}

export const TOTAL_COINS_LEVEL2 = 10;

export function createLevel2(scene, usePhysics = true) {
  window.__level2CheatUsed = false;
  const container = document.createElement('a-entity');
  container.setAttribute('id', 'level');

  const mapGrid = MAZE_GRID.map((line) => Array(COLS).fill(0).map((_, c) => (line[c] === '#' ? 0 : 1)));
  let startRow = ROWS - 1, startCol = 1;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if ((MAZE_GRID[r] || '')[c] === 'S') { startRow = r; startCol = c; break; }
    }
  }
  const reachable = getReachableCells(mapGrid, startRow, startCol);
  const reachableCoinsPool = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const key = `${r},${c}`;
      if (!reachable.has(key)) continue;
      if (r === startRow && c === startCol) continue;
      if (isExitZone(c, r)) continue;
      reachableCoinsPool.push([r, c]);
    }
  }
  for (let i = reachableCoinsPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [reachableCoinsPool[i], reachableCoinsPool[j]] = [reachableCoinsPool[j], reachableCoinsPool[i]];
  }
  const mazeCoinCells = reachableCoinsPool.slice(0, 9);
  const coinPositions = mazeCoinCells.map(([r, c]) => [worldX(c), 1.2, worldZ(r)]);
  let startPosition = `${worldX(startCol)} 0.8 ${worldZ(startRow)}`;
  const enemyPositions = [];

  for (let row = 0; row < ROWS; row++) {
    const line = MAZE_GRID[row];
    if (!line) continue;
    for (let col = 0; col < COLS; col++) {
      const ch = line[col] || '#';
      const x = worldX(col);
      const z = worldZ(row);

      if (ch === '#') {
        createWall(container, `wall-${row}-${col}`, x, WALL_H / 2, z, usePhysics);
      } else {
        if (ch === 'G') enemyPositions.push([x, 0, z]);
        if (!isExitZone(col, row)) {
          createCeilingTile(container, `ceiling-${row}-${col}`, x, z, usePhysics);
        }
      }
    }
  }

  coinPositions.forEach(([x, y, z], i) => {
    createCoin(container, `coin-${i}`, x, y, z, usePhysics);
  });

  const startX = worldX(startCol);
  const startZ = worldZ(startRow);

  const ENEMY_FLOOR_Y = 0.3;
  enemyPositions.forEach(([x, _, z], i) => {
    createEnemy(container, `enemy-${i}`, x, ENEMY_FLOOR_Y, z, 1.2);
  });

  const exitX = worldX(17);
  const exitZ = worldZ(1);
  const FLOOR_Y = 0;

  const castleBase = document.createElement('a-entity');
  castleBase.setAttribute('id', 'castle');
  castleBase.setAttribute('position', `${exitX} ${FLOOR_Y} ${exitZ}`);
  castleBase.setAttribute('rotation', '0 -90 0');
  castleBase.setAttribute('data-width', '4');
  castleBase.setAttribute('data-height', '5');
  castleBase.setAttribute('data-depth', '4');
  castleBase.setAttribute('fbx-model', `src: ${ASSET_PATHS.castleModel}; scale: 0.0006 0.0006 0.0006; rotation: 0 0 0`);
  castleBase.setAttribute('shadow', 'cast: true; receive: true');
  if (usePhysics) castleBase.setAttribute('static-body', '');
  container.appendChild(castleBase);
  createCoin(container, 'coin-castle', exitX - 2.8, 1.2, exitZ, usePhysics);

  const pipeX = exitX - 4;
  const pipeEl = document.createElement('a-entity');
  pipeEl.setAttribute('id', 'pipe-exit');
  pipeEl.setAttribute('position', `${pipeX} 0 ${exitZ}`);
  pipeEl.setAttribute('fbx-model', `src: ${ASSET_PATHS.pipeModel}; scale: 0.12 0.2 0.12; rotation: 0 0 0`);
  pipeEl.setAttribute('shadow', 'cast: true; receive: true');
  pipeEl.setAttribute('class', 'platform');
  pipeEl.setAttribute('data-width', 2);
  pipeEl.setAttribute('data-height', 4);
  pipeEl.setAttribute('data-depth', 2);
  if (usePhysics) pipeEl.setAttribute('static-body', '');
  container.appendChild(pipeEl);

  // Límites del mapa para el controlador simple (evitar que el jugador quede recortado por MAP_BOUNDS del nivel 1)
  window.__level2MapBounds = {
    xMin: OFFSET_X - CELL,
    xMax: -OFFSET_X + CELL,
    zMin: OFFSET_Z - CELL,
    zMax: -OFFSET_Z + CELL,
  };
  // Datos para minimapa que se revela al explorar (grid: 0 = pared, 1 = pasillo)
  window.__levelMapData = { grid: mapGrid, rows: ROWS, cols: COLS, cell: CELL, offsetX: OFFSET_X, offsetZ: OFFSET_Z };
  window.__levelMapVisited = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  window.__level2Start = { x: startX, z: startZ };
  window.__level2Exit = { x: exitX, z: exitZ };
  window.__level2Cheat = function (levelEl) {
    if (!levelEl || window.__level2CheatUsed) return;
    window.__level2CheatUsed = true;
    const coins = levelEl.querySelectorAll('.collectable');
    let given = 0;
    const toGive = 9;
    coins.forEach((coin) => {
      if (coin.id === 'coin-castle') return;
      if (given >= toGive) return;
      coin.parentNode?.removeChild(coin);
      onCoinCollect();
      given++;
    });
    levelEl.querySelectorAll('.enemy').forEach((enemy) => {
      enemy.parentNode?.removeChild(enemy);
    });
    const trick = levelEl.querySelector('#trick-cheat');
    if (trick) trick.parentNode?.removeChild(trick);
    const start = window.__level2Start;
    const end = window.__level2Exit;
    if (start && end) {
      const pathContainer = document.createElement('a-entity');
      pathContainer.setAttribute('id', 'path-markers');
      const numMarkers = 12;
      for (let i = 1; i < numMarkers; i++) {
        const t = i / numMarkers;
        const x = start.x + t * (end.x - start.x);
        const z = start.z + t * (end.z - start.z);
        const marker = document.createElement('a-entity');
        marker.setAttribute('position', `${x} 0.4 ${z}`);
        marker.setAttribute('geometry', 'primitive: sphere; radius: 0.35');
        marker.setAttribute('material', 'color: #00FF00; emissive: #00AA00; emissiveIntensity: 0.5');
        pathContainer.appendChild(marker);
      }
      levelEl.appendChild(pathContainer);
    }
  };

  return { container, startPosition };
}
