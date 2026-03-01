/**
 * Inyecta en la escena (ya existente en el DOM) assets, suelo, luces y nivel.
 * Usa texturas locales (césped, ladrillo) y precarga el modelo de moneda.
 */

import { createLevel } from './level.js';

function hasPhysics() {
  return typeof AFRAME !== 'undefined' && AFRAME.systems && AFRAME.systems.physics;
}

export function injectSceneContent(scene) {
  // Precarga de modelos y texturas (doc A-Frame: a-assets)
  const assets = document.createElement('a-assets');
  assets.innerHTML = [
    '<img id="tex-cesped" src="assets/textures/cesped.jpg">',
    '<img id="tex-ladrillo" src="assets/textures/ladrillo.jpg">',
    '<img id="tex-water" src="objetos/water_texture.jpg">',
    '<a-asset-item id="coinModel" src="assets/models/mario-coin.glb"></a-asset-item>',
  ].join('\n');
  scene.appendChild(assets);

  if (hasPhysics()) {
    scene.setAttribute('physics', 'driver: local; debug: false;');
  }

  const ambient = document.createElement('a-entity');
  ambient.setAttribute('light', 'type: ambient; color: #FFFFFF; intensity: 0.9');
  scene.appendChild(ambient);

  const hemisphere = document.createElement('a-entity');
  hemisphere.setAttribute('light', 'type: hemisphere; color: #87CEEB; groundColor: #B8D4A8; intensity: 0.6');
  scene.appendChild(hemisphere);

  const directional = document.createElement('a-entity');
  directional.setAttribute('position', '5 18 8');
  directional.setAttribute('light', 'type: directional; color: #FFFEF0; intensity: 1.25; castShadow: true');
  scene.appendChild(directional);

  const sky = document.createElement('a-sky');
  sky.setAttribute('color', '#87CEEB');
  sky.setAttribute('radius', '500');
  scene.appendChild(sky);

  const SKY_RADIUS = 500;
  const FOG_NEAR = 25;
  const FOG_FAR = 85;
  const cloudPositions = [
    [-38, 28, -35], [-28, 30, -55], [-18, 26, -65],
    [-8, 29, -40], [0, 27, -50], [8, 31, -60],
    [12, 25, -30], [22, 28, -45], [28, 30, -55],
    [15, 27, 10], [25, 29, 18], [32, 26, 6], [-10, 28, 12], [5, 30, 22], [30, 25, 14],
    [35, 29, -25], [38, 27, -40], [-35, 31, 8], [18, 26, -20],
  ];
  console.log('[cielo] Tamaño del cielo: a-sky radius =', SKY_RADIUS, '| fog near =', FOG_NEAR, 'far =', FOG_FAR, '(solo se ve bien dentro de ~' + FOG_FAR + ' unidades)');
  console.log('[cielo] Nubes (esferas): cantidad =', cloudPositions.length, '| posiciones =', JSON.stringify(cloudPositions));
  const xs = cloudPositions.map((p) => p[0]);
  const ys = cloudPositions.map((p) => p[1]);
  const zs = cloudPositions.map((p) => p[2]);
  console.log('[cielo] Rango nubes: X', Math.min(...xs).toFixed(0), 'a', Math.max(...xs).toFixed(0), '| Y', Math.min(...ys).toFixed(0), 'a', Math.max(...ys).toFixed(0), '| Z', Math.min(...zs).toFixed(0), 'a', Math.max(...zs).toFixed(0), '→ repartidas en el cielo visible');
  cloudPositions.forEach((pos, i) => {
    const cloud = document.createElement('a-entity');
    cloud.setAttribute('position', pos.join(' '));
    cloud.setAttribute('id', `cloud-${i}`);
    const sphere = document.createElement('a-sphere');
    sphere.setAttribute('radius', '6');
    sphere.setAttribute('scale', '1 0.25 1.2');
    sphere.setAttribute('material', 'color: #FFFFFF; opacity: 0.82; transparent: true');
    cloud.appendChild(sphere);
    scene.appendChild(cloud);
  });

  const ground = document.createElement('a-plane');
  ground.setAttribute('id', 'ground');
  ground.setAttribute('position', '0 0 0');
  ground.setAttribute('rotation', '-90 0 0');
  ground.setAttribute('width', '60');
  ground.setAttribute('height', '60');
  ground.setAttribute('material', 'src: #tex-water; repeat: 25 25; color: #7EC8E3; metalness: 0; roughness: 1');
  ground.setAttribute('shadow', 'receive: true');
  if (hasPhysics()) ground.setAttribute('static-body', '');
  scene.appendChild(ground);

  const usePhysics = hasPhysics();
  const levelContainer = createLevel(scene, usePhysics);
  scene.appendChild(levelContainer);
}
