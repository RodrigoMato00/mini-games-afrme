/**
 * Escena del nivel 3: suelo de lava, textura piedra en plataformas.
 * Similar al nivel 1 pero con lava en lugar de agua y piedra en lugar de ladrillo.
 */

import { createLevel3 } from './level3.js';

function hasPhysics() {
  return typeof AFRAME !== 'undefined' && AFRAME.systems && AFRAME.systems.physics;
}

export function injectSceneContentLevel3(scene) {
  const assets = document.createElement('a-assets');
  assets.innerHTML = [
    '<img id="tex-lava" src="objetos/lava.png">',
    '<img id="tex-piedra" src="objetos/piedra.jpg">',
    '<img id="tex-moon" src="objetos/moon/textures/8k_moon.jpg">',
    '<a-asset-item id="coinModel" src="assets/models/mario-coin.glb"></a-asset-item>',
  ].join('\n');
  scene.appendChild(assets);

  if (hasPhysics()) {
    scene.setAttribute('physics', 'driver: local; debug: false;');
  }

  const ambient = document.createElement('a-entity');
  ambient.setAttribute('light', 'type: ambient; color: #8B9FC8; intensity: 0.55');
  scene.appendChild(ambient);

  const hemisphere = document.createElement('a-entity');
  hemisphere.setAttribute('light', 'type: hemisphere; color: #3a3a6a; groundColor: #2a2a40; intensity: 0.45');
  scene.appendChild(hemisphere);

  const directional = document.createElement('a-entity');
  directional.setAttribute('position', '15 60 -40');
  directional.setAttribute('light', 'type: directional; color: #E8E8F0; intensity: 0.5; castShadow: true');
  scene.appendChild(directional);

  const sky = document.createElement('a-sky');
  sky.setAttribute('color', '#0a0a2e');
  sky.setAttribute('radius', '500');
  scene.appendChild(sky);

  const moonEl = document.createElement('a-entity');
  moonEl.setAttribute('id', 'moon');
  moonEl.setAttribute('position', '20 50 -30');
  const moonSphere = document.createElement('a-sphere');
  moonSphere.setAttribute('radius', '12');
  moonSphere.setAttribute('material', 'src: #tex-moon; color: #FFFFFF; metalness: 0; roughness: 1');
  moonSphere.setAttribute('shadow', 'cast: false; receive: false');
  moonEl.appendChild(moonSphere);
  scene.appendChild(moonEl);

  const moonDirectional = document.createElement('a-entity');
  moonDirectional.setAttribute('id', 'moon-light');
  moonDirectional.setAttribute('light', 'type: directional; color: #F0F0FF; intensity: 1.35; castShadow: true; target: #moon-light-target');
  moonDirectional.setAttribute('position', '-20 -50 30');
  const moonLightTarget = document.createElement('a-entity');
  moonLightTarget.setAttribute('id', 'moon-light-target');
  moonLightTarget.setAttribute('position', '40 100 -60');
  moonDirectional.appendChild(moonLightTarget);
  scene.appendChild(moonDirectional);

  const ground = document.createElement('a-plane');
  ground.setAttribute('id', 'ground');
  ground.setAttribute('position', '0 0 0');
  ground.setAttribute('rotation', '-90 0 0');
  ground.setAttribute('width', '60');
  ground.setAttribute('height', '60');
  ground.setAttribute('material', 'src: #tex-lava; repeat: 25 25; color: #FFFFFF; metalness: 0; roughness: 1');
  ground.setAttribute('shadow', 'receive: true');
  if (hasPhysics()) ground.setAttribute('static-body', '');
  scene.appendChild(ground);

  const usePhysics = hasPhysics();
  const levelContainer = createLevel3(scene, usePhysics);
  scene.appendChild(levelContainer);
}
