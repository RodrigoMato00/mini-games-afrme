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

  const cloudPositions = [
    [-120, 85, -90], [80, 95, -110], [-40, 92, -150], [150, 88, -80], [0, 100, -120],
    [-80, 78, -60], [100, 82, -180], [-160, 90, -100], [60, 86, -140], [130, 94, -200],
  ];
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
