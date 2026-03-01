# Assets (texturas y modelos)

Los modelos y texturas que usamos en el juego vienen de la carpeta **`objetos/`** en la raíz del proyecto. Ahí hay varios `.zip` que se descomprimieron y se copiaron aquí:

- **`models/mario-coin.glb`** — Moneda estilo Mario (del zip `mario-coin.zip`). Se usa para todas las monedas del nivel.
- **`models/castle.fbx`** — Castillo pequeño Super Mario Bros (del zip `castle-small-super-mario-bros.zip`). Reservado para uso futuro (cargar FBX requiere un loader adicional).
- **`models/goomba.fbx`** — Goomba Link's Awakening (del zip `links-awakening-goomba.zip`). Reservado para uso futuro.
- **`models/pipe.fbx`** — Tubería de Mario Bros (del zip `tuberia-de-mario-bros.zip`). Se usa en el nivel con el componente `fbx-model`.
- **`textures/goomba/`** — Texturas del Goomba (`mi_body_alb.png`, etc.). La textura albedo se usa en el cuerpo de los enemigos.

## Texturas

Si las texturas desde threejs.org no cargan (CORS), podés usar imágenes locales:

1. Descargá texturas estilo plataformas (hierba, ladrillo) desde:
   - [OpenGameArt - Super Mario World Style Tiles](https://opengameart.org/content/super-mario-world-style-tiles) (CC0)
   - [Block Land - Mario-like Tileset](https://v3x3d.itch.io/block-land) (CC0)
2. Guardá por ejemplo: `grass.png`, `brick.png` en esta carpeta.
3. En `scene.js` y `level.js` reemplazá las URLs por `assets/grass.png` y `assets/brick.png`.

## Modelos 3D

- Las **monedas** usan el modelo GLB en `assets/models/mario-coin.glb` (definido en `level.js` con `ASSET_PATHS.coinModel`).
- Los **enemigos** usan esferas con la textura de Goomba en `assets/textures/goomba/mi_body_alb.png`.
- Para añadir más modelos GLB (personaje, enemigos 3D): poné el `.glb` en `assets/models/` y en el código usá `gltf-model="url(assets/models/tu-modelo.glb)"` con la escala que necesites.
