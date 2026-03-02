/**
 * Escena del nivel 8: Sky Platforms — plataformas flotantes, vacío abajo.
 * Sin suelo visible; caer = perder.
 */

import { createLevel8 } from './level8.js';

function hasPhysics() {
  return typeof AFRAME !== 'undefined' && AFRAME.systems && AFRAME.systems.physics;
}

export function injectSceneContentLevel8(scene) {
  const assets = document.createElement('a-assets');
  assets.innerHTML = [
    '<img id="tex-cielo-voxel" src="objetos/cieloVoxel.avif">',
    '<img id="tex-pasto-voxel" src="objetos/pastoVoxel.png">',
    '<img id="tex-ladrillo-voxel" src="objetos/ladrilloVoxel.png">',
    '<a-asset-item id="coinModel" src="assets/models/mario-coin.glb"></a-asset-item>',
  ].join('\n');
  scene.appendChild(assets);

  if (hasPhysics()) {
    scene.setAttribute('physics', 'driver: local; debug: false;');
  }

  const ambient = document.createElement('a-entity');
  ambient.setAttribute('light', 'type: ambient; color: #E8F0FF; intensity: 0.7');
  scene.appendChild(ambient);

  const hemisphere = document.createElement('a-entity');
  hemisphere.setAttribute('light', 'type: hemisphere; color: #B8D4E8; groundColor: #1a1a2e; intensity: 0.6');
  scene.appendChild(hemisphere);

  const directional = document.createElement('a-entity');
  directional.setAttribute('position', '20 40 -15');
  directional.setAttribute('light', 'type: directional; color: #FFF8E0; intensity: 0.95; castShadow: true');
  scene.appendChild(directional);

  const sky = document.createElement('a-sky');
  sky.setAttribute('src', '#tex-cielo-voxel');
  sky.setAttribute('radius', '500');
  scene.appendChild(sky);

  // Suelo invisible: no se dibuja; solo existe para que al caer se detecte muerte por posición
  const ground = document.createElement('a-plane');
  ground.setAttribute('id', 'ground');
  ground.setAttribute('position', '20 -8 -6');
  ground.setAttribute('rotation', '-90 0 0');
  ground.setAttribute('width', '80');
  ground.setAttribute('height', '40');
  ground.setAttribute('material', 'transparent: true; opacity: 0');
  ground.setAttribute('visible', 'false');
  if (hasPhysics()) ground.setAttribute('static-body', '');
  scene.appendChild(ground);

  const usePhysics = hasPhysics();
  const { container, startPosition } = createLevel8(scene, usePhysics);
  scene.appendChild(container);
  scene.dataset.playerStartPosition = startPosition || '';
  return startPosition;
}
