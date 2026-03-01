/**
 * UI overlay: puntuación, tiempo restante, mensaje de victoria/derrota.
 */

import { getGameState } from './game-state.js';

let uiRoot = null;

function createUI() {
  const div = document.createElement('div');
  div.id = 'game-ui';
  div.innerHTML = `
    <div id="game-instructions" class="game-instructions">
      WASD mover · Espacio saltar · Recogé las 10 monedas (la última está en la puerta del castillo) para ganar. ¡Evitá a los enemigos o saltales encima!
    </div>
    <div class="game-hud">
      <span id="game-score">0</span> pts &nbsp;|&nbsp;
      <span id="game-coins">0</span>/<span id="game-total-coins">0</span> monedas &nbsp;|&nbsp;
      <span id="game-time">120</span> s
    </div>
    <div id="game-message" class="game-message hidden"></div>
  `;
  div.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    pointer-events: none; font-family: monospace; font-size: 18px;
    color: #fff; text-shadow: 1px 1px 2px #000;
    padding: 12px 20px; box-sizing: border-box;
  `;
  const inst = div.querySelector('#game-instructions');
  if (inst) {
    inst.style.cssText = 'background: rgba(0,0,0,0.7); padding: 10px 16px; border-radius: 8px; margin-bottom: 8px; display: inline-block; font-size: 14px; max-width: 420px;';
    setTimeout(() => { inst.style.transition = 'opacity 0.5s'; inst.style.opacity = '0.3'; }, 4000);
    setTimeout(() => { inst.style.display = 'none'; }, 8000);
  }
  const hud = div.querySelector('.game-hud');
  hud.style.cssText = 'background: rgba(0,0,0,0.5); padding: 8px 12px; border-radius: 6px; display: inline-block;';
  const msg = div.querySelector('.game-message');
  msg.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    font-size: 32px; font-weight: bold; background: rgba(0,0,0,0.85);
    padding: 24px 48px; border-radius: 12px; border: 3px solid #ffd700;
    pointer-events: auto; display: flex; flex-direction: column; align-items: center; gap: 20px;
  `;
  div.querySelector('.hidden').style.display = 'none';
  document.body.appendChild(div);
  uiRoot = div;
  return div;
}

export function updateUI() {
  const g = getGameState();
  if (!g || !uiRoot) return;
  const scoreEl = uiRoot.querySelector('#game-score');
  const coinsEl = uiRoot.querySelector('#game-coins');
  const totalEl = uiRoot.querySelector('#game-total-coins');
  const timeEl = uiRoot.querySelector('#game-time');
  const msgEl = uiRoot.querySelector('#game-message');
  if (scoreEl) scoreEl.textContent = g.score;
  if (coinsEl) coinsEl.textContent = g.coinsCollected;
  if (totalEl) totalEl.textContent = g.totalCoins;
  if (timeEl) timeEl.textContent = Math.max(0, Math.ceil(g.timeLeft));
  if (msgEl && g.gameOver) {
    msgEl.classList.remove('hidden');
    msgEl.style.display = 'flex';
    const text = g.won ? '¡Ganaste! Llegaste al castillo y recogiste la moneda de la princesa.' : (g.timeLeft <= 0 ? '¡Tiempo! Game Over.' : '¡Te atraparon! Game Over.');
    let textEl = msgEl.querySelector('.game-over-text');
    if (!msgEl.querySelector('.game-over-btn')) {
      textEl = document.createElement('span');
      textEl.className = 'game-over-text';
      const btn = document.createElement('button');
      btn.className = 'game-over-btn';
      btn.textContent = 'Volver a empezar';
      btn.style.cssText = 'font-size: 20px; padding: 12px 24px; cursor: pointer; background: #4CAF50; color: #fff; border: none; border-radius: 8px; font-weight: bold;';
      btn.addEventListener('click', () => {
        if (window.__restartGame) window.__restartGame();
      });
      msgEl.innerHTML = '';
      msgEl.appendChild(textEl);
      msgEl.appendChild(btn);
    }
    if (textEl) textEl.textContent = text;
  }
}

export function showMessage(text) {
  if (!uiRoot) return;
  const msgEl = uiRoot.querySelector('#game-message');
  if (msgEl) {
    msgEl.textContent = text;
    msgEl.classList.remove('hidden');
    msgEl.style.display = 'block';
  }
}

export function hideMessage() {
  if (!uiRoot) return;
  const msgEl = uiRoot.querySelector('#game-message');
  if (msgEl) {
    msgEl.classList.add('hidden');
    msgEl.style.display = 'none';
  }
}

export function initUI(totalCoins) {
  createUI();
  const totalEl = uiRoot.querySelector('#game-total-coins');
  if (totalEl) totalEl.textContent = totalCoins;
  updateUI();
}
