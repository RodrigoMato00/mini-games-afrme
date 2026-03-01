/**
 * Escena del nivel 4: cielo en las nubes, agua abajo (letal).
 */

import { createLevel4 } from './level4.js';

function hasPhysics() {
  return typeof AFRAME !== 'undefined' && AFRAME.systems && AFRAME.systems.physics;
}

export function injectSceneContentLevel4(scene) {
  const assets = document.createElement('a-assets');
  assets.innerHTML = [
    '<a-asset-item id="cloud-obj" src="objetos/clouds_extract/source/clouds/cloud.obj"></a-asset-item>',
    '<a-asset-item id="cloud-mtl" src="objetos/clouds_extract/source/clouds/cloud.obj.mtl"></a-asset-item>',
    '<img id="tex-water" src="objetos/water_texture.jpg">',
    '<a-asset-item id="coinModel" src="assets/models/mario-coin.glb"></a-asset-item>',
  ].join('\n');
  scene.appendChild(assets);

  if (hasPhysics()) {
    scene.setAttribute('physics', 'driver: local; debug: false;');
  }

  const ambient = document.createElement('a-entity');
  ambient.setAttribute('light', 'type: ambient; color: #B8D4E8; intensity: 0.7');
  scene.appendChild(ambient);

  const hemisphere = document.createElement('a-entity');
  hemisphere.setAttribute('light', 'type: hemisphere; color: #87CEEB; groundColor: #E0F4FF; intensity: 0.6');
  scene.appendChild(hemisphere);

  const directional = document.createElement('a-entity');
  directional.setAttribute('position', '20 50 -30');
  directional.setAttribute('light', 'type: directional; color: #FFFEF5; intensity: 1.1; castShadow: true');
  scene.appendChild(directional);

  const sky = document.createElement('a-sky');
  sky.setAttribute('color', '#87CEEB');
  sky.setAttribute('radius', '500');
  scene.appendChild(sky);

  const ground = document.createElement('a-plane');
  ground.setAttribute('id', 'ground');
  ground.setAttribute('position', '17 0 -5');
  ground.setAttribute('rotation', '-90 0 0');
  ground.setAttribute('width', '50');
  ground.setAttribute('height', '25');
  ground.setAttribute('material', 'src: #tex-water; repeat: 18 10; color: #FFFFFF; metalness: 0; roughness: 1');
  ground.setAttribute('shadow', 'receive: true');
  if (hasPhysics()) ground.setAttribute('static-body', '');
  scene.appendChild(ground);

  const usePhysics = hasPhysics();
  const { container, startPosition } = createLevel4(scene, usePhysics);
  scene.appendChild(container);
  scene.dataset.playerStartPosition = startPosition;
}
