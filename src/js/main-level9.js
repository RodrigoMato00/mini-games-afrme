/**
 * Entry point for Level 9: Boo (enemy from Mario Boo Minecraft Build).
 */

import './boo-look-detector.js';
import './boo-chase.js';
import { injectSceneContentLevel9 } from './scene-level9.js';
import { Game } from './game.js';
import { createLevel9, TOTAL_COINS_LEVEL9 } from './level9.js';
import { preloadBgMusic } from './sounds.js';

function init() {
  const sceneEl = document.getElementById('main-scene');
  if (!sceneEl) {
    console.error('[Retro Level 9] #main-scene not found.');
    return;
  }

  function startGame() {
    try {
      window.__currentLevel = 9;
      window.__groundIsLethal = false;
      window.__level5GroundCountdown = null;
      window.__lastLanding = null;
      preloadBgMusic(9).then(() => {
        const startPosition = injectSceneContentLevel9(sceneEl) || sceneEl.dataset.playerStartPosition || null;
        const game = new Game(sceneEl, {
          levelCreator: createLevel9,
          totalCoins: TOTAL_COINS_LEVEL9,
          initialTime: 1000,
          startPosition,
        });
        game.start();
      });
    } catch (err) {
      console.error('[Retro Level 9] Error:', err);
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
