/**
 * Punto de entrada del Nivel 2: escena subterránea, inyecta contenido con scene-level2 y arranca el juego con createLevel2.
 */

import { injectSceneContentLevel2 } from './scene-level2.js';
import { Game } from './game.js';
import { createLevel2, TOTAL_COINS_LEVEL2 } from './level2.js';
import { preloadBgMusic } from './sounds.js';

function init() {
  const sceneEl = document.getElementById('main-scene');
  if (!sceneEl) {
    console.error('[Retro Nivel 2] No se encontró #main-scene en el DOM.');
    return;
  }

  function startGame() {
    try {
      window.__currentLevel = 2;
      window.__groundIsLethal = false;
      preloadBgMusic(2).then(() => {
        const startPosition = injectSceneContentLevel2(sceneEl) || sceneEl.dataset.playerStartPosition || null;
        const game = new Game(sceneEl, {
          levelCreator: createLevel2,
          totalCoins: TOTAL_COINS_LEVEL2,
          initialTime: 1000,
          startPosition,
        });
        game.start();
      });
    } catch (err) {
      console.error('[Retro Nivel 2] Error al iniciar:', err);
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
