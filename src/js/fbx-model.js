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
      this.mixer = null;
      this._boundTick = this._tick.bind(this);
    },

    _tick() {
      if (this.mixer && this.el.sceneEl) {
        const dt = this.el.sceneEl.timeDelta;
        if (dt > 0) this.mixer.update(dt / 1000);
      }
    },

    tick(time, delta) {
      this._tick();
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
          const THREE = window.AFRAME?.THREE;
          if (THREE) {
            model.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            box.getSize(size);
            console.log('[fbx-model] Tamaño del modelo (antes de escala):', src, '→ ancho:', size.x.toFixed(2), 'alto:', size.y.toFixed(2), 'fondo:', size.z.toFixed(2), 'unidades');
          }
          model.scale.set(scale.x, scale.y, scale.z);
          model.rotation.set(
            (rotation.x * Math.PI) / 180,
            (rotation.y * Math.PI) / 180,
            (rotation.z * Math.PI) / 180
          );
          model.position.set(0, 0, 0);
          model.updateMatrixWorld(true);
          const isNube = src.indexOf('nube') !== -1;
          model.traverse((node) => {
            node.frustumCulled = false;
            if (node.material) {
              const mat = Array.isArray(node.material) ? node.material : [node.material];
              mat.forEach((m) => {
                m.transparent = false;
                m.opacity = 1;
                m.depthWrite = true;
                if (isNube) {
                  m.emissiveIntensity = 0;
                  if (m.emissive) m.emissive.setHex(0x000000);
                  m.roughness = 1;
                  m.metalness = 0;
                  if (m.color) m.color.multiplyScalar(0.7);
                  if (m.envMapIntensity !== undefined) m.envMapIntensity = 0;
                }
              });
            }
          });
          const clips = (model.animations || []).length ? model.animations : (model.children[0]?.animations || []);
          const isGoomba = src.indexOf('goomba') !== -1;
          if (isGoomba && clips.length === 0) {
            // FBX sin clips: animación procedural de “caminar” (rebote vertical)
            this.el.setAttribute('animation', 'property: position; from: 0 0 0; to: 0 0.06 0; dir: alternate; dur: 120; loop: true; easing: linear');
          }
          if (THREE && clips.length > 0) {
            this.mixer = new THREE.AnimationMixer(model);
            const walkClip = clips.find((c) => /walk|Walk|run|Run|idle|Idle|caminar/i.test(c.name)) || clips[0];
            const action = this.mixer.clipAction(walkClip);
            action.setLoop(THREE.LoopRepeat);
            action.clampWhenFinished = false;
            action.play();
            this.el.sceneEl.addEventListener('tick', this._boundTick);
          }
          this.el.setObject3D('mesh', model);
          this.el.emit('model-loaded', { format: 'fbx', model });
        },
        undefined,
        (err) => console.error('[fbx-model] Error cargando', src, err)
      );
    },

    remove() {
      if (this.el.sceneEl && this._boundTick) {
        this.el.sceneEl.removeEventListener('tick', this._boundTick);
      }
      this.mixer = null;
      if (this.model) {
        this.el.removeObject3D('mesh');
        this.model = null;
      }
    },
  });
}
