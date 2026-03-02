/**
 * Level 8: Sky Platforms — plataformas flotantes, vacío abajo, mucha verticalidad.
 * Estilo plataformas clásicas (tipo Mario 2D): saltar entre plataformas a distintas alturas.
 * Enemigos VOX en plataformas estrechas para poder pisarlos al caer desde arriba.
 */

import { createCoin, ASSET_PATHS } from './level.js';

const VOX_GOOMBA_SRC = 'objetos/GOOMBA.vox';

const BRICK = '#tex-ladrillo-voxel';
const GRASS = '#tex-pasto-voxel';
const BRICK_COLOR = '#B53120';
const GRASS_COLOR = '#3D9B35';

function createPlatform(parent, id, x, y, z, w, h, d, texture, color, usePhysics = true) {
  const el = document.createElement('a-box');
  el.setAttribute('id', id || `plat-${x}-${y}-${z}`);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('width', w);
  el.setAttribute('height', h);
  el.setAttribute('depth', d);
  const r = `${Math.max(1, Math.ceil(w))} ${Math.max(1, Math.ceil(h))}`;
  el.setAttribute('material', `src: ${texture}; repeat: ${r}; color: ${color}; metalness: 0; roughness: 1`);
  el.setAttribute('shadow', 'cast: true; receive: true');
  el.setAttribute('class', 'platform');
  el.setAttribute('data-width', String(w));
  el.setAttribute('data-height', String(h));
  el.setAttribute('data-depth', String(d));
  if (usePhysics) el.setAttribute('static-body', '');
  parent.appendChild(el);
  return el;
}

/** Enemigo VOX en plataforma estrecha; posicionado para stomp al caer desde arriba. */
function createVoxEnemy(parent, id, x, y, z, range = 0.4) {
  const root = document.createElement('a-entity');
  root.setAttribute('id', id || `vox-enemy-${x}-${y}-${z}`);
  root.setAttribute('position', `${x} ${y} ${z}`);
  root.setAttribute('class', 'enemy');
  root.setAttribute('enemy-movement', `range: ${range}; axis: x`);

  const model = document.createElement('a-entity');
  model.setAttribute('vox-model', `src: ${VOX_GOOMBA_SRC}; scale: 0.045 0.045 0.045; rotation: 0 0 0`);
  model.setAttribute('shadow', 'cast: true');
  root.appendChild(model);

  parent.appendChild(root);
  return root;
}

export const TOTAL_COINS_LEVEL8 = 10;

export function createLevel8(scene, usePhysics = true) {
  const container = document.createElement('a-entity');
  container.setAttribute('id', 'level');

  // Plataformas asimétricas: textura, altura y Z sin patrón (ni brick=alto ni grass=bajo)
  // [x, y, z, w, h, d, texture, color]
  const platData = [
    [0, 1.0, -5.2, 3.5, 0.5, 2, GRASS, GRASS_COLOR],
    [3.9, 2.2, -4.4, 3, 0.5, 2, BRICK, BRICK_COLOR],
    [7.6, 0.85, -5.5, 3, 0.5, 2, GRASS, GRASS_COLOR],
    [11.1, 1.6, -4.9, 3, 0.5, 2, GRASS, GRASS_COLOR],
    [14.7, 2.0, -5.3, 3, 0.5, 2, BRICK, BRICK_COLOR],
    [18.2, 1.2, -4.6, 3, 0.5, 2, BRICK, BRICK_COLOR],
    [21.8, 1.9, -5.4, 3, 0.5, 2, GRASS, GRASS_COLOR],
    [25.3, 0.9, -4.7, 3, 0.5, 2, BRICK, BRICK_COLOR],
    [28.9, 2.1, -5.1, 3, 0.5, 2, GRASS, GRASS_COLOR],
    [32.4, 1.4, -4.5, 3, 0.5, 2, BRICK, BRICK_COLOR],
    [36, 1.75, -5.4, 3, 0.5, 2, GRASS, GRASS_COLOR],
    [39.4, 1.1, -4.8, 3.5, 0.5, 2, BRICK, BRICK_COLOR],
    [43, 1.55, -5.0, 3, 0.5, 2, GRASS, GRASS_COLOR],
  ];
  platData.forEach(([x, y, z, w, h, d, tex, color], i) => {
    createPlatform(container, `platform-${i}`, x, y, z, w, h, d, tex, color, usePhysics);
  });

  const topY = (y) => y + 0.25 + 0.4;

  // Monedas repartidas en las plataformas (9 + 1 en castillo)
  [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((i) => {
    const [x, y, z] = [platData[i][0], topY(platData[i][1]), platData[i][2]];
    createCoin(container, `coin-${i}`, x, y, z, usePhysics);
  });

  // Goombas en plataformas distintas, con patrulla amplia (0.7) para que se muevan
  const enemyPlats = [1, 3, 5, 7, 9]; // plataformas 2, 4, 6, 8, 10
  enemyPlats.forEach((idx, i) => {
    const [px, py, pz, pw] = [platData[idx][0], platData[idx][1], platData[idx][2], platData[idx][3]];
    const platformTop = py + 0.25;
    const ey = platformTop + 0.35;
    const range = Math.min(0.7, (pw / 2) - 0.2);
    createVoxEnemy(container, `enemy-${i}`, px, ey, pz, range);
  });

  const castleX = 45;
  const castleY = 1.6;
  const castleZ = -5;
  const castleBase = document.createElement('a-entity');
  castleBase.setAttribute('id', 'castle');
  castleBase.setAttribute('position', `${castleX} ${castleY - 1} ${castleZ}`);
  castleBase.setAttribute('rotation', '0 -90 0');
  castleBase.setAttribute('data-width', '4');
  castleBase.setAttribute('data-height', '5');
  castleBase.setAttribute('data-depth', '4');
  castleBase.setAttribute('fbx-model', `src: ${ASSET_PATHS.castleModel}; scale: 0.0006 0.0006 0.0006; rotation: 0 0 0`);
  castleBase.setAttribute('shadow', 'cast: true; receive: true');
  if (usePhysics) castleBase.setAttribute('static-body', '');
  container.appendChild(castleBase);
  createCoin(container, 'coin-castle', castleX - 0.5, castleY + 0.5, castleZ, usePhysics);

  const startPosition = `0 ${platData[0][1] + 0.25 + 0.8} -5`;
  return { container, startPosition };
}
