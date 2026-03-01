/**
 * Componente A-Frame: control del jugador (WASD + salto) y sincronización con física.
 */

const MOVE_SPEED = 8;
const JUMP_IMPULSE = 9;
const GROUND_RAY_LENGTH = 1.2;

export function registerPlayerController() {
  AFRAME.registerComponent('player-controller', {
    schema: {
      moveSpeed: { type: 'number', default: MOVE_SPEED },
      jumpImpulse: { type: 'number', default: JUMP_IMPULSE },
    },

    init() {
      this.keys = { w: false, a: false, s: false, d: false, space: false };
      this.grounded = false;
      this.body = null;

      this.onKeyDown = (e) => {
        const k = e.code.toLowerCase();
        if (k === 'keyw') this.keys.w = true;
        if (k === 'keya') this.keys.a = true;
        if (k === 'keys') this.keys.s = true;
        if (k === 'keyd') this.keys.d = true;
        if (k === 'space') {
          e.preventDefault();
          this.keys.space = true;
        }
      };
      this.onKeyUp = (e) => {
        const k = e.code.toLowerCase();
        if (k === 'keyw') this.keys.w = false;
        if (k === 'keya') this.keys.a = false;
        if (k === 'keys') this.keys.s = false;
        if (k === 'keyd') this.keys.d = false;
        if (k === 'space') this.keys.space = false;
      };

      document.addEventListener('keydown', this.onKeyDown);
      document.addEventListener('keyup', this.onKeyUp);

      this.el.addEventListener('body-loaded', () => {
        this.body = this.el.body;
        if (this.body) {
          this.body.fixedRotation = true;
          this.body.updateMassProperties();
        }
      });

      this.el.addEventListener('collide', (e) => {
        const norm = e.detail.contact?.ni;
        if (norm && norm.y > 0.5) this.grounded = true;
      });
    },

    tick(time, delta) {
      if (!this.body) return;
      const dt = delta / 1000;

      if (this.body.velocity.y <= 0.1 && this.body.velocity.y >= -0.1) this.grounded = true;
      if (this.body.velocity.y < -0.5 || this.body.position.y > 2) this.grounded = false;

      const speed = this.data.moveSpeed;
      const v = this.body.velocity;
      const THREE = window.THREE || (window.AFRAME && window.AFRAME.THREE);
      if (!THREE) return;
      const cameraEl = this.el.querySelector('[camera]');
      const obj3d = cameraEl ? cameraEl.object3D : this.el.object3D;
      const quat = obj3d.getWorldQuaternion(new THREE.Quaternion());
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quat);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(quat);
      forward.y = 0;
      right.y = 0;
      forward.normalize();
      right.normalize();

      if (this.keys.w) {
        v.x += forward.x * speed * dt * 60;
        v.z += forward.z * speed * dt * 60;
      }
      if (this.keys.s) {
        v.x -= forward.x * speed * dt * 60;
        v.z -= forward.z * speed * dt * 60;
      }
      if (this.keys.a) {
        v.x -= right.x * speed * dt * 60;
        v.z -= right.z * speed * dt * 60;
      }
      if (this.keys.d) {
        v.x += right.x * speed * dt * 60;
        v.z += right.z * speed * dt * 60;
      }

      // Freno suave en XZ
      v.x *= 0.92;
      v.z *= 0.92;

      if (this.keys.space && this.grounded) {
        v.y = this.data.jumpImpulse;
        this.grounded = false;
      }

      this.body.velocity.set(v.x, v.y, v.z);
    },

    remove() {
      document.removeEventListener('keydown', this.onKeyDown);
      document.removeEventListener('keyup', this.onKeyUp);
    },
  });
}

