/**
 * Componente: enemigo que se mueve en un eje (ida y vuelta).
 */

AFRAME.registerComponent('enemy-movement', {
  schema: {
    range: { type: 'number', default: 1.2 },
    axis: { type: 'string', default: 'x' },
    speed: { type: 'number', default: 0.4 },
  },
  init() {
    const p = this.el.getAttribute('position');
    this.startPos = { x: p.x, y: p.y, z: p.z };
    this.t = 0;
  },
  tick(time, delta) {
    const dt = delta / 1000;
    this.t += dt * this.data.speed;
    const phase = (this.t % 2) / 2;
    const offset = (phase <= 0.5 ? phase * 4 - 1 : 3 - phase * 4) * this.data.range;
    const pos = { x: this.startPos.x, y: this.startPos.y, z: this.startPos.z };
    if (this.data.axis === 'x') pos.x = this.startPos.x + offset;
    if (this.data.axis === 'z') pos.z = this.startPos.z + offset;
    this.el.setAttribute('position', pos);
  },
});
