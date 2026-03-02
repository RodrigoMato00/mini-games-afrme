/**
 * Escena del nivel 9: laberinto con Boo — paredes, techo, suelo ladrillos, castillo.
 * Boo te persigue por el laberinto.
 */

import { createLevel9 } from './level9.js';

function hasPhysics() {
  return typeof AFRAME !== 'undefined' && AFRAME.systems && AFRAME.systems.physics;
}

export function injectSceneContentLevel9(scene) {
  const assets = document.createElement('a-assets');
  assets.innerHTML = [
    '<a-asset-item id="booObj" src="objetos/super-mario-world-boo/source/boo_obj.obj"></a-asset-item>',
    '<a-asset-item id="booMtl" src="objetos/super-mario-world-boo/source/boo_obj.mtl"></a-asset-item>',
    '<img id="tex-ladrillos-azules" src="objetos/ladrillosAzules.avif">',
    '<img id="tex-piedra" src="objetos/piedra.jpg">',
    '<a-asset-item id="coinModel" src="assets/models/mario-coin.glb"></a-asset-item>',
  ].join('\n');
  scene.appendChild(assets);

  if (hasPhysics()) {
    scene.setAttribute('physics', 'driver: local; debug: false;');
  }

  const ambient = document.createElement('a-entity');
  ambient.setAttribute('light', 'type: ambient; color: #FFFFFF; intensity: 0.65');
  scene.appendChild(ambient);

  const hemisphere = document.createElement('a-entity');
  hemisphere.setAttribute('light', 'type: hemisphere; color: #87CEEB; groundColor: #B8D4A8; intensity: 0.5');
  scene.appendChild(hemisphere);

  const directional = document.createElement('a-entity');
  directional.setAttribute('position', '20 40 20');
  directional.setAttribute('light', 'type: directional; color: #FFFEF0; intensity: 1.1; castShadow: true');
  scene.appendChild(directional);

  const sky = document.createElement('a-sky');
  sky.setAttribute('color', '#87CEEB');
  sky.setAttribute('radius', '500');
  scene.appendChild(sky);

  const ground = document.createElement('a-plane');
  ground.setAttribute('id', 'ground');
  ground.setAttribute('position', '0 0 0');
  ground.setAttribute('rotation', '-90 0 0');
  ground.setAttribute('width', '120');
  ground.setAttribute('height', '120');
  ground.setAttribute('material', 'src: #tex-ladrillos-azules; repeat: 35 35; color: #FFFFFF; metalness: 0; roughness: 1');
  ground.setAttribute('shadow', 'receive: true');
  if (hasPhysics()) ground.setAttribute('static-body', '');
  scene.appendChild(ground);

  const usePhysics = hasPhysics();
  const { container, startPosition } = createLevel9(scene, usePhysics);
  scene.appendChild(container);
  scene.dataset.playerStartPosition = startPosition || '';
  return startPosition;
}
