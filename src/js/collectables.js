/**
 * Monedas: con física usa colisión; sin física la recogida es por proximidad en player-controller-simple.
 * Al recoger se llama window.__onCoinCollect (puntos + comprobar victoria).
 * Al cargar el modelo GLB se aclaran los materiales para que no se vean oscuras.
 */

export function registerCollectables() {
  AFRAME.registerComponent('collectable', {
    init() {
      this.el.addEventListener('collide', (e) => {
        const other = e.detail.body?.el;
        if (other && other.id === 'player') {
          this.el.parentNode?.removeChild(this.el);
          if (window.__onCoinCollect) window.__onCoinCollect();
        }
      });
      this.el.addEventListener('model-loaded', () => {
        const mesh = this.el.getObject3D('mesh');
        if (mesh) {
          mesh.traverse((node) => {
            if (node.material) {
              const mats = Array.isArray(node.material) ? node.material : [node.material];
              mats.forEach((m) => {
                if (m.color) m.color.setHex(0xFFE066);
                if (m.emissive) m.emissive.setHex(0x554400);
                m.emissiveIntensity = 0.35;
              });
            }
          });
        }
      });
    },
  });
}
