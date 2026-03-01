/**
 * Level 7: Winter / Snow Land — plataformas de hielo y nieve, pinos, nevada, goombas.
 * Victoria: recoger las 10 monedas. Sin portal.
 */

import { createCoin, createEnemy, createCastle, ASSET_PATHS } from './level.js';

const TEX_ICE = '#tex-hielo';
const TEX_SNOW = '#tex-nieve';
const ICE_COLOR = '#A8D8EA';
const SNOW_COLOR = '#E8F4FC';

// Pino: se usa modelo preload en escena (#pine-obj, #pine-mtl)

function createIcePlatform(parent, id, x, y, z, w, h, d, usePhysics = true) {
  const el = document.createElement('a-box');
  el.setAttribute('id', id || `ice-${x}-${y}-${z}`);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('width', w);
  el.setAttribute('height', h);
  el.setAttribute('depth', d);
  const r = `${Math.max(1, Math.ceil(w))} ${Math.max(1, Math.ceil(h))}`;
  el.setAttribute('material', `src: ${TEX_ICE}; repeat: ${r}; color: ${ICE_COLOR}; metalness: 0.2; roughness: 0.6`);
  el.setAttribute('shadow', 'cast: true; receive: true');
  el.setAttribute('class', 'platform slippery');
  el.setAttribute('data-width', String(w));
  el.setAttribute('data-height', String(h));
  el.setAttribute('data-depth', String(d));
  if (usePhysics) el.setAttribute('static-body', '');
  parent.appendChild(el);
  return el;
}

function createSnowPlatform(parent, id, x, y, z, w, h, d, usePhysics = true) {
  const el = document.createElement('a-box');
  el.setAttribute('id', id || `snow-${x}-${y}-${z}`);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('width', w);
  el.setAttribute('height', h);
  el.setAttribute('depth', d);
  const r = `${Math.max(1, Math.ceil(w))} ${Math.max(1, Math.ceil(h))}`;
  el.setAttribute('material', `src: ${TEX_SNOW}; repeat: ${r}; color: ${SNOW_COLOR}; metalness: 0; roughness: 1`);
  el.setAttribute('shadow', 'cast: true; receive: true');
  el.setAttribute('class', 'platform');
  el.setAttribute('data-width', String(w));
  el.setAttribute('data-height', String(h));
  el.setAttribute('data-depth', String(d));
  if (usePhysics) el.setAttribute('static-body', '');
  parent.appendChild(el);
  return el;
}

function createPine(parent, id, x, y, z, scale = 0.012) {
  const el = document.createElement('a-entity');
  el.setAttribute('id', id || `pine-${x}-${y}-${z}`);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('scale', `${scale} ${scale} ${scale}`);
  el.setAttribute('obj-model', 'obj: #pine-obj; mtl: #pine-mtl');
  el.setAttribute('shadow', 'cast: true; receive: true');
  parent.appendChild(el);
  return el;
}

export const TOTAL_COINS_LEVEL7 = 10;

export function createLevel7(scene, usePhysics = true) {
  const container = document.createElement('a-entity');
  container.setAttribute('id', 'level');

  // Plataformas: mezcla nieve (suelo elevado) e hielo (resbaladizo visual)
  const platforms = [
    [0, 0.5, -5, 4, 1, 3, 'snow'],
    [4, 0.5, -5, 2.5, 1, 2, 'ice'],
    [7, 1, -5, 2, 1, 2, 'snow'],
    [10, 0.5, -6, 3, 1, 2, 'ice'],
    [14, 1.2, -5, 2, 1, 2, 'snow'],
    [17, 0.5, -5, 2.5, 1, 2, 'ice'],
    [20, 1.5, -5, 2, 1, 2, 'snow'],
    [23, 0.5, -6, 3, 1, 2, 'ice'],
    [27, 1, -5, 2, 1, 2, 'snow'],
    [30, 1.5, -5, 2.5, 1, 2, 'ice'],
    [33, 0.5, -6, 3, 1, 2, 'snow'],
    [37, 0.5, -6, 4, 1, 3, 'snow'],
  ];
  platforms.forEach(([x, y, z, w, h, d, type], i) => {
    if (type === 'ice') createIcePlatform(container, `platform-${i}`, x, y, z, w, h, d, usePhysics);
    else createSnowPlatform(container, `platform-${i}`, x, y, z, w, h, d, usePhysics);
  });

  // Pinos en el BORDE de las plataformas (no en el centro, no donde están las monedas)
  // Posiciones en esquina/ lateral de cada plataforma, escala más grande
  // [x, y (techo plataforma), z, scale]
  const pines = [
    [-1.2, 1, -6.2, 0.08],    // borde izq/atrás plataforma 0
    [4.5, 1, -4, 0.075],      // borde delantero plataforma 1
    [6.2, 1.5, -5.8, 0.07],   // lateral plataforma 2
    [11.8, 1, -6.8, 0.072],   // atrás plataforma 3
    [13.2, 1.7, -4, 0.068],   // delante plataforma 4
    [18, 1, -4.2, 0.075],    // lateral plataforma 5
    [19.5, 2, -5.8, 0.07],   // atrás plataforma 6
    [24, 1.5, -5.2, 0.072],   // lateral plataforma 7
    [28, 1.5, -4.2, 0.075],   // delante plataforma 8
    [36, 1, -7, 0.08],        // atrás plataforma 9
  ];
  pines.forEach(([x, y, z, scale], i) => {
    createPine(container, `pine-${i}`, x, y, z, scale);
  });

  // Monedas (9 en nivel + 1 en castillo = 10)
  const coinPositions = [
    [1.5, 1.2, -5],
    [5.5, 1.2, -5],
    [8.5, 1.5, -5],
    [12, 1.2, -6],
    [17.5, 1.2, -5],
    [21, 2, -5],
    [25, 1.5, -6],
    [29, 1.5, -5],
    [34, 1.2, -6],
  ];
  coinPositions.forEach(([x, y, z], i) => {
    createCoin(container, `coin-${i}`, x, y, z, usePhysics);
  });

  // Goombas
  const enemies = [
    [4, 1, -5, 0.6],
    [10, 1, -6, 0.5],
    [17, 1, -5, 0.6],
    [23, 1, -6, 0.5],
    [30, 2, -5, 0.6],
  ];
  enemies.forEach(([x, y, z], i) => {
    createEnemy(container, `enemy-${i}`, x, y, z, 0.7);
  });

  // Castillo final
  const castleX = 39;
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
