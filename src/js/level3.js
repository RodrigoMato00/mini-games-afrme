/**
 * Nivel 3: similar al 1, más plataformas cubriendo el terreno, suelo de lava, textura piedra.
 * Mismo comportamiento: enemigos en plataformas, monedas, castillo al final.
 */

import { createCoin, createEnemy, createPipe, createCastle, ASSET_PATHS } from './level.js';

const TEX_STONE = '#tex-piedra';

function createBoxStone(parent, id, x, y, z, w, h, d, usePhysics = true, extraClass = '') {
  const el = document.createElement('a-box');
  el.setAttribute('id', id || `box-${x}-${y}-${z}`);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('width', w);
  el.setAttribute('height', h);
  el.setAttribute('depth', d);
  const r = `${Math.max(1, Math.ceil(w))} ${Math.max(1, Math.ceil(h))}`;
  el.setAttribute('material', `src: ${TEX_STONE}; repeat: ${r}; color: #FFFFFF; metalness: 0; roughness: 1`);
  el.setAttribute('shadow', 'cast: true; receive: true');
  el.setAttribute('class', `platform ${extraClass}`.trim());
  if (usePhysics) el.setAttribute('static-body', '');
  parent.appendChild(el);
  return el;
}

/**
 * Muchas más plataformas cubriendo el terreno. [x, y, z, w, h, d, type]
 * type: 'platform' | 'pipe' | 'coin' | 'hittable'
 */
function buildLevelData() {
  const data = [];
  let idx = 0;

  // Plataforma inicial ancha
  data.push([0, 0.5, -5, 5, 1, 4, 'platform']);
  idx++;

  // Bloques y plataformas cubriendo de 0 a 35 en X, -12 a 2 en Z
  const platformGrid = [
    [4, 1, -6, 2.5, 1, 2, 'platform'],
    [7, 1.5, -5, 2, 1, 2, 'platform'],
    [10, 1, -7, 3, 1, 2.5, 'platform'],
    [13, 0.8, -4, 2.5, 1, 2, 'platform'],
    [16, 1.2, -6, 2, 1, 2, 'platform'],
    [19, 1, -5, 3, 1, 2, 'platform'],
    [22, 1.5, -7, 2, 1, 2.5, 'platform'],
    [25, 0.7, -4, 2.5, 1, 2, 'platform'],
    [28, 1.2, -6, 3, 1, 2, 'platform'],
    [31, 1, -5, 2.5, 1, 2, 'platform'],
    [4, 1.8, -9, 2, 1, 2, 'platform'],
    [8, 2, -9, 2.5, 1, 2, 'platform'],
    [12, 1.5, -10, 2, 1, 2, 'platform'],
    [16, 2.2, -9, 2, 1, 2.5, 'platform'],
    [20, 1.8, -10, 2.5, 1, 2, 'platform'],
    [24, 1.2, -9, 2, 1, 2, 'platform'],
    [28, 2, -10, 2, 1, 2, 'platform'],
    [32, 1.5, -9, 2.5, 1, 2, 'platform'],
    [2, 1.2, -3, 2, 1, 2, 'platform'],
    [6, 1.8, -2, 2, 1, 2, 'platform'],
    [10, 1, -3, 2.5, 1, 2, 'platform'],
    [14, 1.5, -2, 2, 1, 2.5, 'platform'],
    [18, 2, -3, 2, 1, 2, 'platform'],
    [23, 1.2, -2, 2.5, 1, 2, 'platform'],
    [27, 1.8, -3, 2, 1, 2, 'platform'],
    [30, 1, -2, 2, 1, 2, 'platform'],
    [5, 2.2, -5, 1.5, 1, 1.5, 'platform'],
    [11, 2.5, -6, 1.5, 1, 1.5, 'platform'],
    [17, 2, -5, 1.5, 1, 1.5, 'platform'],
    [21, 2.3, -6, 1.5, 1, 1.5, 'platform'],
    [26, 2.5, -5, 1.5, 1, 1.5, 'platform'],
    [12, 1.5, -3, 1.5, 3, 1.5, 'pipe'],
    [20, 1.5, -4, 1.5, 3, 1.5, 'pipe'],
    [6, 2, -5.5, 1, 1, 1, 'hittable'],
    [15, 2.5, -5.5, 1, 1, 1, 'hittable'],
    [24, 2, -5.5, 1, 1, 1, 'hittable'],
    [28, 1, -7, 6, 1, 2.5, 'platform'],
  ];

  platformGrid.forEach((row) => {
    data.push(row);
    idx++;
  });

  // Monedas (9 en nivel + 1 en castillo = 10 total)
  const coinPositions = [
    [2, 1.8, -5], [5, 2.2, -6], [8, 2.5, -5], [11, 2, -7], [15, 3.2, -6],
    [18, 2.2, -5], [23, 2.5, -6], [26, 3.5, -5], [29, 2, -7],
  ];
  coinPositions.forEach(([x, y, z]) => {
    data.push([x, y, z, 0, 0, 0, 'coin']);
  });

  return data;
}

