/**
 * Define y crea el nivel tipo Mario/retro: plataformas, bloques, ítems.
 * Estilo low-poly / colores planos para look retro en 3D.
 */

const RETRO_COLORS = {
  brick: '#B53120',
  block: '#C68C53',
  pipe: '#1E7A1E',
  coin: '#F1C40F',
  platform: '#3D9B35',
  hazard: '#4A0000',
  skyBlock: '#5C94FC',
};

/** Texturas locales (césped, ladrillo, agua para suelo y plataformas) */
const TEXTURE_URLS = {
  brick: '#tex-ladrillo',
  grass: '#tex-cesped',
  water: '#tex-water',
};

const ASSET_PATHS = {
  coinModel: '#coinModel',
  goombaTexture: 'assets/textures/goomba/mi_body_alb.png',
  goombaModel: 'assets/models/goomba.fbx',
  castleModel: 'assets/models/castle.fbx',
  pipeModel: 'assets/models/pipe.fbx',
};

function createBox(parent, id, x, y, z, w, h, d, color, usePhysics = true, extraClass = '', textureKey = '') {
  const el = document.createElement('a-box');
  el.setAttribute('id', id || `box-${x}-${y}-${z}`);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('width', w);
  el.setAttribute('height', h);
  el.setAttribute('depth', d);
  if (textureKey && TEXTURE_URLS[textureKey]) {
    const r = `${Math.max(1, Math.ceil(w))} ${Math.max(1, Math.ceil(h))}`;
    el.setAttribute('material', `src: ${TEXTURE_URLS[textureKey]}; repeat: ${r}; color: ${color}; metalness: 0; roughness: 1`);
  } else {
    el.setAttribute('color', color);
  }
  el.setAttribute('shadow', 'cast: true; receive: true');
  el.setAttribute('class', `platform ${extraClass}`.trim());
  if (usePhysics) el.setAttribute('static-body', '');
  parent.appendChild(el);
  return el;
}

function createCoin(parent, id, x, y, z, usePhysics = true) {
  const el = document.createElement('a-entity');
  el.setAttribute('id', id || `coin-${x}-${y}-${z}`);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('gltf-model', ASSET_PATHS.coinModel);
  el.setAttribute('scale', '0.2 0.2 0.2');
  el.setAttribute('rotation', '90 0 0');
  el.setAttribute('animation', 'property: rotation; from: 90 0 0; to: 90 360 0; dur: 1500; loop: true; easing: linear');
  el.setAttribute('class', 'collectable');
  el.setAttribute('shadow', 'cast: true; receive: false');
  if (usePhysics) {
    el.setAttribute('static-body', 'shape: sphere; sphereRadius: 0.15');
    el.setAttribute('collectable', '');
  }
  parent.appendChild(el);
  return el;
}

function createPipe(parent, id, x, y, z, w, h, d, usePhysics = true) {
  const el = document.createElement('a-entity');
  el.setAttribute('id', id || `pipe-${x}-${y}-${z}`);
  el.setAttribute('position', `${x} ${y} ${z}`);
  el.setAttribute('data-width', w);
  el.setAttribute('data-height', h);
  el.setAttribute('data-depth', d);
  el.setAttribute('fbx-model', `src: ${ASSET_PATHS.pipeModel}; scale: 0.1 0.18 0.1; rotation: 0 0 0`);
  el.setAttribute('shadow', 'cast: true; receive: true');
  el.setAttribute('class', 'platform');
  if (usePhysics) el.setAttribute('static-body', '');
  parent.appendChild(el);
  return el;
}

/**
 * Estructura del nivel: array de plataformas/bloques.
 * [x, y, z, width, height, depth, colorKey]
 */
