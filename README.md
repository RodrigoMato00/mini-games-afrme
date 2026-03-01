# Retro Platform 3D

A 3D platformer in the style of Mario Bros built with **A-Frame**. Four levels: platforms, maze, lava, and clouds. Collect the coins, avoid (or stomp) the enemies, and reach the castle.

## How to run

```bash
npm start
```

Open `http://localhost:3000`. On the start screen, pick a level. **Click** on the scene to lock the pointer and play.

## Controls

- **WASD** — move
- **Space** — jump
- **R** / **Enter** / **Space** (on game over) — restart

## Goal

Each level has **10 coins**. Collect them all before time runs out and reach the castle. If an enemy touches you, you lose; stomp them from above to defeat them.

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | Start screen (Mario + A-Frame logos, level buttons). |
| `nivel1.html` … `nivel4.html` | Level pages; each loads its `main-levelN.js`. |
| `src/js/main.js` | Level 1 entry: scene + game. |
| `src/js/main-level2.js` … `main-level4.js` | Entry for each level (inject scene and start game). |
| `src/js/scene.js`, `scene-level2.js` … | Scene setup (ground, lights, sky) per level. |
| `src/js/level.js`, `level2.js` … `level4.js` | Level geometry: platforms, walls, coins, enemies, castle. |
| `src/js/game.js` | `Game` class: state, UI, player creation, restart. |
| `src/js/player.js` | Creates the player entity (first-person camera). |
| `src/js/player-controller.js` | WASD + jump (collision logic, no physics engine in levels). |
| `src/js/game-state.js` | Score, coins, time, game over / victory. |
| `src/js/ui.js` | HUD and game over screen (restart / next level / menu). |
| `src/js/sounds.js` | Background music and sound effects (coin, jump, game over, victory). |

## Requirements

- Modern browser (Chrome, Firefox, Safari).
- A static server (e.g. `npx serve`) so ES modules load correctly.
