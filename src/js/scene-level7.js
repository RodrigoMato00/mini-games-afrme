/**
 * Escena del nivel 7: Winter / Snow Land — hielo, nieve, pinos y nevada (efecto nativo A-Frame).
 */

import { registerSnowfallComponent } from './snow-effect.js';
import { createLevel7 } from './level7.js';

registerSnowfallComponent();

function hasPhysics() {
  return typeof AFRAME !== 'undefined' && AFRAME.systems && AFRAME.systems.physics;
}

const PINE_OBJ_URL = 'objetos/low-poly-pine/source/Low%20Poly%20Pine/Low%20Poly%20Pine.obj';
const PINE_MTL_URL = 'objetos/low-poly-pine/source/Low%20Poly%20Pine/Low%20Poly%20Pine.mtl';

export function injectSceneContentLevel7(scene) {
  const assets = document.createElement('a-assets');
  assets.innerHTML = [
    '<img id="tex-hielo" src="objetos/hielo.avif">',
    '<img id="tex-nieve" src="objetos/nieve.jpg">',
    '<img id="tex-agua-congelada" src="objetos/aguaCongelada.avif">',
    '<a-asset-item id="coinModel" src="assets/models/mario-coin.glb"></a-asset-item>',
    `<a-asset-item id="pine-obj" src="${PINE_OBJ_URL}"></a-asset-item>`,
    `<a-asset-item id="pine-mtl" src="${PINE_MTL_URL}"></a-asset-item>`,
  ].join('\n');
  scene.appendChild(assets);

  if (hasPhysics()) {
    scene.setAttribute('physics', 'driver: local; debug: false;');
  }

  const ambient = document.createElement('a-entity');
  ambient.setAttribute('light', 'type: ambient; color: #B8D4E8; intensity: 0.7');
  scene.appendChild(ambient);

  const hemisphere = document.createElement('a-entity');
  hemisphere.setAttribute('light', 'type: hemisphere; color: #E8F4FC; groundColor: #C8E0F0; intensity: 0.6');
  scene.appendChild(hemisphere);

  const directional = document.createElement('a-entity');
  directional.setAttribute('position', '15 40 -15');
  directional.setAttribute('light', 'type: directional; color: #FFF8F0; intensity: 0.95; castShadow: true');
  scene.appendChild(directional);

  const sky = document.createElement('a-sky');
  sky.setAttribute('color', '#87CEEB');
  sky.setAttribute('radius', '500');
  scene.appendChild(sky);

  const ground = document.createElement('a-plane');
  ground.setAttribute('id', 'ground');
  ground.setAttribute('position', '18 0 -6');
  ground.setAttribute('rotation', '-90 0 0');
  ground.setAttribute('width', '50');
  ground.setAttribute('height', '32');
  ground.setAttribute('material', 'src: #tex-agua-congelada; repeat: 25 18; color: #C8E0F0; metalness: 0.1; roughness: 0.9');
  ground.setAttribute('shadow', 'receive: true');
  if (hasPhysics()) ground.setAttribute('static-body', '');
  scene.appendChild(ground);

  // Nevada: efecto nativo (copos que caen, sin GLB ni librerías externas)
  const snowfallEl = document.createElement('a-entity');
  snowfallEl.setAttribute('id', 'snowfall');
  snowfallEl.setAttribute('snowfall', '');
  scene.appendChild(snowfallEl);

  const usePhysics = hasPhysics();
  const { container, startPosition } = createLevel7(scene, usePhysics);
  scene.appendChild(container);
  scene.dataset.playerStartPosition = startPosition || '';
  return startPosition;
}
