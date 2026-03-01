/**
 * Level 5: Pipe Land — estilo Mario Bros subterráneo.
 * Muchas tuberías como obstáculos, plataformas de ladrillo, goombas y 10 monedas.
 * Victoria: recoger las 10 monedas. Sin portal.
 */

import { createCoin, createEnemy, createPipe, ASSET_PATHS } from './level.js';

const BRICK = '#tex-ladrillo';
const BRICK_COLOR = '#B53120';

function createBrickPlatform(parent, id, x, y, z, w, h, d, usePhysics = true) {
  const el = document.createElement('a-box');
  el.setAttribute('id', id || `brick-${x}-${y}-${z}`);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('width', w);
  el.setAttribute('height', h);
  el.setAttribute('depth', d);
  const r = `${Math.max(1, Math.ceil(w))} ${Math.max(1, Math.ceil(h))}`;
  el.setAttribute('material', `src: ${BRICK}; repeat: ${r}; color: ${BRICK_COLOR}; metalness: 0; roughness: 1`);
  el.setAttribute('shadow', 'cast: true; receive: true');
  el.setAttribute('class', 'platform');
  el.setAttribute('data-width', String(w));
  el.setAttribute('data-height', String(h));
  el.setAttribute('data-depth', String(d));
  if (usePhysics) el.setAttribute('static-body', '');
  parent.appendChild(el);
  return el;
}

export const TOTAL_COINS_LEVEL5 = 10;

export function createLevel5(scene, usePhysics = true) {
  const container = document.createElement('a-entity');
  container.setAttribute('id', 'level');

  // Plataformas de ladrillo — camino entre tuberías
  const platforms = [
    [0, 0.5, -5, 4, 1, 3],
    [5, 0.5, -5, 2, 1, 2],
    [9, 1, -5, 2.5, 1, 2],
    [13, 0.5, -5, 2, 1, 2],
    [13, 0.5, -8, 2, 1, 2],
    [17, 1.2, -5, 2, 1, 2],
    [17, 1.2, -8, 2, 1, 2],
    [21, 0.5, -5, 3, 1, 2],
    [21, 1.5, -8, 2, 1, 2],
    [26, 1, -5, 2.5, 1, 2],
    [26, 1.8, -8, 2, 1, 2],
    [30, 0.5, -6, 4, 1, 3],
    [35, 0.5, -6, 3, 1, 2],
  ];
  platforms.forEach(([x, y, z, w, h, d], i) => {
    createBrickPlatform(container, `platform-${i}`, x, y, z, w, h, d, usePhysics);
  });

  // Tuberías — obstáculos estilo World 1-2
  const pipes = [
    [3, 0, -5, 1.8, 3.5, 1.8],
    [7, 0, -5, 1.8, 3.5, 1.8],
    [11, 0, -5, 1.8, 3.5, 1.8],
    [15, 0, -6.5, 1.8, 3.5, 1.8],
    [19, 0, -5, 1.8, 3.5, 1.8],
    [19, 0, -8, 1.8, 3.5, 1.8],
    [24, 0, -6, 1.8, 3.5, 1.8],
    [28, 0, -5, 1.8, 3.5, 1.8],
    [28, 0, -8, 1.8, 3.5, 1.8],
  ];
  pipes.forEach(([x, y, z, w, h, d], i) => {
    createPipe(container, `pipe-${i}`, x, y, z, w, h, d, usePhysics);
  });

  // Monedas (9 en nivel + 1 en castillo = 10)
  const coinPositions = [
    [1, 1.2, -5],
    [6, 1.2, -5],
    [10.5, 1.5, -5],
    [14, 1.2, -8],
    [18.5, 1.7, -5],
    [18.5, 1.7, -8],
    [23, 1.5, -5],
    [27, 1.3, -5],
    [27, 2.3, -8],
  ];
  coinPositions.forEach(([x, y, z], i) => {
    createCoin(container, `coin-${i}`, x, y, z, usePhysics);
  });

  // Goombas sobre plataformas
  const enemies = [
    [5, 1, -5, 0.6],
    [13, 1, -5, 0.5],
    [13, 1, -8, 0.5],
    [17, 1.7, -5, 0.6],
    [21, 2, -8, 0.5],
    [26, 2.3, -8, 0.5],
  ];
  enemies.forEach(([x, y, z], i) => {
    createEnemy(container, `enemy-${i}`, x, y, z, 0.7);
  });

  // Castillo final
  const castleX = 37;
  const castleZ = -6;
  const castleBase = document.createElement('a-entity');
  castleBase.setAttribute('id', 'castle');
  castleBase.setAttribute('position', `${castleX} 0 ${castleZ}`);
  castleBase.setAttribute('rotation', '0 -90 0');
  castleBase.setAttribute('data-width', '4');
  castleBase.setAttribute('data-height', '5');
  castleBase.setAttribute('data-depth', '4');
  castleBase.setAttribute('fbx-model', `src: ${ASSET_PATHS.castleModel}; scale: 0.0006 0.0006 0.0006; rotation: 0 0 0`);
  castleBase.setAttribute('shadow', 'cast: true; receive: true');
  if (usePhysics) castleBase.setAttribute('static-body', '');
  container.appendChild(castleBase);
  createCoin(container, 'coin-castle', castleX - 2.5, 1.2, castleZ, usePhysics);

  const startPosition = '0 1.8 -5';
  return { container, startPosition };
}
