/**
 * Entry point for Level 8: Voxel Land (enemies from GOOMBA.vox).
 */

import { registerVoxModel } from './vox-model.js';
import { injectSceneContentLevel8 } from './scene-level8.js';
import { Game } from './game.js';
import { createLevel8, TOTAL_COINS_LEVEL8 } from './level8.js';
import { preloadBgMusic } from './sounds.js';

registerVoxModel();

function init() {
  const sceneEl = document.getElementById('main-scene');
  if (!sceneEl) {
    console.error('[Retro Level 8] #main-scene not found.');
    return;
  }

  function startGame() {
    try {
      window.__currentLevel = 8;
      window.__groundIsLethal = true;
      window.__level5GroundCountdown = null;
      window.__lastLanding = null;
      window.__level8MapBounds = { xMin: -1, xMax: 49, zMin: -8, zMax: -2 };
      preloadBgMusic(8).then(() => {
        const startPosition = injectSceneContentLevel8(sceneEl) || sceneEl.dataset.playerStartPosition || null;
        const game = new Game(sceneEl, {
          levelCreator: createLevel8,
          totalCoins: TOTAL_COINS_LEVEL8,
          initialTime: 300,
          startPosition,
        });
        game.start();
      });
    } catch (err) {
      console.error('[Retro Level 8] Error:', err);
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
