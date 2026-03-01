/**
 * Estado global del juego: puntuación, tiempo, victoria/derrota.
 * Accesible por componentes (monedas, enemigos, UI).
 */

import { playCoin, playGameOver, playWin } from './sounds.js';

export const COIN_POINTS = 100;
export const COIN_BONUS_ALL = 500; // bonus al recoger todas las monedas (niveles con salida)
export const STOMP_POINTS = 50;
export const TIME_INITIAL = 120; // segundos (nivel 1)

export function createGameState(totalCoins, initialTime) {
  const state = {
    score: 0,
    coinsCollected: 0,
    totalCoins: totalCoins || 9,
    timeLeft: initialTime != null ? initialTime : TIME_INITIAL,
    gameOver: false,
    won: false,
    timerId: null,
  };
  if (typeof window !== 'undefined') window.__gameState = state;
  return state;
}

export function getGameState() {
  return (typeof window !== 'undefined' && window.__gameState) || null;
}

export function onCoinCollect() {
  const g = getGameState();
  if (!g || g.gameOver || g.won) return;
  playCoin();
  g.coinsCollected += 1;
  g.score += COIN_POINTS;
  const hasExit = typeof window !== 'undefined' && typeof window.__levelExitZone === 'function';
  if (hasExit) {
    if (g.coinsCollected === g.totalCoins) g.score += COIN_BONUS_ALL;
  } else if (g.coinsCollected >= g.totalCoins) {
    g.won = true;
    g.gameOver = true;
    playWin();
    if (window.__onGameEnd) window.__onGameEnd('won');
  }
  if (window.__onScoreUpdate) window.__onScoreUpdate();
}

export function onPlayerKilled() {
  const g = getGameState();
  if (!g || g.gameOver || g.won) return;
  g.gameOver = true;
  playGameOver();
  if (window.__onGameEnd) window.__onGameEnd('killed');
}

export function onExitReached() {
  const g = getGameState();
  if (!g || g.gameOver || g.won) return;
  g.won = true;
  g.gameOver = true;
  playWin();
  if (window.__onGameEnd) window.__onGameEnd('won');
}

export function onEnemyStomp() {
  const g = getGameState();
  if (!g || g.gameOver || g.won) return;
  g.score += STOMP_POINTS;
  if (window.__onScoreUpdate) window.__onScoreUpdate();
}

export function stopTimer() {
  const g = getGameState();
  if (g && g.timerId) {
    clearInterval(g.timerId);
    g.timerId = null;
  }
}

/** Win by exploring 95% of passable map cells (for maze levels with __levelMapData). */
export function checkMapExplorationWin() {
  const g = getGameState();
  if (!g || g.gameOver || g.won) return;
  const mapData = typeof window !== 'undefined' && window.__levelMapData;
  const visited = typeof window !== 'undefined' && window.__levelMapVisited;
  if (!mapData || !visited) return;
  const { grid, rows, cols } = mapData;
  let passable = 0;
  let visitedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        passable++;
        if (visited[r][c] === 1) visitedCount++;
      }
    }
  }
  if (passable === 0) return;
  if (visitedCount >= Math.ceil(passable * 0.95)) {
    g.won = true;
    g.gameOver = true;
    playWin();
    if (window.__onGameEnd) window.__onGameEnd('won');
  }
}
