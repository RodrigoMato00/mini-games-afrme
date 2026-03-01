/**
 * Level 6: Minigame — same structure as level 2 but with random maze and random brick style.
 * No castle; win by collecting all 10 coins. Coins are always placed in reachable cells.
 */

import { createCoin } from './level.js';

const CELL = 3;
const WALL_H = 8;
const COLS = 19;
const ROWS = 25;
const OFFSET_X = -(COLS / 2) * CELL + CELL / 2;
const OFFSET_Z = -(ROWS / 2) * CELL + CELL / 2;
const TOTAL_COINS_LEVEL6 = 10;

function worldX(col) { return col * CELL + OFFSET_X; }
function worldZ(row) { return row * CELL + OFFSET_Z; }

/** 0 = wall, 1 = passage. Recursive backtracker ensures all passages are connected from start. */
function generateMazeGrid() {
  const grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  const startRow = ROWS - 2;
  const startCol = 1;

  function carve(row, col) {
    grid[row][col] = 1;
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const [dr, dc] of dirs) {
      const r2 = row + dr * 2;
      const c2 = col + dc * 2;
      if (r2 >= 1 && r2 <= ROWS - 2 && c2 >= 1 && c2 <= COLS - 2 && grid[r2][c2] === 0) {
        grid[row + dr][col + dc] = 1;
        carve(r2, c2);
      }
    }
  }

  carve(startRow, startCol);
  grid[startRow][startCol] = 1;
  const exitCol = Math.floor(COLS / 2);
  grid[1][exitCol] = 1;
  if (ROWS > 2) grid[2][exitCol] = 1;
  return { grid, startRow, startCol };
}

/** Collect all passage cells reachable from (startRow, startCol) — already connected by maze. */
function getReachablePassages(grid, startRow, startCol) {
  const out = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === 1) out.push([r, c]);
    }
  }
  return out;
}

/** Pick up to 10 random passage cells for coins (excluding start). */
function pickCoinPositions(reachable, startRow, startCol, count = TOTAL_COINS_LEVEL6) {
  const other = reachable.filter(([r, c]) => r !== startRow || c !== startCol);
  const n = Math.min(count, other.length);
  for (let i = other.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [other[i], other[j]] = [other[j], other[i]];
  }
  return other.slice(0, n).map(([r, c]) => [worldX(c), 1.2, worldZ(r)]);
}

function createWall(parent, id, x, y, z, usePhysics, useBlueBricks) {
  const tex = useBlueBricks ? '#tex-ladrillos-azules' : '#tex-ladrillo';
  const el = document.createElement('a-box');
  el.setAttribute('id', id);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('width', CELL);
  el.setAttribute('height', WALL_H);
  el.setAttribute('depth', CELL);
  el.setAttribute('material', `src: ${tex}; repeat: 2 2; color: #FFFFFF; metalness: 0; roughness: 1`);
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

function createCeilingTile(parent, id, x, z, usePhysics, useBlueBricks) {
  const tex = useBlueBricks ? '#tex-ladrillos-azules' : '#tex-ladrillo';
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
  el.setAttribute('material', `src: ${tex}; repeat: 2 1; color: #FFFFFF; metalness: 0; roughness: 1`);
  el.setAttribute('shadow', 'cast: true; receive: true');
  el.setAttribute('class', 'ceiling');
  if (usePhysics) el.setAttribute('static-body', '');
  parent.appendChild(el);
}

export { TOTAL_COINS_LEVEL6 };

export function createLevel6(scene, usePhysics = true) {
  const useBlueBricks = Math.random() < 0.5;
  const { grid, startRow, startCol } = generateMazeGrid();
  const reachable = getReachablePassages(grid, startRow, startCol);
  const coinPositions = pickCoinPositions(reachable, startRow, startCol);

  const container = document.createElement('a-entity');
  container.setAttribute('id', 'level');

  const startPosition = `${worldX(startCol)} 0.8 ${worldZ(startRow)}`;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = worldX(col);
      const z = worldZ(row);
      if (grid[row][col] === 0) {
        createWall(container, `wall-${row}-${col}`, x, WALL_H / 2, z, usePhysics, useBlueBricks);
      } else {
        createCeilingTile(container, `ceiling-${row}-${col}`, x, z, usePhysics, useBlueBricks);
      }
    }
  }

  coinPositions.forEach(([x, y, z], i) => {
    createCoin(container, `coin-${i}`, x, y, z, usePhysics);
  });

  const exitCol = Math.floor(COLS / 2);
  const exitX = worldX(exitCol);
  const exitZ = worldZ(1);
  const doorFrame = document.createElement('a-entity');
  doorFrame.setAttribute('id', 'exit-door');
  doorFrame.setAttribute('position', `${exitX} 0 ${exitZ}`);
  const doorTex = useBlueBricks ? '#tex-ladrillos-azules' : '#tex-ladrillo';
  ['-1.2 1.25 0', '1.2 1.25 0'].forEach((pos) => {
    const pillar = document.createElement('a-box');
    pillar.setAttribute('position', pos);
    pillar.setAttribute('width', '0.4');
    pillar.setAttribute('height', '2.5');
    pillar.setAttribute('depth', '0.4');
    pillar.setAttribute('material', `src: ${doorTex}; repeat: 1 2; color: #8B4513; metalness: 0; roughness: 1`);
    pillar.setAttribute('shadow', 'cast: true; receive: true');
    if (usePhysics) pillar.setAttribute('static-body', '');
    doorFrame.appendChild(pillar);
  });
  const lintel = document.createElement('a-box');
  lintel.setAttribute('position', '0 2.5 0');
  lintel.setAttribute('width', '2.8');
  lintel.setAttribute('height', '0.4');
  lintel.setAttribute('depth', '0.4');
  lintel.setAttribute('material', `src: ${doorTex}; repeat: 2 1; color: #8B4513; metalness: 0; roughness: 1`);
  lintel.setAttribute('shadow', 'cast: true; receive: true');
  if (usePhysics) lintel.setAttribute('static-body', '');
  doorFrame.appendChild(lintel);
  container.appendChild(doorFrame);

  window.__level6MapBounds = {
    xMin: OFFSET_X - CELL,
    xMax: -OFFSET_X + CELL,
    zMin: OFFSET_Z - CELL,
    zMax: -OFFSET_Z + CELL,
  };

  window.__levelMapData = { grid, rows: ROWS, cols: COLS, cell: CELL, offsetX: OFFSET_X, offsetZ: OFFSET_Z };
  window.__levelMapVisited = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  window.__levelExitZone = (row, col) => row <= 1 && col >= exitCol - 1 && col <= exitCol + 1 && grid[row][col] === 1;

  return { container, startPosition };
}
