/**
 * Clase principal: estado del juego, UI, temporizador, victoria/derrota, jugador.
 */

import { createPlayer } from './player.js';
import { createLevel } from './level.js';
import { registerPlayerController, registerPlayerControllerSimple } from './player-controller.js';
import { registerCollectables } from './collectables.js';
import { createGameState, getGameState, onCoinCollect, onPlayerKilled, onEnemyStomp, onExitReached, stopTimer, checkMapExplorationWin, TIME_INITIAL } from './game-state.js';
import { initUI, updateUI, hideMessage } from './ui.js';
import { playBgMusic, restartBgMusic, playJump, playGameOver } from './sounds.js';
import './enemy-movement.js';
import './hittable-block.js';
import { registerFbxModel } from './fbx-model.js';

registerFbxModel();

const TOTAL_COINS = 10;

function hasPhysics() {
  return typeof AFRAME !== 'undefined' && AFRAME.systems && AFRAME.systems.physics;
}

export class Game {
  constructor(sceneEl, options = {}) {
    this.sceneEl = sceneEl;
    this.player = null;
    this.options = options;
    this.totalCoins = options.totalCoins != null ? options.totalCoins : TOTAL_COINS;
    this.initialTime = options.initialTime != null ? options.initialTime : TIME_INITIAL;
    this.levelCreator = options.levelCreator || createLevel;
  }

  start() {
    const usePhysics = hasPhysics();
    createGameState(this.totalCoins, this.initialTime);
    const state = window.__gameState;

    window.__onCoinCollect = onCoinCollect;
    window.__onPlayerKilled = onPlayerKilled;
    window.__onEnemyStomp = onEnemyStomp;
    window.__onExitReached = onExitReached;
    window.__checkMapExplorationWin = checkMapExplorationWin;
    window.__onScoreUpdate = () => updateUI();
    window.__dismissVictoryAndContinue = () => {
      const g = getGameState();
      if (g && g.won) {
        g.won = false;
        g.gameOver = false;
        hideMessage();
        updateUI();
      }
    };
    window.__onGameEnd = () => {
      stopTimer();
      updateUI();
    };

    initUI(this.totalCoins);

    state.timerId = setInterval(() => {
      state.timeLeft -= 1;
      updateUI();
      if (state.timeLeft <= 0) {
        state.gameOver = true;
        stopTimer();
        playGameOver();
        window.__onGameEnd();
      }
    }, 1000);

    registerPlayerController();
    registerPlayerControllerSimple();
    registerCollectables();

    const useSimpleController = true;
    this.player = createPlayer(this.sceneEl, useSimpleController ? false : usePhysics);
    if (this.options.startPosition) {
      this.player.setAttribute('position', this.options.startPosition);
    }

    window.__restartGame = () => this.restart();
    window.__playJumpSound = playJump;

    playBgMusic(window.__currentLevel || 1);

    this._onKeyDownGameOver = (e) => {
      const g = getGameState();
      if (!g || !g.gameOver) return;
      const key = (e.code || e.key || '').replace('Key', '');
      if (key === 'R' || key === 'Space') {
        e.preventDefault();
        if (window.__restartGame) window.__restartGame();
        return;
      }
      if (key === 'Enter' && g.won) {
        e.preventDefault();
        const level = window.__currentLevel || 1;
        const nextHref = level === 1 ? 'nivel2.html' : level === 2 ? 'nivel3.html' : level === 3 ? 'nivel4.html' : level === 4 ? 'nivel5.html' : level === 5 ? 'nivel6.html' : level === 6 ? 'nivel7.html' : 'index.html';
        window.location.href = nextHref;
      }
    };
    document.addEventListener('keydown', this._onKeyDownGameOver);

    showClickToPlay(this.sceneEl);
  }

  restart() {
    const state = getGameState();
    if (state && state.timerId) clearInterval(state.timerId);

    createGameState(this.totalCoins, this.initialTime);
    const usePhysics = hasPhysics();

    const levelEl = this.sceneEl.querySelector('#level');
    const playerEl = this.sceneEl.querySelector('#player');
    if (levelEl) levelEl.remove();
    if (playerEl) playerEl.remove();

    const result = this.levelCreator(this.sceneEl, usePhysics);
    const levelContainer = result && result.container ? result.container : result;
    this.sceneEl.appendChild(levelContainer);

    this.player = createPlayer(this.sceneEl, false);
    if (result && result.startPosition) {
      this.player.setAttribute('position', result.startPosition);
    }

    const newState = getGameState();
    newState.timerId = setInterval(() => {
      newState.timeLeft -= 1;
      updateUI();
      if (newState.timeLeft <= 0) {
        newState.gameOver = true;
        stopTimer();
        playGameOver();
        window.__onGameEnd();
      }
    }, 1000);

    restartBgMusic();
    hideMessage();
    updateUI();
    showClickToPlay(this.sceneEl);
  }
}

function showClickToPlay(sceneEl) {
  const overlay = document.createElement('div');
  overlay.id = 'click-to-play';
  overlay.innerHTML = 'Click here to play · WASD move · Space jump';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);color:#fff;font-size:22px;font-family:sans-serif;text-align:center;cursor:pointer;pointer-events:auto;';
  overlay.addEventListener('click', () => {
    if (sceneEl.canvas) sceneEl.canvas.requestPointerLock();
    overlay.remove();
  });
  document.body.appendChild(overlay);
}
