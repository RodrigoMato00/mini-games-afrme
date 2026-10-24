# Workshop: Construir un nivel tipo Mario (Nivel 1 mínimo) paso a paso

Objetivo: tener **una plataforma**, **un enemigo** y **una moneda** como el nivel 1 de Mario, usando A-Frame y JavaScript.

Desde la raíz del proyecto (`retroAframe`), ejecuta `npm start` y abre en el navegador:

- **Paso 1:** [http://localhost:3000/workshop/paso1-plataforma.html](http://localhost:3000/workshop/paso1-plataforma.html)
- **Paso 2:** [http://localhost:3000/workshop/paso2-enemigo.html](http://localhost:3000/workshop/paso2-enemigo.html)
- **Paso 3:** [http://localhost:3000/workshop/paso3-moneda.html](http://localhost:3000/workshop/paso3-moneda.html)
- **Jugar nivel completo:** [http://localhost:3000/nivel1.html](http://localhost:3000/nivel1.html)

---

## Paso 1 — Escena + una plataforma

**Qué hacemos:** Escena A-Frame con cielo, suelo, luz y **una sola plataforma** (un bloque).

1. Escena `<a-scene>` con fondo y niebla (estilo cielo Mario).
2. Luz ambiente + direccional.
3. Suelo (`<a-plane>`).
4. **Una caja** como plataforma: posición, ancho, alto, profundidad, color (verde o marrón).

**Conceptos:** `a-scene`, `a-plane`, `a-box`, `position`, `rotation`, luces.

**Archivo:** `workshop/paso1-plataforma.html`

---

## Paso 2 — Añadir un enemigo

**Qué hacemos:** Una entidad que **se mueve solo** (ida y vuelta) sobre la plataforma.

1. Reutilizamos el componente `enemy-movement` del proyecto (`src/js/enemy-movement.js`).
2. Creamos un `<a-entity>` con posición sobre la plataforma.
3. Le damos forma (por ejemplo un `<a-box>` marrón) y el atributo `enemy-movement="range: 1; axis: x"`.

**Conceptos:** componentes A-Frame, `AFRAME.registerComponent`, entidades con hijos, movimiento en `tick`.

**Archivo:** `workshop/paso2-enemigo.html`

---

## Paso 3 — Añadir una moneda

**Qué hacemos:** Un objeto que **parece una moneda** (cilindro dorado con animación de giro).

1. Creamos una entidad con un `<a-cylinder>` (o `<a-sphere>` achatada): color dorado, escala pequeña.
2. Añadimos `animation="property: rotation; to: 0 360 0; loop: true; dur: 1500"` para que gire.

**Conceptos:** `a-cylinder`, componente `animation`, posicionar sobre la plataforma.

**Archivo:** `workshop/paso3-moneda.html`

---

## Paso 4 (opcional) — Jugar el nivel completo

El nivel 1 completo del juego (varias plataformas, 3 enemigos, 10 monedas, castillo, jugador con WASD y salto) está en:

- **nivel1.html** — Carga `src/js/main.js`, que inyecta la escena (`scene.js`) y el nivel (`level.js`) y arranca el juego (`game.js`).

Controles: **clic** en la escena para bloquear el ratón, **WASD** para mover, **Espacio** para saltar. Recoge las monedas y llega al castillo.

---

## Resumen

| Paso | Contenido           | Archivo                    |
|------|--------------------|----------------------------|
| 1    | Escena + 1 plataforma | `workshop/paso1-plataforma.html` |
| 2    | + 1 enemigo (movimiento) | `workshop/paso2-enemigo.html`   |
| 3    | + 1 moneda (animada) | `workshop/paso3-moneda.html`    |
| 4    | Nivel jugable completo | `nivel1.html`                  |

Inspector A-Frame: **Ctrl + Alt + I** (Mac: **Ctrl + Option + I**) para inspeccionar entidades y componentes.
