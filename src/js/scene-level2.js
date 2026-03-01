/**
 * Escena del nivel 2: laberinto de día — suelo grande, cielo diurno.
 * El techo del laberinto tapa la luz dentro; la salida (tubo + castillo) queda al sol.
 */

import { createLevel2 } from './level2.js';

function hasPhysics() {
  return typeof AFRAME !== 'undefined' && AFRAME.systems && AFRAME.systems.physics;
}

export function injectSceneContentLevel2(scene) {
  const assets = document.createElement('a-assets');
  assets.innerHTML = [
    '<img id="tex-cesped" src="assets/textures/cesped.jpg">',
    '<img id="tex-ladrillo" src="assets/textures/ladrillo.jpg">',
    '<img id="tex-ladrillos-azules" src="objetos/ladrillosAzules.avif">',
    '<img id="tex-water" src="objetos/water_texture.jpg">',
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
  const { container, startPosition } = createLevel2(scene, usePhysics);
  scene.appendChild(container);

  scene.dataset.playerStartPosition = startPosition || '';

  applyBrickTealColor(scene);
  return startPosition;
}

const BRICK_TEAL_HEX = 0x6B9B8A;

function applyBrickTealColor(scene) {
  setTimeout(() => {
    scene.querySelectorAll('[data-brick-teal]').forEach((el) => {
      if (!el.object3D) return;
      el.object3D.traverse((obj) => {
        if (obj.isMesh && obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m.color) m.color.setHex(BRICK_TEAL_HEX);
          });
        }
      });
    });
  }, 200);
}
