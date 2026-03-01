/**
 * Escena del nivel 5: Pipe Land — ambiente subterráneo, ladrillos y tuberías.
 */

import { createLevel5 } from './level5.js';

function hasPhysics() {
  return typeof AFRAME !== 'undefined' && AFRAME.systems && AFRAME.systems.physics;
}

export function injectSceneContentLevel5(scene) {
  const assets = document.createElement('a-assets');
  assets.innerHTML = [
    '<img id="tex-ladrillo" src="assets/textures/ladrillo.jpg">',
    '<img id="tex-piedra" src="objetos/piedra.jpg">',
    '<a-asset-item id="coinModel" src="assets/models/mario-coin.glb"></a-asset-item>',
  ].join('\n');
  scene.appendChild(assets);

  if (hasPhysics()) {
    scene.setAttribute('physics', 'driver: local; debug: false;');
  }

  const ambient = document.createElement('a-entity');
  ambient.setAttribute('light', 'type: ambient; color: #E8DCC8; intensity: 0.6');
  scene.appendChild(ambient);

  const hemisphere = document.createElement('a-entity');
  hemisphere.setAttribute('light', 'type: hemisphere; color: #6B8E6B; groundColor: #4a3a2a; intensity: 0.5');
  scene.appendChild(hemisphere);

  const directional = document.createElement('a-entity');
  directional.setAttribute('position', '20 30 -20');
  directional.setAttribute('light', 'type: directional; color: #FFF8E0; intensity: 0.9; castShadow: true');
  scene.appendChild(directional);

  const sky = document.createElement('a-sky');
  sky.setAttribute('color', '#2a3a2a');
  sky.setAttribute('radius', '500');
  scene.appendChild(sky);

  const ground = document.createElement('a-plane');
  ground.setAttribute('id', 'ground');
  ground.setAttribute('position', '18 0 -6');
  ground.setAttribute('rotation', '-90 0 0');
  ground.setAttribute('width', '50');
  ground.setAttribute('height', '30');
  ground.setAttribute('material', 'src: #tex-piedra; repeat: 25 18; color: #5a5048; metalness: 0; roughness: 1');
  ground.setAttribute('shadow', 'receive: true');
  if (hasPhysics()) ground.setAttribute('static-body', '');
  scene.appendChild(ground);

  const usePhysics = hasPhysics();
  const { container, startPosition } = createLevel5(scene, usePhysics);
  scene.appendChild(container);
  scene.dataset.playerStartPosition = startPosition || '';
  return startPosition;
}
