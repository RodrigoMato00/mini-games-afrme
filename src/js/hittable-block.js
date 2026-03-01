/**
 * Bloque golpeable tipo Mario: al golpear desde abajo, suelta una moneda.
 */

AFRAME.registerComponent('hittable-block', {
  schema: {
    spawned: { type: 'boolean', default: false },
  },
  init() {
    this.hit = false;
  },
  tick() {
    if (this.hit) return;
    const state = typeof window !== 'undefined' && window.__gameState;
    if (state && state.gameOver) return;
    const player = document.getElementById('player');
    if (!player || !player.object3D) return;
    const pos = this.el.getAttribute('position');
    const playerPos = player.object3D.position;
    const half = 0.6;
    const dx = Math.abs(playerPos.x - pos.x);
    const dz = Math.abs(playerPos.z - pos.z);
    if (dx < half && dz < half && playerPos.y >= pos.y - 0.2 && playerPos.y <= pos.y + 0.5) {
      let movingUp = false;
      const simple = player.components['player-controller-simple'];
      if (simple && simple.vy > 0) movingUp = true;
      if (player.body && player.body.velocity && player.body.velocity.y > 0.5) movingUp = true;
      if (movingUp) {
        this.hit = true;
        this.spawnCoin();
        this.el.setAttribute('color', '#8B7355');
      }
    }
  },
  spawnCoin() {
    const pos = this.el.getAttribute('position');
    const container = this.el.parentEl;
    const coin = document.createElement('a-cylinder');
    coin.setAttribute('position', `${pos.x} ${pos.y + 1.2} ${pos.z}`);
    coin.setAttribute('radius', '0.35');
    coin.setAttribute('height', '0.15');
    coin.setAttribute('color', '#FFD700');
    coin.setAttribute('rotation', '90 0 0');
    coin.setAttribute('class', 'collectable collectable-spawned');
    container.appendChild(coin);
  },
});
