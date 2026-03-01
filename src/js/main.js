/**
 * Punto de entrada: la escena está en el HTML (id="main-scene"); aquí se inyecta contenido y se arranca el juego.
 * La música de fondo se precarga antes de cargar el nivel.
 */

import { injectSceneContent } from './scene.js';
import { Game } from './game.js';
import { preloadBgMusic } from './sounds.js';

function init() {
  const sceneEl = document.getElementById('main-scene');
  if (!sceneEl) {
    console.error('[Retro] No se encontró #main-scene en el DOM.');
    return;
  }

  function startGame() {
    try {
      window.__currentLevel = 1;
      window.__groundIsLethal = true;
      preloadBgMusic(1).then(() => {
        injectSceneContent(sceneEl);
        const game = new Game(sceneEl);
        game.start();
      });
    } catch (err) {
      console.error('[Retro] Error al iniciar:', err);
    }
  }

  sceneEl.addEventListener('loaded', startGame);

  if (sceneEl.hasLoaded) startGame();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
