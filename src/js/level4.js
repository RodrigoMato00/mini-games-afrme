/**
 * Nivel 4: escenario en las nubes. Usa el modelo cloud.obj del zip clouds.
 * Las nubes son las plataformas. Agua abajo (letal).
 * Muchas plataformas para saltar, goombas, monedas, castillo al final.
 */

import { createCoin, createEnemy, ASSET_PATHS } from './level.js';

/** Escala del modelo cloud — bbox ~470x238x593, escalamos a ~2 unidades para plataformas que no envuelvan al personaje */
const CLOUD_SCALE = 0.004;

/** Plataforma nube: colisión ajustada al tamaño visual para que jugador y goomba queden arriba, no dentro */
function createCloudPlatform(parent, id, x, y, z, w, d, usePhysics = true) {
  const el = document.createElement('a-entity');
  el.setAttribute('id', id || `cloud-${x}-${y}-${z}`);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('obj-model', 'obj: #cloud-obj; mtl: #cloud-mtl');
  el.setAttribute('scale', `${CLOUD_SCALE} ${CLOUD_SCALE} ${CLOUD_SCALE}`);
  el.setAttribute('data-width', String(Math.min(w, 2.2)));
  el.setAttribute('data-height', String(0.9));
  el.setAttribute('data-depth', String(Math.min(d, 2.2)));
  el.setAttribute('shadow', 'cast: true; receive: true');
  el.setAttribute('class', 'platform');
  if (usePhysics) el.setAttribute('static-body', '');
  parent.appendChild(el);
  return el;
}

/** [x, y, z, w, d] — más nubes y más juntas para saltar; w,d limitados a 2.2 para que coincidan con el visual */
const CLOUD_PLATFORMS = [
  [0, 6.5, -5, 2, 2],
  [3, 7, -5, 2, 2],
  [6, 7.5, -5, 2, 2],
  [9, 8, -5, 2, 2],
  [12, 8.5, -5, 2, 2],
  [15, 9, -5, 2, 2],
  [18, 9.5, -5, 2, 2],
  [21, 10, -5, 2, 2],
  [24, 10.5, -5, 2, 2],
  [27, 11, -5, 2, 2],
  [30, 11.5, -5, 2, 2],
  [33, 12, -5, 2, 2],
  [34.5, 12.2, -5, 2, 2],
  [36, 12.5, -5, 2.2, 2.2],
  [5, 7.2, -7, 2, 2],
  [14, 8.7, -7, 2, 2],
  [23, 10.2, -7, 2, 2],
  [8, 8, -3, 2, 2],
  [20, 9.8, -3, 2, 2],
];

export const TOTAL_COINS_LEVEL4 = 10;

export function createLevel4(scene, usePhysics = true) {
  const container = document.createElement('a-entity');
  container.setAttribute('id', 'level');

  CLOUD_PLATFORMS.forEach(([x, y, z, w, d], i) => {
    createCloudPlatform(container, `cloud-${i}`, x, y, z, w, d, usePhysics);
  });

  // Monedas sobre las nubes — y = top (centro + 0.45), 9 + 1 castillo = 10
  const coinPositions = [
    [1.5, 7, -5], [7.5, 7.95, -5], [13.5, 8.95, -5], [19.5, 9.95, -5],
    [25.5, 10.95, -5], [31.5, 11.95, -5], [6, 7.65, -7], [16, 9.15, -7], [16, 9.15, -3],
  ];
  coinPositions.forEach(([x, y, z], i) => {
    createCoin(container, `coin-${i}`, x, y, z, usePhysics);
  });

  // Goombas en las nubes — y = top (centro + 0.45)
  const enemies = [
    [9, 8.45, -5],
    [18, 9.95, -5],
    [27, 11.45, -5],
    [5, 7.65, -7],
    [14, 9.15, -7],
    [8, 8.45, -3],
  ];
  enemies.forEach(([x, y, z], i) => {
    createEnemy(container, `enemy-${i}`, x, y, z, 0.8);
  });

  // Castillo final: desplazado a la derecha para no bloquear la nube ni la moneda
  const castlePlatformX = 36;
  const castlePlatformY = 12.95;
  const castleZ = -5;
  const castleX = 39;
  const castleBase = document.createElement('a-entity');
  castleBase.setAttribute('id', 'castle');
  castleBase.setAttribute('position', `${castleX} ${castlePlatformY} ${castleZ}`);
  castleBase.setAttribute('rotation', '0 -90 0');
  castleBase.setAttribute('data-width', '4');
  castleBase.setAttribute('data-height', '5');
  castleBase.setAttribute('data-depth', '4');
  castleBase.setAttribute('fbx-model', `src: ${ASSET_PATHS.castleModel}; scale: 0.0006 0.0006 0.0006; rotation: 0 0 0`);
  castleBase.setAttribute('shadow', 'cast: true; receive: true');
  castleBase.setAttribute('class', 'platform');
  if (usePhysics) castleBase.setAttribute('static-body', '');
  container.appendChild(castleBase);
  createCoin(container, 'coin-castle', castlePlatformX - 0.5, castlePlatformY + 0.8, castleZ, usePhysics);

  return { container, startPosition: '0 7.75 -5' };
}
