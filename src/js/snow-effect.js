/**
 * Efecto de nevada en A-Frame sin objetos externos: copos como esferas que caen y se resetean.
 */
const FLAKE_COUNT = 80;
const FALL_SPEED = 2.5;
const RESET_Y = -2;
const SPAWN_Y = 25;
const SPREAD_X = 28;
const SPREAD_Z = 18;
const CENTER_X = 18;
const CENTER_Z = -6;

export function registerSnowfallComponent() {
  AFRAME.registerComponent('snowfall', {
    schema: {
      flakeCount: { type: 'int', default: FLAKE_COUNT },
      fallSpeed: { type: 'number', default: FALL_SPEED },
      spreadX: { type: 'number', default: SPREAD_X },
      spreadZ: { type: 'number', default: SPREAD_Z },
      centerX: { type: 'number', default: CENTER_X },
      centerZ: { type: 'number', default: CENTER_Z },
    },
    init() {
      this.flakes = [];
      const count = this.data.flakeCount;
      const spreadX = this.data.spreadX;
      const spreadZ = this.data.spreadZ;
      const cx = this.data.centerX;
      const cz = this.data.centerZ;
      for (let i = 0; i < count; i++) {
        const flake = document.createElement('a-entity');
        const x = cx + (Math.random() - 0.5) * spreadX;
        const z = cz + (Math.random() - 0.5) * spreadZ;
        const y = Math.random() * SPAWN_Y + 5;
        flake.setAttribute('position', `${x} ${y} ${z}`);
        flake.setAttribute('geometry', 'primitive: sphere; radius: 0.04');
        flake.setAttribute('material', 'color: #fff; metalness: 0; roughness: 1');
        flake.setAttribute('visible', true);
        this.el.appendChild(flake);
        this.flakes.push({
          el: flake,
          y,
          speed: 0.8 + Math.random() * 1.4,
          driftX: (Math.random() - 0.5) * 0.3,
          driftZ: (Math.random() - 0.5) * 0.3,
        });
      }
    },
    tick(time, delta) {
      const dt = delta / 1000;
      const spreadX = this.data.spreadX;
      const spreadZ = this.data.spreadZ;
      const cx = this.data.centerX;
      const cz = this.data.centerZ;
      for (let i = 0; i < this.flakes.length; i++) {
        const f = this.flakes[i];
        const pos = f.el.getAttribute('position');
        let { x, y, z } = pos;
        y -= f.speed * dt;
        x += f.driftX * dt;
        z += f.driftZ * dt;
        if (y < RESET_Y) {
          y = SPAWN_Y + Math.random() * 8;
          x = cx + (Math.random() - 0.5) * spreadX;
          z = cz + (Math.random() - 0.5) * spreadZ;
        }
        f.el.setAttribute('position', { x, y, z });
      }
    },
  });
}
