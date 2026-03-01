/**
 * Entry point for Level 6: random maze minigame. Collect 10 coins to win.
 */

import { injectSceneContentLevel6 } from './scene-level6.js';
import { Game } from './game.js';
import { createLevel6, TOTAL_COINS_LEVEL6 } from './level6.js';
import { preloadBgMusic } from './sounds.js';

function init() {
  const sceneEl = document.getElementById('main-scene');
  if (!sceneEl) {
    console.error('[Retro Level 6] #main-scene not found.');
    return;
  }

  function startGame() {
    try {
      window.__currentLevel = 6;
      window.__groundIsLethal = false;
      preloadBgMusic(2).then(() => {
        const startPosition = injectSceneContentLevel6(sceneEl) || sceneEl.dataset.playerStartPosition || null;
        const game = new Game(sceneEl, {
          levelCreator: createLevel6,
          totalCoins: TOTAL_COINS_LEVEL6,
          initialTime: 1000,
          startPosition,
        });
        game.start();
      });
    } catch (err) {
      console.error('[Retro Level 6] Error starting:', err);
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
