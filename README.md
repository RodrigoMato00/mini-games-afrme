# Retro Platform 3D

Juego retro tipo Mario Bros en 3D, hecho con **A-Frame** y **Three.js**. Toda la escena y la lógica se generan desde **JavaScript** (sin montar el nivel en HTML).

## Cómo jugar

1. Instalar dependencias (solo necesitas un servidor estático; los scripts de A-Frame se cargan por CDN):
   ```bash
   npm install
   npm start
   ```
2. Abre `http://localhost:3000` en el navegador.
3. Haz **click** en la escena para bloquear el puntero (primera persona).
4. **WASD** para moverte, **Espacio** para saltar.
5. Recoge las **9 monedas** antes de que se acabe el tiempo (120 s). Evita a los enemigos rojos. Los bloques amarillos (?) se pueden golpear desde abajo para sacar una moneda extra.

**Contenido:** suelo y plataformas con texturas (hierba, ladrillo), enemigos con forma de bicho (cuerpo + ojos), bandera de meta al final, instrucciones al inicio.

## Estructura del proyecto

- `index.html` — Carga A-Frame, el sistema de física y el script del juego (mínimo HTML).
- `src/js/main.js` — Punto de entrada: crea la escena y arranca el juego.
- `src/js/scene.js` — Crea la escena (suelo, luces, niebla) de forma programática.
- `src/js/level.js` — Define el nivel: plataformas, bloques, tuberías y monedas (datos + creación de entidades).
- `src/js/player.js` — Crea el jugador (cámara + cuerpo físico).
- `src/js/player-controller.js` — Componente A-Frame: controles WASD y salto.
- `src/js/collectables.js` — Lógica de monedas (colisión y recogida).
- `src/js/game.js` — Clase principal que registra componentes e inicializa el jugador.

## Estilo retro y assets

El nivel usa **primitivas de A-Frame** (cajas, cilindros, planos) con **colores planos** para un look retro/low-poly. Los colores están definidos en `level.js` (`RETRO_COLORS`).

Para hacerlo más realista o con modelos 3D:

- **Modelos glTF/GLB**: Puedes cargar personajes o escenarios con `<a-entity gltf-model="url(...)">` creado desde JS con `setAttribute('gltf-model', 'src: url(...)')`.
- **Packs recomendados (gratuitos)**:
  - [Ultimate Platformer Pack (Quaternius)](https://quaternius.com/packs/ultimateplatformer.html) — Personaje animado, enemigos, plataformas; disponible en glTF.
  - [LowPoly Platformer Pack (Quaternius)](https://quaternius.itch.io/platformer-pack) — Bloques modulares, CC0.
- **Texturas**: Para suelo o paredes, usa `material="src: url(...)"` en las entidades que crees en `level.js` o `scene.js`.

## Física

Se usa **aframe-physics-system** con **Cannon.js**: suelo y plataformas con `static-body`, jugador con `dynamic-body` y el componente `player-controller` para movimiento y salto.

## Requisitos

- Navegador moderno (Chrome/Firefox/Safari).
- Servidor local (por ejemplo `npx serve`) para que los módulos ES carguen correctamente.

## Pantalla en blanco / CSP bloquea eval

A-Frame (y dependencias como three-bmfont-text) usan `new Function()`, que algunos entornos bloquean con Content Security Policy. En el proyecto ya está:

- **Meta CSP** en `index.html` con `script-src ... 'unsafe-eval'` para permitir ese uso.
- **serve.json** con cabecera CSP permisiva al usar `npm start` (serve).

Si la pantalla sigue en blanco y en la consola sale *"Content Security Policy blocks the use of 'eval'"*:

1. Abre la app en un navegador normal (Chrome, Firefox) en `http://localhost:PUERTO`, no en el visor embebido del editor.
2. Comprueba que no haya extensiones que fuercen una CSP estricta.
3. En producción, mantén `unsafe-eval` en `script-src` o valora alojar la experiencia en un dominio que no aplique una CSP que lo prohíba.
