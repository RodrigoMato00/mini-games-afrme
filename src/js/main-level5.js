/**
 * Entry point for Level 5: Pipe Land.
 */

import { injectSceneContentLevel5 } from './scene-level5.js';
import { Game } from './game.js';
import { createLevel5, TOTAL_COINS_LEVEL5 } from './level5.js';
import { preloadBgMusic } from './sounds.js';

function init() {
  const sceneEl = document.getElementById('main-scene');
  if (!sceneEl) {
    console.error('[Retro Level 5] #main-scene not found.');
    return;
  }

  function startGame() {
    try {
      window.__currentLevel = 5;
      window.__groundIsLethal = false;
      window.__level5GroundCountdown = null;
      window.__lastLanding = null;
      preloadBgMusic(5).then(() => {
        const startPosition = injectSceneContentLevel5(sceneEl) || sceneEl.dataset.playerStartPosition || null;
        const game = new Game(sceneEl, {
          levelCreator: createLevel5,
          totalCoins: TOTAL_COINS_LEVEL5,
          initialTime: 300,
          startPosition,
        });
        game.start();
      });
    } catch (err) {
      console.error('[Retro Level 5] Error:', err);
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
