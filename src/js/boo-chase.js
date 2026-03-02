/**
 * Boo: te sigue; si lo mirás se queda quieto (usa window.__playerLookingAtBoo que pone boo-look-detector en el jugador);
 * al dejar de mirar espera 1 s y te vuelve a seguir. Si te alcanza, perdés.
 */
AFRAME.registerComponent('boo-chase', {
  schema: {
    speed: { type: 'number', default: 4 },
    delayAfterLookAway: { type: 'number', default: 1 },
    lookRadius: { type: 'number', default: 0.8 },
  },

  init() {
    this.frozen = false;
    this.lookAwayAt = null;
    this.canMove = true;
    this.playerEl = null;
    this.lookSphere = null;

  },

  tick(time, delta) {
    const scene = this.el.sceneEl;
    if (!scene) return;
    const g = window.__gameState;
    if (g && (g.gameOver || g.won)) return;

    if (!this.playerEl) {
      this.playerEl = scene.querySelector('#player');
      if (this.playerEl && !this.playerEl.hasAttribute('boo-look-detector')) {
        this.playerEl.setAttribute('boo-look-detector', '');
      }
    }

    const THREE = window.AFRAME?.THREE;
    if (!THREE) return;

    if (!this.lookSphere) {
      const geo = new THREE.SphereGeometry(this.data.lookRadius, 8, 6);
      const mat = new THREE.MeshBasicMaterial({ visible: false });
      this.lookSphere = new THREE.Mesh(geo, mat);
      this.lookSphere.visible = false;
      this.lookSphere.userData.booEl = this.el;
      scene.object3D.add(this.lookSphere);
    }

    const booWorld = new THREE.Vector3();
    this.el.object3D.getWorldPosition(booWorld);
    this.lookSphere.position.copy(booWorld);
    scene.object3D.updateMatrixWorld(true);

    const isLookingAtBoo = !!window.__playerLookingAtBoo;

    if (isLookingAtBoo) {
      this.frozen = true;
      this.canMove = false;
      this.lookAwayAt = null;
      return;
    }

    if (this.frozen) {
      this.frozen = false;
      this.lookAwayAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    }

    if (this.lookAwayAt !== null) {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (now - this.lookAwayAt < this.data.delayAfterLookAway * 1000) return;
      this.canMove = true;
      this.lookAwayAt = null;
    }

    if (!this.canMove) return;
    if (!this.playerEl) return;

    const dt = Math.min((delta || 0) / 1000, 0.1);
    const playerWorld = new THREE.Vector3();
    this.playerEl.object3D.getWorldPosition(playerWorld);

    const pos = this.el.getAttribute('position');
    const dx = playerWorld.x - pos.x;
    const dz = playerWorld.z - pos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 0.01) return;

    const move = (this.data.speed * dt) / dist;
    const newX = pos.x + dx * move;
    const newZ = pos.z + dz * move;

    this.el.setAttribute('position', { x: newX, y: pos.y, z: newZ });

    const rotY = (Math.atan2(dx, dz) * 180) / Math.PI;
    this.el.setAttribute('rotation', { x: 0, y: rotY, z: 0 });
  },

  remove() {
    if (this.lookSphere && this.el.sceneEl && this.el.sceneEl.object3D) {
      this.el.sceneEl.object3D.remove(this.lookSphere);
      if (this.lookSphere.geometry) this.lookSphere.geometry.dispose();
      if (this.lookSphere.material) this.lookSphere.material.dispose();
    }
  },
});
