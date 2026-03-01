/**
 * Estado global del juego: puntuación, tiempo, victoria/derrota.
 * Accesible por componentes (monedas, enemigos, UI).
 */

export const COIN_POINTS = 100;
export const STOMP_POINTS = 50;
export const TIME_INITIAL = 120; // segundos

export function createGameState(totalCoins) {
  const state = {
    score: 0,
    coinsCollected: 0,
    totalCoins: totalCoins || 9,
    timeLeft: TIME_INITIAL,
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
  g.coinsCollected += 1;
  g.score += COIN_POINTS;
  if (g.coinsCollected >= g.totalCoins) {
    g.won = true;
    g.gameOver = true;
    if (window.__onGameEnd) window.__onGameEnd('won');
  }
  if (window.__onScoreUpdate) window.__onScoreUpdate();
}

export function onPlayerKilled() {
  const g = getGameState();
  if (!g || g.gameOver || g.won) return;
  g.gameOver = true;
  if (window.__onGameEnd) window.__onGameEnd('killed');
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
