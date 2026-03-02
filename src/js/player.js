/**
 * Jugador: entidad con cámara y control (WASD + salto).
 * Con física: dynamic-body + player-controller. Sin física: player-controller-simple.
 */

export function createPlayer(sceneEl, usePhysics = true) {
  const player = document.createElement('a-entity');
  player.setAttribute('id', 'player');
  player.setAttribute('position', '0 2 -5');
  player.setAttribute('rotation', '0 0 0');

  const camera = document.createElement('a-entity');
  camera.setAttribute('camera', 'active: true; fov: 75; near: 0.1; far: 1000');
  camera.setAttribute('look-controls', 'pointerLockEnabled: true');
  camera.setAttribute('raycaster', 'objects: .interactable');
  player.appendChild(camera);

  const body = document.createElement('a-cylinder');
  body.setAttribute('radius', '0.4');
  body.setAttribute('height', '1.6');
  body.setAttribute('position', '0 -0.8 0');
  body.setAttribute('color', '#4A90D9');
  body.setAttribute('visible', 'false');
  player.appendChild(body);

  if (usePhysics) {
    player.setAttribute('dynamic-body', 'mass: 1; linearDamping: 0.3; angularDamping: 0.9; shape: none');
    player.setAttribute('shape', 'shape: box; halfExtents: 0.4 0.8 0.4');
    player.setAttribute('player-controller', '');
  } else {
    player.setAttribute('player-controller-simple', '');
  }

  sceneEl.appendChild(player);
  return player;
}