const LEVEL_DATA = [
  // Plataforma inicial
  [0, 0.5, -5, 4, 1, 3, 'platform'],
  // Bloques flotantes (tipo Mario)
  [4, 1, -6, 2, 1, 2, 'brick'],
  [7, 1.5, -5, 2, 1, 2, 'block'],
  [10, 1, -7, 3, 1, 2, 'brick'],
  [14, 2, -6, 2, 1, 2, 'block'],
  [17, 1, -5, 4, 1, 2, 'platform'],
  [22, 1.5, -6, 2, 1, 2, 'brick'],
  [25, 2.5, -5, 2, 1, 2, 'block'],
  [28, 1, -7, 5, 1, 2, 'platform'],
  // “Tubería” decorativa
  [12, 1.5, -3, 1.5, 3, 1.5, 'pipe'],
  [20, 1.5, -4, 1.5, 3, 1.5, 'pipe'],
  // Bloques golpeables (tipo ?)
  [6, 2, -5.5, 1, 1, 1, 'hittable'],
  [16, 2.5, -5.5, 1, 1, 1, 'hittable'],
  // Monedas (9 en nivel + 1 en castillo = 10 total)
  [2, 1.8, -5, 0, 0, 0, 'coin'],
  [5, 2.2, -6, 0, 0, 0, 'coin'],
  [8, 2.5, -5, 0, 0, 0, 'coin'],
  [11, 2, -7, 0, 0, 0, 'coin'],
  [15, 3.2, -6, 0, 0, 0, 'coin'],
  [18, 2.2, -5, 0, 0, 0, 'coin'],
  [23, 2.5, -6, 0, 0, 0, 'coin'],
  [26, 3.5, -5, 0, 0, 0, 'coin'],
  [29, 2, -7, 0, 0, 0, 'coin'],
];

function createEnemy(parent, id, x, y, z, range = 2) {
  const root = document.createElement('a-entity');
  root.setAttribute('id', id || `enemy-${x}-${y}-${z}`);
  root.setAttribute('position', `${x} ${y} ${z}`);
  root.setAttribute('class', 'enemy');
  root.setAttribute('enemy-movement', `range: ${range}; axis: x`);

  const model = document.createElement('a-entity');
  model.setAttribute('fbx-model', `src: ${ASSET_PATHS.goombaModel}; scale: 0.5 0.5 0.5; rotation: 0 0 0; resourcePath: assets/textures/goomba/`);
  model.setAttribute('shadow', 'cast: true');
  root.appendChild(model);

  parent.appendChild(root);
  return root;
}

export function createLevel(scene, usePhysics = true) {
  const container = document.createElement('a-entity');
  container.setAttribute('id', 'level');

  LEVEL_DATA.forEach((row, i) => {
    const [x, y, z, w, h, d, colorKey] = row;
    const color = RETRO_COLORS[colorKey] || RETRO_COLORS.block;

    if (colorKey === 'coin') {
      createCoin(container, `coin-${i}`, x, y, z, usePhysics);
    } else if (colorKey === 'hittable') {
      const box = createBox(container, `hittable-${i}`, x, y, z, w, h, d, '#F1C40F', usePhysics, 'hittable');
      box.setAttribute('hittable-block', '');
    } else if (colorKey === 'pipe') {
      createPipe(container, `pipe-${i}`, x, y, z, w, h, d, usePhysics);
    } else {
      const tex = colorKey === 'brick' ? 'brick' : 'grass';
      createBox(container, `platform-${i}`, x, y, z, w, h, d, color, usePhysics, '', tex);
    }
  });

  createEnemy(container, 'enemy-1', 4.5, 1.5, -6, 0.5);
  createEnemy(container, 'enemy-2', 18, 1.5, -5, 1.3);
  createEnemy(container, 'enemy-3', 25.5, 3, -5.5, 0.5);

  createCastle(container, usePhysics);

  return container;
}

function createCastle(parent, usePhysics) {
  const cx = 30;
  const cz = -7;

  const base = document.createElement('a-entity');
  base.setAttribute('id', 'castle');
  base.setAttribute('position', `${cx} 1.2 ${cz}`);
  base.setAttribute('rotation', '0 90 0');
  base.setAttribute('fbx-model', `src: ${ASSET_PATHS.castleModel}; scale: 0.0006 0.0006 0.0006; rotation: 0 0 0`);
  base.setAttribute('shadow', 'cast: true; receive: true');
  if (usePhysics) base.setAttribute('static-body', '');

  parent.appendChild(base);
  createCoin(parent, 'coin-castle', cx - 1.2, 2, cz, usePhysics);
}

export { RETRO_COLORS, createBox, createCoin, LEVEL_DATA };
