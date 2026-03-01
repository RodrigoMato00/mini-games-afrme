/**
 * Componente fbx-model: carga un modelo FBX y lo muestra en la entidad.
 * Usa Three.js FBXLoader vía dynamic import (requiere import map "three" en index.html).
 */

export function registerFbxModel() {
  let FBXLoaderPromise = null;

  function getFBXLoader() {
    if (!FBXLoaderPromise) {
      FBXLoaderPromise = import('https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/loaders/FBXLoader.js')
        .then((m) => m.FBXLoader)
        .catch((err) => {
          console.error('[fbx-model] No se pudo cargar FBXLoader:', err);
          return null;
        });
    }
    return FBXLoaderPromise;
  }

  AFRAME.registerComponent('fbx-model', {
    schema: {
      src: { type: 'string' },
      scale: { type: 'vec3', default: '1 1 1' },
      rotation: { type: 'vec3', default: '0 0 0' },
      resourcePath: { type: 'string', default: '' },
    },

    init() {
      this.model = null;
    },

    async update() {
      const { src, scale, rotation, resourcePath } = this.data;
      if (!src) return;

      this.remove();
      const Loader = await getFBXLoader();
      if (!Loader) return;

      const loader = new Loader();
      if (resourcePath) loader.setResourcePath(resourcePath);
      loader.load(
        src,
        (model) => {
          this.model = model;
          model.scale.set(scale.x, scale.y, scale.z);
          model.rotation.set(
            (rotation.x * Math.PI) / 180,
            (rotation.y * Math.PI) / 180,
            (rotation.z * Math.PI) / 180
          );
          model.position.set(0, 0, 0);
          model.updateMatrixWorld(true);
          model.traverse((node) => {
            node.frustumCulled = false;
            if (node.material) {
              const mat = Array.isArray(node.material) ? node.material : [node.material];
              mat.forEach((m) => {
                m.transparent = false;
                m.opacity = 1;
                m.depthWrite = true;
              });
            }
          });
          this.el.setObject3D('mesh', model);
          this.el.emit('model-loaded', { format: 'fbx', model });
        },
        undefined,
        (err) => console.error('[fbx-model] Error cargando', src, err)
      );
    },

    remove() {
      if (this.model) {
        this.el.removeObject3D('mesh');
        this.model = null;
      }
    },
  });
}
