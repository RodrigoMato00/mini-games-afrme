/**
 * Clase principal: estado del juego, UI, temporizador, victoria/derrota, jugador.
 */

import { createPlayer } from './player.js';
import { createLevel } from './level.js';
import { registerPlayerController, registerPlayerControllerSimple } from './player-controller.js';
import { registerCollectables } from './collectables.js';
import { createGameState, getGameState, onCoinCollect, onPlayerKilled, onEnemyStomp, stopTimer } from './game-state.js';
import { initUI, updateUI, hideMessage } from './ui.js';
import './enemy-movement.js';
import './hittable-block.js';
import { registerFbxModel } from './fbx-model.js';

registerFbxModel();

const TOTAL_COINS = 10;

function hasPhysics() {
  return typeof AFRAME !== 'undefined' && AFRAME.systems && AFRAME.systems.physics;
}

export class Game {
  constructor(sceneEl) {
    this.sceneEl = sceneEl;
    this.player = null;
  }

  start() {
    const usePhysics = hasPhysics();
    createGameState(TOTAL_COINS);
    const state = window.__gameState;

    window.__onCoinCollect = onCoinCollect;
    window.__onPlayerKilled = onPlayerKilled;
    window.__onEnemyStomp = onEnemyStomp;
    window.__onScoreUpdate = () => updateUI();
    window.__onGameEnd = () => {
      stopTimer();
      updateUI();
    };

    initUI(TOTAL_COINS);

    state.timerId = setInterval(() => {
      state.timeLeft -= 1;
      updateUI();
      if (state.timeLeft <= 0) {
        state.gameOver = true;
        stopTimer();
        window.__onGameEnd();
      }
    }, 1000);

    registerPlayerController();
    registerPlayerControllerSimple();
    registerCollectables();

    const useSimpleController = true;
    this.player = createPlayer(this.sceneEl, useSimpleController ? false : usePhysics);

    window.__restartGame = () => this.restart();

    showClickToPlay(this.sceneEl);
  }

  restart() {
    const state = getGameState();
    if (state && state.timerId) clearInterval(state.timerId);

    createGameState(TOTAL_COINS);
    const usePhysics = hasPhysics();

    const levelEl = this.sceneEl.querySelector('#level');
    const playerEl = this.sceneEl.querySelector('#player');
    if (levelEl) levelEl.remove();
    if (playerEl) playerEl.remove();

    const levelContainer = createLevel(this.sceneEl, usePhysics);
    this.sceneEl.appendChild(levelContainer);

    this.player = createPlayer(this.sceneEl, false);

    const newState = getGameState();
    newState.timerId = setInterval(() => {
      newState.timeLeft -= 1;
      updateUI();
      if (newState.timeLeft <= 0) {
        newState.gameOver = true;
        stopTimer();
        window.__onGameEnd();
      }
    }, 1000);

    hideMessage();
    updateUI();
    showClickToPlay(this.sceneEl);
  }
}

function showClickToPlay(sceneEl) {
  const overlay = document.createElement('div');
  overlay.id = 'click-to-play';
  overlay.innerHTML = 'Hacé click acá para jugar · WASD mover · Espacio saltar';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);color:#fff;font-size:22px;font-family:sans-serif;text-align:center;cursor:pointer;pointer-events:auto;';
  overlay.addEventListener('click', () => {
    if (sceneEl.canvas) sceneEl.canvas.requestPointerLock();
    overlay.remove();
  });
  document.body.appendChild(overlay);
}
