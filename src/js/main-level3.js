/**
 * Punto de entrada del Nivel 3: suelo de lava, plataformas de piedra, más enemigos.
 */

import { injectSceneContentLevel3 } from './scene-level3.js';
import { Game } from './game.js';
import { createLevel3, TOTAL_COINS_LEVEL3 } from './level3.js';
import { preloadBgMusic } from './sounds.js';

function init() {
  const sceneEl = document.getElementById('main-scene');
  if (!sceneEl) {
    console.error('[Retro Nivel 3] No se encontró #main-scene en el DOM.');
    return;
  }

  function startGame() {
    try {
      window.__currentLevel = 3;
      window.__groundIsLethal = true;
      preloadBgMusic(3).then(() => {
        injectSceneContentLevel3(sceneEl);
        const game = new Game(sceneEl, {
          levelCreator: createLevel3,
          totalCoins: TOTAL_COINS_LEVEL3,
          initialTime: 240,
        });
        game.start();
      });
    } catch (err) {
      console.error('[Retro Nivel 3] Error al iniciar:', err);
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