export const TOTAL_COINS_LEVEL3 = 10;

export function createLevel3(scene, usePhysics = true) {
  const container = document.createElement('a-entity');
  container.setAttribute('id', 'level');

  const LEVEL_DATA = buildLevelData();

  LEVEL_DATA.forEach((row, i) => {
    const [x, y, z, w, h, d, type] = row;

    if (type === 'coin') {
      createCoin(container, `coin-${i}`, x, y, z, usePhysics);
    } else if (type === 'hittable') {
      const box = document.createElement('a-box');
      box.setAttribute('id', `hittable-${i}`);
      box.setAttribute('position', `${x} ${y} ${z}`);
      box.setAttribute('width', w);
      box.setAttribute('height', h);
      box.setAttribute('depth', d);
      box.setAttribute('material', 'src: #tex-piedra; color: #F1C40F; metalness: 0; roughness: 1');
      box.setAttribute('shadow', 'cast: true; receive: true');
      box.setAttribute('class', 'platform hittable');
      box.setAttribute('hittable-block', '');
      if (usePhysics) box.setAttribute('static-body', '');
      container.appendChild(box);
    } else if (type === 'pipe') {
      createPipe(container, `pipe-${i}`, x, y, z, w, h, d, usePhysics);
    } else {
      createBoxStone(container, `platform-${i}`, x, y, z, w, h, d, usePhysics, '');
    }
  });

  // Cada Goomba: [id, px, py, pz, ph, range]. top = py + ph/2.
  // El FBX Goomba tiene pivote en los PIES: la posición es donde apoyan los pies. goomba_y = platform_top.
  const enemiesOnPlatforms = [
    ['enemy-1', 4, 1, -6, 1, 0.5],
    ['enemy-2', 10, 1, -7, 1, 0.8],
    ['enemy-3', 19, 1, -5, 1, 1.3],
    ['enemy-4', 28, 1.2, -6, 1, 0.6],
    ['enemy-5', 8, 2, -9, 1, 0.5],
    ['enemy-6', 20, 1.8, -10, 1, 0.7],
    ['enemy-7', 28, 2, -10, 1, 0.6],
    ['enemy-8', 14, 1.5, -2, 1, 0.8],
  ];
  enemiesOnPlatforms.forEach(([id, px, py, pz, ph, range]) => {
    const platformTop = py + ph / 2;
    const goombaY = platformTop;
    if (typeof console !== 'undefined' && console.log) {
      console.log(`[nivel3] ${id}: plataforma top=${platformTop.toFixed(2)} | Goomba Y=${goombaY.toFixed(2)} (pivote en pies)`);
    }
    createEnemy(container, id, px, goombaY, pz, range);
  });

  createCastle(container, usePhysics);

  return container;
}
