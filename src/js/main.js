/**
 * Punto de entrada: la escena está en el HTML (id="main-scene"); aquí se inyecta contenido y se arranca el juego.
 */

import { injectSceneContent } from './scene.js';
import { Game } from './game.js';

function init() {
  const sceneEl = document.getElementById('main-scene');
  if (!sceneEl) {
    console.error('[Retro] No se encontró #main-scene en el DOM.');
    return;
  }

  function startGame() {
    try {
      injectSceneContent(sceneEl);
      const game = new Game(sceneEl);
      game.start();
    } catch (err) {
      console.error('[Retro] Error al iniciar:', err);
    }
  }

  sceneEl.addEventListener('loaded', startGame);

  // Por si 'loaded' ya se disparó antes de que nuestro script registrara el listener
  if (sceneEl.hasLoaded) startGame();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
