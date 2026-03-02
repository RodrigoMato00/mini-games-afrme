/**
 * Va en el JUGADOR. Hace el raycast desde la cámara del jugador al centro de pantalla.
 * Si el rayo toca algo con userData.booEl, pone window.__playerLookingAtBoo = true.
 * Así el Boo solo lee esa variable y no depende de obtener la cámara desde fuera.
 */
AFRAME.registerComponent('boo-look-detector', {
  init() {
    this.raycaster = null;
    this.center = null;
  },
  tick() {
    if (window.__currentLevel !== 9) return;
    const scene = this.el.sceneEl;
    if (!scene) return;
    const THREE = window.AFRAME?.THREE;
    if (!THREE) return;

    const camEl = this.el.querySelector('[camera]');
    if (!camEl) return;
    const camera = camEl.getObject3D && camEl.getObject3D('camera');
    if (!camera || !camera.isCamera) return;

    if (!this.raycaster) {
      this.raycaster = new THREE.Raycaster();
      this.center = new THREE.Vector2(0, 0);
    }

    scene.object3D.updateMatrixWorld(true);
    this.raycaster.setFromCamera(this.center, camera);
    const hits = this.raycaster.intersectObjects(scene.object3D.children, true);

    window.__playerLookingAtBoo = false;
    for (let i = 0; i < hits.length; i++) {
      if (hits[i].object && hits[i].object.userData && hits[i].object.userData.booEl) {
        window.__playerLookingAtBoo = true;
        break;
      }
    }
  },
});
