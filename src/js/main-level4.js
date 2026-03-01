/**
 * Punto de entrada del Nivel 4: escenario en las nubes.
 */

import { injectSceneContentLevel4 } from './scene-level4.js';
import { Game } from './game.js';
import { createLevel4, TOTAL_COINS_LEVEL4 } from './level4.js';
import { preloadBgMusic } from './sounds.js';

function init() {
  const sceneEl = document.getElementById('main-scene');
  if (!sceneEl) {
    console.error('[Retro Nivel 4] No se encontró #main-scene.');
    return;
  }

  function startGame() {
    try {
      window.__currentLevel = 4;
      window.__groundIsLethal = true;
      preloadBgMusic(4).then(() => {
        injectSceneContentLevel4(sceneEl);
        const startPosition = sceneEl.dataset.playerStartPosition || null;
        const game = new Game(sceneEl, {
          levelCreator: createLevel4,
          totalCoins: TOTAL_COINS_LEVEL4,
          initialTime: 300,
          startPosition,
        });
        game.start();
      });
    } catch (err) {
      console.error('[Retro Nivel 4] Error:', err);
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