/** Control sin física: movimiento suave, colisión con plataformas, recoger monedas, morir con enemigos. */
export function registerPlayerControllerSimple() {
  const MOVE_SPEED = 3.2;        // unidades por segundo (usa delta)
  const JUMP_VY = 0.28;
  const GRAVITY = -0.018;
  const GROUND_Y = 0;
  const PLAYER_HALF = { x: 0.4, y: 0.8, z: 0.4 };
  const COIN_COLLECT_DIST = 1.2;
  const ENEMY_HIT_MARGIN = 0.65;
  const ENEMY_TOP_OFFSET = 0.4;
  const STOMP_BOUNCE = 0.22;
  const MAP_BOUNDS = { xMin: -5, xMax: 35, zMin: -12, zMax: 2 };
  const PLATFORM_MARGIN = 0.55;
  const LANDING_FOOT_MIN = 0.5;
  const LANDING_FOOT_MAX = 0.15;
  const STANDING_TOLERANCE = 0.25;

  const THREE = window.THREE || (window.AFRAME && window.AFRAME.THREE);

  function getWorldPosition(el) {
    if (!THREE) return el.getAttribute('position');
    const v = new THREE.Vector3();
    el.object3D.getWorldPosition(v);
    return { x: v.x, y: v.y, z: v.z };
  }

  function getObstacleBoxFromEl(el) {
    if (!THREE) return null;
    const w = parseFloat(el.getAttribute('data-width')) || parseFloat(el.getAttribute('width'));
    const h = parseFloat(el.getAttribute('data-height')) || parseFloat(el.getAttribute('height'));
    const d = parseFloat(el.getAttribute('data-depth')) || parseFloat(el.getAttribute('depth'));
    if (w > 0 && h > 0 && d > 0) {
      const p = getWorldPosition(el);
      const hw = w / 2, hh = h / 2, hd = d / 2;
      return {
        x: p.x, y: p.y, z: p.z,
        w, h, d,
        xMin: p.x - hw, xMax: p.x + hw,
        yMin: p.y - hh, yMax: p.y + hh,
        zMin: p.z - hd, zMax: p.z + hd,
      };
    }
    el.object3D.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(el.object3D);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    return {
      x: center.x, y: center.y, z: center.z,
      w: size.x, h: size.y, d: size.z,
      xMin: box.min.x, xMax: box.max.x,
      yMin: box.min.y, yMax: box.max.y,
      zMin: box.min.z, zMax: box.max.z,
    };
  }

  function playerHitsObstacle(px, py, pz, obstacles) {
    const pad = 0.02;
    const pxMin = px - PLAYER_HALF.x - pad;
    const pxMax = px + PLAYER_HALF.x + pad;
    const pyMin = py - PLAYER_HALF.y - pad;
    const pyMax = py + PLAYER_HALF.y + pad;
    const pzMin = pz - PLAYER_HALF.z - pad;
    const pzMax = pz + PLAYER_HALF.z + pad;
    const playerBottom = py - PLAYER_HALF.y;

    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      const oxMin = o.xMin != null ? o.xMin : (o.x - o.w / 2);
      const oxMax = o.xMax != null ? o.xMax : (o.x + o.w / 2);
      const oyMin = o.yMin != null ? o.yMin : (o.y - o.h / 2);
      const oyMax = o.yMax != null ? o.yMax : (o.y + o.h / 2);
      const ozMin = o.zMin != null ? o.zMin : (o.z - o.d / 2);
      const ozMax = o.zMax != null ? o.zMax : (o.z + o.d / 2);
      const overlapX = pxMin < oxMax && pxMax > oxMin;
      const overlapZ = pzMin < ozMax && pzMax > ozMin;
      const overlapY = pyMin < oyMax && pyMax > oyMin;
      if (!overlapX || !overlapZ || !overlapY) continue;
      const platformTop = oyMax;
      const standingOnTop = playerBottom >= platformTop - 0.2;
      if (standingOnTop) continue;
      return true;
    }
    return false;
  }

  function pushPlayerOutOfObstacles(pos, obstacles) {
    const pad = 0.02;
    const pxMin = pos.x - PLAYER_HALF.x - pad;
    const pxMax = pos.x + PLAYER_HALF.x + pad;
    const pyMin = pos.y - PLAYER_HALF.y - pad;
    const pyMax = pos.y + PLAYER_HALF.y + pad;
    const pzMin = pos.z - PLAYER_HALF.z - pad;
    const pzMax = pos.z + PLAYER_HALF.z + pad;
    const playerBottom = pos.y - PLAYER_HALF.y;
    let pushed = false;
    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      const oxMin = o.xMin != null ? o.xMin : (o.x - o.w / 2);
      const oxMax = o.xMax != null ? o.xMax : (o.x + o.w / 2);
      const oyMin = o.yMin != null ? o.yMin : (o.y - o.h / 2);
      const oyMax = o.yMax != null ? o.yMax : (o.y + o.h / 2);
      const ozMin = o.zMin != null ? o.zMin : (o.z - o.d / 2);
      const ozMax = o.zMax != null ? o.zMax : (o.z + o.d / 2);
      const overlapX = pxMin < oxMax && pxMax > oxMin;
      const overlapZ = pzMin < ozMax && pzMax > ozMin;
      const overlapY = pyMin < oyMax && pyMax > oyMin;
      if (!overlapX || !overlapZ || !overlapY) continue;
      const platformTop = oyMax;
      if (playerBottom >= platformTop - 0.2) continue;
      const overlapDepthX = Math.min(pxMax - oxMin, oxMax - pxMin);
      const overlapDepthZ = Math.min(pzMax - ozMin, ozMax - pzMin);
      if (overlapDepthX <= overlapDepthZ) {
        if (pos.x > o.x) pos.x = oxMax + PLAYER_HALF.x + pad;
        else pos.x = oxMin - PLAYER_HALF.x - pad;
      } else {
        if (pos.z > o.z) pos.z = ozMax + PLAYER_HALF.z + pad;
        else pos.z = ozMin - PLAYER_HALF.z - pad;
      }
      pushed = true;
      break;
    }
    return pushed;
  }

  AFRAME.registerComponent('player-controller-simple', {
    init() {
      this.keys = { w: false, a: false, s: false, d: false, space: false };
      this.vy = 0;
      this.vx = 0;
      this.vz = 0;
      this.grounded = true;
      this.sceneEl = this.el.sceneEl;

      this.onKeyDown = (e) => {
        const k = e.code?.toLowerCase();
        if (k === 'keyw') this.keys.w = true;
        if (k === 'keya') this.keys.a = true;
        if (k === 'keys') this.keys.s = true;
        if (k === 'keyd') this.keys.d = true;
        if (k === 'space') { e.preventDefault(); this.keys.space = true; }
      };
      this.onKeyUp = (e) => {
        const k = e.code?.toLowerCase();
        if (k === 'keyw') this.keys.w = false;
        if (k === 'keya') this.keys.a = false;
        if (k === 'keys') this.keys.s = false;
        if (k === 'keyd') this.keys.d = false;
        if (k === 'space') this.keys.space = false;
      };
      document.addEventListener('keydown', this.onKeyDown);
      document.addEventListener('keyup', this.onKeyUp);
    },

    tick(time, delta) {
      const g = window.__gameState;
      if (g && (g.gameOver || g.won)) return;

      const THREE = window.THREE || (window.AFRAME && window.AFRAME.THREE);
      if (!THREE) return;
      const dt = Math.min(delta / 1000, 0.05);
      const pos = this.el.object3D.position;
      const cameraEl = this.el.querySelector('[camera]');
      const obj3d = cameraEl ? cameraEl.object3D : this.el.object3D;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(obj3d.getWorldQuaternion(new THREE.Quaternion()));
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(obj3d.getWorldQuaternion(new THREE.Quaternion()));
      forward.y = 0;
      right.y = 0;
      forward.normalize();
      right.normalize();

      if (!g || !g.gameOver) {
        const speed = MOVE_SPEED * dt;
        if (this.keys.w) { this.vx += forward.x * speed; this.vz += forward.z * speed; }
        if (this.keys.s) { this.vx -= forward.x * speed; this.vz -= forward.z * speed; }
        if (this.keys.a) { this.vx -= right.x * speed; this.vz -= right.z * speed; }
        if (this.keys.d) { this.vx += right.x * speed; this.vz += right.z * speed; }
      }
      this.vx *= 0.82;
      this.vz *= 0.82;
      if (this.grounded) {
        this.vx *= 0.9;
        this.vz *= 0.9;
      }

      const level = this.sceneEl.querySelector('#level');
      const obstacles = [];
      if (level && THREE) {
        level.querySelectorAll('.platform').forEach((el) => {
          const box = getObstacleBoxFromEl(el);
          if (box) obstacles.push(box);
        });
        const castle = level.querySelector('#castle');
        if (castle) {
          const box = getObstacleBoxFromEl(castle);
          if (box) obstacles.push(box);
        }
      }

      const prevX = pos.x;
      const prevZ = pos.z;
      pos.x += this.vx;
      if (playerHitsObstacle(pos.x, pos.y, pos.z, obstacles)) {
        pos.x = prevX;
        this.vx = 0;
      }
      pos.z += this.vz;
      if (playerHitsObstacle(pos.x, pos.y, pos.z, obstacles)) {
        pos.z = prevZ;
        this.vz = 0;
      }
      for (let k = 0; k < 3; k++) {
        if (pushPlayerOutOfObstacles(pos, obstacles)) {
          this.vx = 0;
          this.vz = 0;
        }
      }
      const bounds = (window.__currentLevel === 2 && window.__level2MapBounds)
        ? window.__level2MapBounds
        : MAP_BOUNDS;
      pos.x = Math.max(bounds.xMin, Math.min(bounds.xMax, pos.x));
      pos.z = Math.max(bounds.zMin, Math.min(bounds.zMax, pos.z));

      this.vy += GRAVITY;
      pos.y += this.vy;

      const platforms = level ? level.querySelectorAll('.platform') : [];
      let landed = false;
      const footY = pos.y - PLAYER_HALF.y;
      const groundIsLethal = window.__groundIsLethal !== false;

      if (groundIsLethal && (footY <= GROUND_Y + 0.05 || pos.y < -2)) {
        if (window.__onPlayerKilled) window.__onPlayerKilled();
        return;
      }
      if (!landed) {
        platforms.forEach((plat) => {
          if (plat.classList && plat.classList.contains('maze-wall')) return;
          const p = getWorldPosition(plat);
          const w = plat.getAttribute('width') || plat.getAttribute('data-width') || 1;
          const h = plat.getAttribute('height') || plat.getAttribute('data-height') || 1;
          const d = plat.getAttribute('depth') || plat.getAttribute('data-depth') || 1;
          const top = p.y + Number(h) / 2;
          const halfW = Number(w) / 2 + PLAYER_HALF.x + PLATFORM_MARGIN;
          const halfD = Number(d) / 2 + PLAYER_HALF.z + PLATFORM_MARGIN;
          const onTop = pos.y >= top + PLAYER_HALF.y - STANDING_TOLERANCE && pos.y <= top + PLAYER_HALF.y + STANDING_TOLERANCE;
          const inBounds = Math.abs(pos.x - p.x) < halfW && Math.abs(pos.z - p.z) < halfD;
          const fallingOnto = footY <= top + LANDING_FOOT_MAX && footY >= top - LANDING_FOOT_MIN && this.vy <= 0;
          if (inBounds && (fallingOnto || onTop)) {
            pos.y = top + PLAYER_HALF.y;
            this.vy = 0;
            this.grounded = true;
            landed = true;
          }
        });
      }
      if (!landed && !groundIsLethal && footY <= GROUND_Y + 0.25 && this.vy <= 0) {
        pos.y = GROUND_Y + PLAYER_HALF.y;
        this.vy = 0;
        this.grounded = true;
        landed = true;
      }
      if (this.keys.space && this.grounded) {
        this.vy = JUMP_VY;
        this.grounded = false;
      }

      if (!landed && this.vy !== 0) this.grounded = false;

      if (level && (!g || !g.gameOver)) {
        level.querySelectorAll('.collectable').forEach((coin) => {
          const c = getWorldPosition(coin);
          const dx = pos.x - c.x, dz = pos.z - c.z;
          if (dx * dx + dz * dz < COIN_COLLECT_DIST * COIN_COLLECT_DIST) {
            coin.parentNode?.removeChild(coin);
            if (window.__onCoinCollect) window.__onCoinCollect();
          }
        });
        const enemies = level.querySelectorAll('.enemy');
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i];
          const e = getWorldPosition(enemy);
          const dx = Math.abs(pos.x - e.x);
          const dz = Math.abs(pos.z - e.z);
          if (dx >= ENEMY_HIT_MARGIN || dz >= ENEMY_HIT_MARGIN) continue;
          const enemyTop = e.y + ENEMY_TOP_OFFSET;
          const playerFoot = pos.y - PLAYER_HALF.y;
          const stomping = playerFoot >= enemyTop - 0.2 && this.vy <= 0;
          if (stomping) {
            enemy.parentNode?.removeChild(enemy);
            this.vy = STOMP_BOUNCE;
            this.grounded = false;
            if (window.__onEnemyStomp) window.__onEnemyStomp();
            break;
          }
          if (pos.y - PLAYER_HALF.y < enemyTop + 0.15) {
            if (window.__onPlayerKilled) window.__onPlayerKilled();
            break;
          }
        }
      }
    },

    remove() {
      document.removeEventListener('keydown', this.onKeyDown);
      document.removeEventListener('keyup', this.onKeyUp);
    },
  });
}
