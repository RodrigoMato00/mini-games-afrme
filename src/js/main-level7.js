/**
 * Entry point for Level 7: Winter / Snow Land.
 */

import { injectSceneContentLevel7 } from './scene-level7.js';
import { Game } from './game.js';
import { createLevel7, TOTAL_COINS_LEVEL7 } from './level7.js';
import { preloadBgMusic } from './sounds.js';

function init() {
  const sceneEl = document.getElementById('main-scene');
  if (!sceneEl) {
    console.error('[Retro Level 7] #main-scene not found.');
    return;
  }

  function startGame() {
    try {
      window.__currentLevel = 7;
      window.__groundIsLethal = true;
      window.__level5GroundCountdown = null;
      window.__lastLanding = null;
      window.__level7MapBounds = { xMin: -3, xMax: 43, zMin: -12, zMax: 2 };
      preloadBgMusic(7).then(() => {
        const startPosition = injectSceneContentLevel7(sceneEl) || sceneEl.dataset.playerStartPosition || null;
        const game = new Game(sceneEl, {
          levelCreator: createLevel7,
          totalCoins: TOTAL_COINS_LEVEL7,
          initialTime: 300,
          startPosition,
        });
        game.start();
      });
    } catch (err) {
      console.error('[Retro Level 7] Error:', err);
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
