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
    <div id="game-ground-countdown" class="game-ground-countdown" style="display: none;">Get to platform: <span id="game-ground-countdown-value">5</span> s</div>
    <div id="game-map-backdrop" class="game-map-backdrop hidden"></div>
    <div id="game-minimap-wrap" class="game-minimap-wrap hidden"></div>
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
  const groundCountdownEl = div.querySelector('#game-ground-countdown');
  if (groundCountdownEl) groundCountdownEl.style.cssText = 'margin-top: 8px; padding: 10px 16px; background: rgba(180,0,0,0.85); border-radius: 8px; display: none; font-weight: bold; font-size: 20px;';
  const msg = div.querySelector('.game-message');
  msg.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    font-size: 32px; font-weight: bold; background: rgba(0,0,0,0.85);
    padding: 24px 48px; border-radius: 12px; border: 3px solid #ffd700;
    pointer-events: auto; flex-direction: column; align-items: center; gap: 20px;
  `;
  msg.style.display = 'none';
  const minimapWrap = div.querySelector('#game-minimap-wrap');
  if (minimapWrap) {
    minimapWrap.style.cssText = 'position: fixed; bottom: 16px; right: 16px; z-index: 50; padding: 6px; background: rgba(0,0,0,0.6); border-radius: 8px; border: 2px solid rgba(255,255,255,0.3);';
  }
  const backdrop = div.querySelector('#game-map-backdrop');
  if (backdrop) {
    backdrop.style.cssText = 'position: fixed; inset: 0; z-index: 95; background: rgba(0,0,0,0.8); display: none; pointer-events: auto; cursor: pointer;';
    backdrop.title = 'Press M or click to close';
    backdrop.addEventListener('click', () => { if (bigMapVisible) toggleBigMap(); });
  }
  document.addEventListener('keydown', onMapKey);
  div.querySelectorAll('.hidden').forEach((el) => { if (el.id !== 'game-map-backdrop') el.style.display = 'none'; });
  document.body.appendChild(div);
  uiRoot = div;
  return div;
}

let bigMapVisible = false;
function toggleBigMap() {
  if (!uiRoot || !window.__levelMapData) return;
  const wrap = uiRoot.querySelector('#game-minimap-wrap');
  const backdrop = uiRoot.querySelector('#game-map-backdrop');
  if (!wrap || !backdrop) return;
  bigMapVisible = !bigMapVisible;
  if (bigMapVisible) {
    backdrop.style.display = 'block';
    wrap.style.position = 'fixed';
    wrap.style.left = '50%';
    wrap.style.top = '50%';
    wrap.style.bottom = 'auto';
    wrap.style.right = 'auto';
    const mapData = window.__levelMapData;
    const w = wrap.offsetWidth || (mapData ? mapData.cols * MINIMAP_CELL_PX : 95);
    const h = wrap.offsetHeight || (mapData ? mapData.rows * MINIMAP_CELL_PX : 125);
    const scale = Math.min((window.innerWidth * 0.9) / w, (window.innerHeight * 0.9) / h, 8);
    wrap.style.transform = `translate(-50%, -50%) scale(${scale})`;
    wrap.style.zIndex = '96';
  } else {
    backdrop.style.display = 'none';
    wrap.style.left = 'auto';
    wrap.style.top = 'auto';
    wrap.style.bottom = '16px';
    wrap.style.right = '16px';
    wrap.style.transform = 'none';
    wrap.style.zIndex = '50';
  }
}

function onMapKey(e) {
  if (e.code === 'KeyM' && window.__levelMapData) {
    e.preventDefault();
    toggleBigMap();
  }
  if (e.code === 'Escape' && bigMapVisible) {
    e.preventDefault();
    toggleBigMap();
  }
}

const MINIMAP_CELL_PX = 5;

function updateMinimap() {
  const wrap = uiRoot && uiRoot.querySelector('#game-minimap-wrap');
  const mapData = typeof window !== 'undefined' && window.__levelMapData;
  const visited = typeof window !== 'undefined' && window.__levelMapVisited;
  if (!wrap || !mapData || !visited) {
    if (wrap) {
      wrap.classList.add('hidden');
      wrap.style.display = 'none';
    }
    return;
  }
  wrap.classList.remove('hidden');
  wrap.style.display = 'grid';
  const { grid, rows, cols, cell: cellSize, offsetX, offsetZ } = mapData;
  const playerCell = window.__playerMapCell || null;

  const coinCells = new Set();
  const scene = document.querySelector('a-scene');
  const level = scene && scene.querySelector('#level');
  const THREE = window.THREE || (window.AFRAME && window.AFRAME.THREE);
  if (level && THREE) {
    const v = new THREE.Vector3();
    level.querySelectorAll('.collectable').forEach((coin) => {
      coin.object3D.getWorldPosition(v);
      const col = Math.round((v.x - offsetX) / cellSize);
      const row = Math.round((v.z - offsetZ) / cellSize);
      if (row >= 0 && row < rows && col >= 0 && col < cols) coinCells.add(`${row},${col}`);
    });
  }

  wrap.style.width = cols * MINIMAP_CELL_PX + 'px';
  wrap.style.height = rows * MINIMAP_CELL_PX + 'px';
  wrap.style.gridTemplateColumns = `repeat(${cols}, ${MINIMAP_CELL_PX}px)`;
  wrap.style.gridTemplateRows = `repeat(${rows}, ${MINIMAP_CELL_PX}px)`;
  wrap.style.gap = '0';
  wrap.innerHTML = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.setAttribute('data-row', r);
      cell.setAttribute('data-col', c);
      const isWall = grid[r][c] === 0;
      const isVisited = visited[r][c] === 1;
      const isPlayer = playerCell && playerCell.row === r && playerCell.col === c;
      const isCoin = coinCells.has(`${r},${c}`);
      if (isPlayer) {
        cell.style.background = '#FFD700';
        cell.style.borderRadius = '50%';
      } else if (isCoin) {
        cell.style.background = '#F1C40F';
        cell.style.borderRadius = '50%';
      } else if (isWall) {
        cell.style.background = '#1a1a1a';
      } else if (isVisited) {
        cell.style.background = '#5a9fd4';
      } else {
        cell.style.background = '#2a2a3a';
      }
      cell.style.width = MINIMAP_CELL_PX + 'px';
      cell.style.height = MINIMAP_CELL_PX + 'px';
      cell.style.boxSizing = 'border-box';
      wrap.appendChild(cell);
    }
  }
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
  const groundCountdownEl = uiRoot.querySelector('#game-ground-countdown');
  const groundCountdownVal = uiRoot.querySelector('#game-ground-countdown-value');
  if (groundCountdownEl && groundCountdownVal) {
    const t = window.__level5GroundCountdown;
    if (window.__currentLevel === 5 && t != null && !g.gameOver) {
      groundCountdownVal.textContent = Math.max(0, Math.ceil(t));
      groundCountdownEl.style.display = 'block';
    } else {
      groundCountdownEl.style.display = 'none';
    }
  }
  updateMinimap();
  if (msgEl && g.gameOver) {
    msgEl.classList.remove('hidden');
    msgEl.style.display = 'flex';
    const levelNum = window.__currentLevel || 1;
    const wonText = levelNum === 2
      ? 'You won! You collected all 10 coins.'
      : levelNum === 6
        ? 'You won! You reached the exit.'
        : 'You won! You reached the castle and got the princess\'s coin.';
    const text = g.won ? wonText : (g.timeLeft <= 0 ? 'Time\'s up! Game Over.' : 'You got caught! Game Over.');
    const hint = g.won
      ? ' (R or Space = restart level, Enter = next level)'
      : ' (R or Space to try again)';
    const level = window.__currentLevel || 1;
    const nextHrefByLevel = level === 1 ? 'nivel2.html' : level === 2 ? 'nivel3.html' : level === 3 ? 'nivel4.html' : level === 4 ? 'nivel5.html' : level === 5 ? 'nivel6.html' : null;
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
      if (level === 6) {
        const btnContinue = document.createElement('button');
        btnContinue.className = 'game-over-btn-continue';
        btnContinue.textContent = 'Continue exploring';
        btnContinue.style.cssText = btnStyle + ' background: #FF9800;';
        btnContinue.addEventListener('click', () => {
          if (typeof window.__dismissVictoryAndContinue === 'function') window.__dismissVictoryAndContinue();
        });
        btnWrap.appendChild(btnContinue);
      }
      const btnNext = document.createElement('button');
      btnNext.className = 'game-over-btn-next';
      btnNext.textContent = nextHrefByLevel ? 'Next level' : 'Back to start';
      btnNext.style.cssText = btnStyle + ' background: #2196F3;';
      btnNext.addEventListener('click', () => {
        window.location.href = nextHrefByLevel || 'index.html';
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
  const inst = uiRoot.querySelector('#game-instructions');
  if (inst && window.__currentLevel === 2) {
    inst.textContent = 'WASD move · Space jump · M = big map · Collect all 10 coins to win. Avoid enemies!';
  }
  if (inst && window.__currentLevel === 5) {
    inst.textContent = 'WASD move · Space jump · Pipe Land! Collect all 10 coins. Avoid goombas or stomp them!';
  }
  if (inst && window.__currentLevel === 6) {
    inst.textContent = 'WASD move · Space jump · M = big map · Reach the exit to win. Collect all coins for bonus points. Avoid enemies!';
  }
  window.__updateMinimap = updateMinimap;
  updateUI();
}
