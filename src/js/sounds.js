/**
 * Sonidos del juego: música de fondo por nivel y efectos (moneda, salto, game over, victoria).
 * Nivel 1, 3, 4: tema Mario Bros. Nivel 2: castillo.
 * Al reiniciar (game over) la música vuelve a comenzar.
 */

const SOUNDS = {
  bgTheme: 'sounds/super-mario-bros-musica.mp3',
  bgCastle: 'sounds/mario-castle-bros.mp3',
  coin: 'sounds/mario-coin.mp3',
  jump: 'sounds/mario-bros-jump.mp3',
  gameOver: 'sounds/mario-bros game over.mp3',
  win: 'sounds/super-mario-winer.mp3',
};

let bgAudio = null;
let currentBgLevel = null;

function getBgSrc(level) {
  if (level === 2) return SOUNDS.bgCastle;
  return SOUNDS.bgTheme;
}

/** Precarga la música de fondo del nivel; resuelve cuando está lista para reproducir (o en error para no bloquear). */
export function preloadBgMusic(level) {
  return new Promise((resolve) => {
    const src = getBgSrc(level || 1);
    const a = new Audio();
    const onReady = () => resolve();
    a.addEventListener('canplaythrough', onReady, { once: true });
    a.addEventListener('error', onReady, { once: true });
    a.src = src;
    a.load();
  });
}

export function playBgMusic(level) {
  const src = getBgSrc(level || 1);
  if (bgAudio) {
    bgAudio.pause();
    bgAudio = null;
  }
  bgAudio = new Audio(src);
  bgAudio.loop = true;
  bgAudio.volume = 0.5;
  bgAudio.play().catch(() => {});
  currentBgLevel = level;
}

export function stopBgMusic() {
  if (bgAudio) {
    bgAudio.pause();
    bgAudio.currentTime = 0;
  }
}

export function restartBgMusic() {
  if (bgAudio && currentBgLevel != null) {
    bgAudio.currentTime = 0;
    bgAudio.play().catch(() => {});
  }
}

export function playCoin() {
  const a = new Audio(SOUNDS.coin);
  a.volume = 0.6;
  a.play().catch(() => {});
}

export function playJump() {
  const a = new Audio(SOUNDS.jump);
  a.volume = 0.4;
  a.play().catch(() => {});
}

export function playGameOver() {
  if (bgAudio) bgAudio.pause();
  const a = new Audio(SOUNDS.gameOver);
  a.volume = 0.7;
  a.play().catch(() => {});
}

export function playWin() {
  if (bgAudio) bgAudio.pause();
  const a = new Audio(SOUNDS.win);
  a.volume = 0.6;
  a.play().catch(() => {});
}
