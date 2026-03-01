/**
 * UI overlay: score, time left, victory/game over message.
 */

import { getGameState } from './game-state.js';

let uiRoot = null;

function createUI() {
  const div = document.createElement('div');
  div.id = 'game-ui';
  div.innerHTML = `
    <div id="game-instructions" class="game-instructions">
      WASD move · Space jump · Collect all 10 coins (the last is at the castle) to win. Avoid enemies or stomp them!
    </div>
    <div class="game-hud">
      <span id="game-score">0</span> pts &nbsp;|&nbsp;
      <span id="game-coins">0</span>/<span id="game-total-coins">0</span> coins &nbsp;|&nbsp;
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
    const text = g.won ? 'You won! You reached the castle and got the princess\'s coin.' : (g.timeLeft <= 0 ? 'Time\'s up! Game Over.' : 'You got caught! Game Over.');
    const hint = ' (R, Enter or Space to restart)';
    const level = window.__currentLevel || 1;
    msgEl.innerHTML = '';
    const textEl = document.createElement('span');
    textEl.className = 'game-over-text';
    textEl.textContent = text + hint;
    msgEl.appendChild(textEl);
    const btnWrap = document.createElement('div');
    btnWrap.style.cssText = 'display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;';
    const btnStyle = 'font-size: 18px; padding: 12px 24px; cursor: pointer; color: #fff; border: none; border-radius: 8px; font-weight: bold;';
    const btnRestart = document.createElement('button');
    btnRestart.className = 'game-over-btn';
    btnRestart.textContent = g.won ? 'Restart level' : 'Try again';
    btnRestart.style.cssText = btnStyle + ' background: #4CAF50;';
    btnRestart.addEventListener('click', () => { if (window.__restartGame) window.__restartGame(); });
    if (g.won) {
      const nextHref = level === 1 ? 'nivel2.html' : level === 2 ? 'nivel3.html' : level === 3 ? 'nivel4.html' : null;
      const btnNext = document.createElement('button');
      btnNext.className = 'game-over-btn-next';
      btnNext.textContent = nextHref ? 'Next level' : 'Back to start';
      btnNext.style.cssText = btnStyle + ' background: #2196F3;';
      btnNext.addEventListener('click', () => {
        window.location.href = nextHref || 'index.html';
      });
      btnWrap.appendChild(btnNext);
    }
    btnWrap.appendChild(btnRestart);
    const btnMenu = document.createElement('button');
    btnMenu.className = 'game-over-btn-menu';
    btnMenu.textContent = 'Menu';
    btnMenu.style.cssText = btnStyle + ' background: #666;';
    btnMenu.addEventListener('click', () => { window.location.href = 'index.html'; });
    btnWrap.appendChild(btnMenu);
    msgEl.appendChild(btnWrap);
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
