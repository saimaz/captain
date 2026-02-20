# Captain ORBIO Adventure

## Project Overview
A Mario-style browser platformer game built for a company fun competition. Must run entirely from `index.html` + `asset/` + `sound/` folders (no build step, no server-side code).

**Tech Stack:** Phaser 3.87.0 (loaded via CDN), vanilla ES6 JavaScript (no modules), HTML5 Canvas

---

## File Structure
```
game/
├── index.html              # Entry point - loads Phaser CDN + all JS scripts in order
├── compose.yml             # Docker: nginx:alpine serving game/ on port 8080
├── js/
│   ├── constants.js        # All game constants (GAME object) — loaded FIRST
│   ├── GameRegistry.js     # Cross-scene state manager wrapping Phaser registry
│   ├── GameLevelRegistry.js # Maps level number → level data object
│   ├── UIHelper.js         # Reusable sprite-based UI building blocks (9-slice panels, buttons)
│   ├── PlayerStateMachine.js # Player animation FSM + 3-hit sword combo system
│   ├── game.js             # Phaser.Game config (800x480, arcade physics, scene list)
│   ├── levels/
│   │   ├── Level1Data.js   # 7 zones (Shore→Jungle→Tidal→Ruins→Cliff→Storm→Lookout), 11264px
│   │   ├── Level2Data.js   # Pirate Ship Interior (Medium platforms, fierce enemies)
│   │   └── Level3Data.js   # Ocean Crossing (Moving platforms, cannons, pink stars)
│   └── scenes/
│       ├── PreloadScene.js # Loads ALL assets, creates ALL animations → starts MenuScene
│       ├── MenuScene.js    # Wood-and-paper style menu (PLAY, SETTINGS, HOW TO PLAY)
│       ├── LevelSelectScene.js # 3-card level selection screen (Level 1, 2, 3)
│       ├── PauseScene.js   # ESC pause overlay (resume/settings/exit) — pixel-art wood UI
│       ├── GameScene.js    # Main game (Player, Enemy, GameScene classes)
│       ├── UIScene.js      # HUD overlay (health hearts, score, coin counter)
│       └── GameOverScene.js# Win/lose screen with score, ranking, confetti on win
├── asset/                  # All game assets (do not rename folders - paths are hardcoded)
│   ├── Captain Clown Nose/ # Player sprites (without sword + with sword + dust + dialogue)
│   ├── The Crusty Crew/    # Enemy sprites (Crabby, Fierce Tooth, Pink Star)
│   ├── Pirate Treasure/    # Collectibles (coins, diamonds, potions, skull)
│   ├── Palm Tree Island/   # Background, terrain tileset, objects (chest, flag, spikes)
│   │   ├── Sprites/Back Palm Trees/    # 3 variants × 4 frames each (64×64px)
│   │   └── Sprites/Front Palm Trees/  # Top: 39×32 × 4 frames; Bottom: 96×96
│   ├── Pirate Ship/        # Alternative tileset (available for Level 2)
│   ├── Shooter Traps/      # Cannon + cannonball sprites
│   ├── Wood and Paper UI/  # Health bar sprites + mobile buttons
│   ├── Merchant Ship/      # (Available for Level 3)
│   ├── derila.png          # Original Derila pillow image (white background, 896x1200)
│   └── derila-game.png     # Processed game sprite: background removed, resized ~64px
├── sound/                  # Audio files
│   ├── jump.mp3            # Player jump SFX
│   ├── fight.mp3           # Sword attack SFX
│   ├── fitght_hit.mp3      # Hit/damage SFX (note: typo in filename is intentional)
│   ├── music_1.mp3         # In-game background music
│   ├── music_2.mp3         # Menu background music
│   ├── music_3.mp3         # (Available)
│   └── music_4.mp3         # (Available)
└── tile-viewer.html        # Dev tool: shows terrain tileset frames with indices (can delete)
```

---

## Running the Game

### Docker — always use this (port 8080)
```bash
# The container is already running. File changes are live immediately — no restart needed.
# Open http://localhost:8080

# Start if not running:
docker compose up -d

# Verify a file is served:
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/js/constants.js
```
`compose.yml` maps `game/` → `/usr/share/nginx/html` (read-only bind mount).

**Never start a local Python server** — Docker is the dev server. Don't use `python3 -m http.server`.

---

## Script Load Order in `index.html`
Order matters — each file depends on the ones above it:
```html
<script src="js/constants.js"></script>        <!-- GAME object (required by all) -->
<script src="js/GameRegistry.js"></script>     <!-- Registry wrapper -->
<script src="js/levels/Level1Data.js"></script><!-- Level 1 data -->
<script src="js/levels/Level2Data.js"></script><!-- Level 2 data -->
<script src="js/levels/Level3Data.js"></script><!-- Level 3 data -->
<script src="js/GameLevelRegistry.js"></script><!-- Level registry -->
<script src="js/PlayerStateMachine.js"></script><!-- Player FSM -->
<script src="js/UIHelper.js"></script>         <!-- UI Building blocks -->
<script src="js/scenes/PreloadScene.js"></script>
<script src="js/scenes/MenuScene.js"></script>
<script src="js/scenes/LevelSelectScene.js"></script>
<script src="js/scenes/GameScene.js"></script>
<script src="js/scenes/UIScene.js"></script>
<script src="js/scenes/GameOverScene.js"></script>
<script src="js/scenes/PauseScene.js"></script>
<script src="js/game.js"></script>             <!-- Phaser.Game (last) -->
```

---

## Architecture

### Constants (`js/constants.js`)
Single `GAME` object (frozen) holds all magic numbers. Reference as `GAME.PLAYER.SPEED`, `GAME.POINTS.COIN`, etc. Never hardcode numbers in scene files.

```javascript
GAME.TILE = 32           GAME.WORLD_W = 8000     GAME.WORLD_H = 1280
GAME.PLAYER.SPEED = 185  GAME.PLAYER.JUMP_VEL = -560
GAME.PLAYER.HEALTH = 3   GAME.PLAYER.INVINCIBLE_MS = 1500
GAME.PLAYER.COMBO_WINDOW = 800   // ms to chain sword hits
GAME.ENEMY_AI.CHASE_RANGE = 150  GAME.ENEMY_AI.ATTACK_RANGE = 65
```

### GameRegistry (`js/GameRegistry.js`)
Wraps `game.registry` for cross-scene persistent state. Initialized in `PreloadScene.create()`.
```javascript
GameRegistry.init(game)           // called once in PreloadScene
GameRegistry.get(game, 'sfxOn')   // read a value
GameRegistry.set(game, 'musicOn', false)
GameRegistry.toggle(game, 'sfxOn') // flip boolean, returns new value
// Keys: health, score, coins, level, musicOn, sfxOn
```

### Level Data (`js/levels/Level1Data.js`)
All static level arrays — ground, platforms, enemies, collectibles, water pits, cannons, spikes, back palms, front palms. GameScene reads from this; it never hardcodes positions.

### Player State Machine (`js/PlayerStateMachine.js`)
Manages all player animations and sword combat.

**States:** `idle` | `running` | `jumping` | `falling` | `landing` | `hit` | `dead` | `attacking` | `air_attacking`

**Sword combo (Z key):**
- Press Z on ground → Attack 1 → Attack 2 → Attack 3 (chain within 800ms window)
- Press Z in air → Air Attack 1
- Sword hitbox (`this._swordHitbox`) is a physics image, enabled for ~2 frames during each swing
- `fsm.isAttacking()` — true during attacking/air_attacking states

---

## Asset Details

### Terrain Tilesets (32x32 per tile)
- **Palm Tree Island:** `asset/Palm Tree Island/Sprites/Terrain/Terrain (32x32).png` — 17×5 grid (85 tiles)
  - Frame 1: grass-top tile (used for platform surfaces)
  - Frame 7: interior stone fill (used below ground surface)

### Background & Parallax Scrolling
Open/outdoor scenes use a **multi-layer parallax** system for depth. Each layer scrolls at a different rate relative to the camera, creating a 3D depth illusion.

**Parallax layer stack** (back to front):
| Depth | Layer | scrollFactor | Technique |
|-------|-------|-------------|-----------|
| -20 | Sky fill (solid color) | 0 (fixed) | `add.rectangle()` |
| -19 | BG image (`bg-main`) | 0 (fixed) | `tileSprite` + `tilePositionX` updated in `update()` at 0.2× camera rate |
| -18 | Clouds (big + small) | 0 (fixed) | Auto-drift in `update()` — continuous movement independent of camera |
| -17 | Ambient overlay | 0 (fixed) | Optional color tint (e.g. Level 2 dark interior) |
| -5 | Back palms | 1.0 (world) | Scroll with world, decorative trees behind terrain |

**BG parallax** — the `bg-main` tileSprite stays fixed on screen (`scrollFactor(0)`) but its `tilePositionX` is manually updated each frame:
```javascript
// In update():
this.bgLayer.tilePositionX = this.cameras.main.scrollX * bgScrollRate; // 0.2
```
This creates smooth horizontal parallax. The `bgScrollRate` is defined per level in `visual.bgScrollRate` (default 0.2).

**Cloud auto-drift** — clouds move continuously to create a living sky, independent of camera movement:
- **Big Clouds** (`cloud-big`, 224×36px) — used as a `tileSprite` across the viewport. Its `tilePositionX` is decremented each frame for seamless looping drift.
- **Small Clouds** (`cloud-1`/`cloud-2`/`cloud-3`) — individual sprites at `scrollFactor(0)` with varying speeds (0.2–0.3 px/frame). When a cloud drifts off the right edge, it wraps to the left.
```javascript
// In update():
this._bigClouds.tilePositionX -= 0.3;           // continuous tileSprite scroll
this._smallClouds.forEach(c => {
    c.sprite.x += c.speed;                       // individual drift
    if (c.sprite.x > CAM_W + 100) c.sprite.x = -100;  // wrap around
});
```

**Scaling** — BG image (384×128px) is scaled uniformly to fill viewport height:
```javascript
const s = H / bgTex.height;
bgLayer.setScale(s, s);
```

**Sky fill colors:** `0xD4690A` (Level 1 warm orange), `0x0D0A18` (Level 2 dark interior)

### Palm Trees
Path: `asset/Palm Tree Island/Sprites/`

#### Back Palms — Background Decoration (depth -5)
Path: `Back Palm Trees/`
3 variants × 4 animation frames each. All 64×64px per frame. Used behind terrain to add depth to outdoor scenes.

| Variant | Visual | Key prefix | Anim key | Files |
|---------|--------|------------|----------|-------|
| **Left** | Trunk leans left, foliage droops left | `back-palm-left` | `back-palm-left` | `Back Palm Tree Left 01–04.png` |
| **Regular** | Straight trunk, centered foliage | `back-palm-regular` | `back-palm-regular` | `Back Palm Tree Regular 01–04.png` |
| **Right** | Trunk leans right, foliage droops right | `back-palm-right` | `back-palm-right` | `Back Palm Tree Right 01–04.png` |

**Placement rules:**
- `setOrigin(0.5, 1)` — anchored at base (bottom-center)
- Positioned at `groundY - 10` in world coordinates (slight offset above ground surface)
- Scale 2.0–2.4 (varies per instance for natural look)
- Animation: 5fps, loop (`repeat: -1`)
- Level data: `backPalms` array of `[worldX, variantIndex(0-2), scale]`
  - 0 = left, 1 = regular, 2 = right
- Mix variants for visual variety — avoid repeating the same variant consecutively

```javascript
// GameScene placement
const palmVariants = ['back-palm-left', 'back-palm-regular', 'back-palm-right'];
LD.backPalms.forEach(([wx, vi, sc]) => {
    const key = palmVariants[vi];
    this.add.sprite(wx, groundY - 10, key + '-1')
        .setScale(sc).setDepth(-5).setOrigin(0.5, 1)
        .play(key);
});
```

#### Front Palms — Platform Decoration (depth 1)
Path: `Front Palm Trees/`
Placed ON TOP of platforms, rendered in front of terrain. Only the **top** sprite is used.

| Part | Visual | Key prefix | Size | Status |
|------|--------|------------|------|--------|
| **Top** | Dense green canopy (leafy treetop) | `front-palm-top` | 39×32px × 4 frames | Used |
| **Bottom** | Trunk + grass base (96×96 spritesheet) | `front-palm-bottom` | 96×96px | **DO NOT USE** — renders as ugly blobs |

**Placement rules:**
- `setOrigin(0.5, 1)` — anchored at base (bottom-center)
- Positioned at platform surface row: `row * TILE - 4` (slight offset above surface)
- Scale 2.2 in game
- Animation: `front-palm-top`, 5fps, loop
- Level data: `frontPalms` array of `[col, row]`
- Place 1 per platform max — too many creates visual clutter

```javascript
// GameScene placement
LD.frontPalms.forEach(([col, row]) => {
    const x = col * GAME.TILE + GAME.TILE / 2;
    const y = row * GAME.TILE - 4;
    this.add.sprite(x, y, 'front-palm-top-1')
        .setScale(2.2).setDepth(1).setOrigin(0.5, 1)
        .play('front-palm-top');
});
```

#### Palm Usage by Level
| Level | Back Palms | Front Palms | Notes |
|-------|-----------|-------------|-------|
| Level 1 (Beach) | 27 instances, all 3 variants | 12 instances | Outdoor tropical scene |
| Level 2 (Pirate Ship) | None | None | Indoor scene — `hasBackPalms: false` |
| Level 3 (Ocean) | TBD | TBD | Could use for island segments |

### Character Sprites
- **Player (Captain Clown Nose without Sword):** 64×40px per frame
  - Physics body: `setSize(32, 36).setOffset(16, 3)`
  - Sword attack animations from `Captain Clown Nose with Sword/15-Attack 1/` etc.
- **Enemies (Crabby / Fierce Tooth / Pink Star):** ~72×32px per frame
  - Physics body: `setSize(40, 28).setOffset(16, 2)`
  - All have: idle, run, anticipation, attack, hit, dead, dead-ground animations

### Derila Pillow (Special Collectible — Game Mascot)
- `asset/derila-game.png` — transparent background, ~64px
- Worth **500 points** — floating tween animation in levels
- **Derila is the game's mascot item** — should be prominently featured:
  - Include generously in every level (not just 3 — spread more throughout zones)
  - **Menu screen:** show Derila pillows floating around the player preview instead of coins
  - Use as visual identity for the game alongside Captain ORBIO

### Door (Level Goal)
- Path: `asset/Pirate Ship/Sprites/Decorations/Door/`
- **Opening:** 5 frames (`Opening/01.png`–`05.png`) — plays when player reaches goal
- **Closing:** 5 frames (`Closing/01.png`–`05.png`) — idle loop while waiting for player
- Keys: `door-open-{n}`, `door-close-{n}` (n=1–5)
- Anims: `door-open` (10fps, once), `door-close` (8fps, loop)
- **Each level ends when the player overlaps the door** → door plays opening anim → win screen
- Placed at `doorCol`/`doorRow` in level data (e.g. Level 1: col 218, row 22)
- Physics body: `setSize(28, 48)`, origin `(0.5, 1)`, depth 2

---

## Terrain Tileset Assembly

### Palm Tree Island Terrain (17×5 = 85 frames)
Spritesheet: `asset/Palm Tree Island/Sprites/Terrain/Terrain (32x32).png`
Used in: Level 1 (`groundTerrainKey: 'terrain'`)

**9-slice frame map** (0-indexed, 17 cols per row):
```
Row 0:  TL=0   TC=1   TR=2    (grass-top edges + surface)
Row 1:  ML=17  MC=18  MR=19   (middle edges + stone fill)
Row 2:  BL=34  BC=35  BR=36   (bottom edges + fill)
```

**Frame roles:**
| Frame | Name | Usage |
|-------|------|-------|
| 0 | Top-Left corner | Left edge of platform surface |
| 1 | Top-Center | Grass-top surface tile (flat platform top) |
| 2 | Top-Right corner | Right edge of platform surface |
| 17 | Mid-Left edge | Left wall of thick platform |
| 18 | Mid-Center fill | Interior stone fill |
| 19 | Mid-Right edge | Right wall of thick platform |
| 34 | Bot-Left corner | Bottom-left of thick platform |
| 35 | Bot-Center | Bottom edge of thick platform |
| 36 | Bot-Right corner | Bottom-right of thick platform |

**Additional notable frames:**
- 9, 26 — Inner corner tiles (concave corners for complex shapes)
- 12–14 — Decorative grass variants (surface decoration)
- 47–48 — Additional decorative tiles
- 57–58, 72–73 — Organic/rounded shape variants (left side)
- 60–61, 77–78 — Organic/rounded shape variants (right side)
- 7 — Legacy interior fill (used in Level1Data as `groundFillFrame: 7`)

### Pirate Ship Terrain (19×13 = 247 frames)
Spritesheet: `asset/Pirate Ship/Sprites/Tilesets/Terrain and Back Wall (32x32).png`
Used in: Level 2 (`groundTerrainKey: 'pirate-terrain'`)

**Platform tileset** (separate file):
`asset/Pirate Ship/Sprites/Tilesets/Platforms (32x32).png` → key `pirate-platform`
- Frame 0 = single platform tile (used for all Level 2 platforms)

**Ground frames:**
- Frame 0 = top surface (`groundTopFrame: 0`)
- Frame 1 = fill below surface (`groundFillFrame: 1`)

**Back wall frames** (rows 3–12):
- Frame 57+ = dark back-wall stone tiles (used for border decoration in scene.html)

### Assembly Patterns — `buildPlatform` Helper

The `_buildBlock(col, row, w, h)` function auto-selects the correct 9-slice frame for each tile position:

```javascript
// 9-slice frame indices (Palm Tree Island terrain, 17×5 grid)
const F = {
  TL: 0,  TC: 1,  TR: 2,
  ML: 17, MC: 18, MR: 19,
  BL: 34, BC: 35, BR: 36,
};

function buildBlock(col, row, w, h) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      let frame;
      const left = dx === 0, right = dx === w - 1;
      const top  = dy === 0, bot   = dy === h - 1;

      if (w === 1 && h === 1) {
        frame = F.TC;   // single tile → grass cap
      } else if (w === 1) {
        // vertical pillar
        frame = top ? F.TC : bot ? F.BC : F.MC;
      } else if (h === 1) {
        // thin horizontal platform
        frame = left ? F.TL : right ? F.TR : F.TC;
      } else {
        // full N×M block — all 9 frame types
        if      (top && left)  frame = F.TL;
        else if (top && right) frame = F.TR;
        else if (top)          frame = F.TC;
        else if (bot && left)  frame = F.BL;
        else if (bot && right) frame = F.BR;
        else if (bot)          frame = F.BC;
        else if (left)         frame = F.ML;
        else if (right)        frame = F.MR;
        else                   frame = F.MC;
      }

      const px = (col + dx) * TILE + TILE / 2;
      const py = (row + dy) * TILE + TILE / 2;
      this.add.image(px, py, 'terrain', frame).setDepth(0);
    }
  }
}
```

**Edge cases:**
| Shape | Tiles used | Example |
|-------|-----------|---------|
| **1×1** | TC only | Single floating tile |
| **2×1** | TL, TR | Minimal thin platform |
| **N×1** | TL + (N-2)×TC + TR | Thin horizontal platform |
| **1×2** | TC top, BC bottom | Minimal pillar |
| **1×M** | TC + (M-2)×MC + BC | Tall pillar |
| **2×2** | TL,TR / BL,BR | Minimal block (no fill) |
| **N×M** | Full 9-slice | All corners, edges, and fill |

**How Level data uses terrain:**
- Level 1: `groundTerrainKey: 'terrain'`, `groundTopFrame: 1`, `groundFillFrame: 7`
  - Uses only TC (frame 1) for surfaces and MC-equivalent (frame 7) for fill
  - Does NOT use the 9-slice corner/edge system yet
- Level 2: `groundTerrainKey: 'pirate-terrain'`, `groundTopFrame: 0`, `groundFillFrame: 1`
  - Platforms use separate `pirate-platform` spritesheet (frame 0)

**Dev tools:**
- `tile-viewer.html` — shows all tileset frames with numbered indices
- `scene.html` — interactive terrain prototype demonstrating 9-slice assembly

---

## Game Design

### World Dimensions
- Canvas: 800×480px
- World: 8000×1280px (250×40 tiles of 32px)
- `GROUND_ROW = 35` → `GROUND_Y = 35 * 32 = 1120px`
- Death trigger: `player.y > WORLD_H + 100`

### Physics
- Gravity: 900 (per-body, world gravity = 0)
- Player speed: 185px/s | Jump velocity: -560 | Double-jump: 2 jumps from ground
- Enemy extra gravity: +400 (to stay grounded on platforms)

### Scoring
| Item | Points |
|------|--------|
| Coin (gold) | 10 |
| Diamond (blue) | 50 |
| Potion (health) | heals 1 HP |
| Derila pillow | **500** |
| Chest | 200 |
| Enemy stomp | 100 |
| Enemy sword kill | 75 |

### Level 1 Layout — 7 Zones (11264px / 352 cols)
| Zone | Cols | Name | Theme |
|------|------|------|-------|
| 1 | 0–52 | The Shore | Tutorial, flat ground, easy crabbies |
| 2 | 58–108 | The Jungle Path | 2-high blocks, fierce enemies introduced |
| 3 | 114–165 | The Tidal Pools | Varied heights, first Pink Star, 4-high tower |
| 4 | 171–220 | The Ancient Ruins | L-shapes, tall towers, stepped structures |
| 5 | 226–275 | The Cliff Face | Ascending 2-high staircase |
| 6 | 281–325 | The Storm Ridge | Dense enemies, spikes on platforms, 3-high tower |
| 7 | 331–350 | The Lookout | Victory run, 5-high door tower |

**Water pits** (6 gaps between zones): cols 53-57, 109-113, 166-170, 221-225, 276-280, 326-330

**Key landmarks:**
- **Door/win:** col 349, row 27 — player overlaps door to complete the level
- **Chest:** col 347, row 28 (+200 pts)
- **Cannons:** 6 at water gaps (cols 58, 114, 171, 226, 281, 331 — all fire left) + 3 in-zone (cols 145, 208, 310)
- **Derila pillows:** 7 total (cols 36, 76, 142, 160, 201, 271, 308) — most on secret high platforms
- **Spikes:** 20 spike traps, progressive density
- **Secret platforms:** 5 hidden high alcoves with derila/diamonds (rows 17–24)

### Enemies (33 total in Level 1)
| Type | Speed | Health | Zones |
|------|-------|--------|-------|
| Crabby | 55px/s | 1 hit | 1, 2, 3, 5 (easiest zones) |
| Fierce Tooth | 75px/s | 2 hits | 2, 4, 5, 6, 7 |
| Pink Star | 65px/s | 3 hits | 3, 4, 5, 6 (hardest zones) |

**Enemy AI states:**
1. **Patrol** — walk back/forth in patrol range; edge detection prevents falling off platforms
2. **Chase** — player within 150px → move toward at 1.4× speed
3. **Attack** — player within 65px → play anticipation + attack animation, deal damage mid-swing
- Cooldown 1500ms between attacks; abandon chase if player beyond 350px

---

## Depth Ordering

| Depth | Element |
|-------|---------|
| -20 | Sky fill rectangle (scrollFactor 0) |
| -19 | `bg-main` tileSprite (scrollFactor 0) |
| -18 | Clouds (scrollFactor 0.06) |
| -5 | Back palm trees |
| -3 | Water pit fills |
| 0 | Terrain tiles (StaticGroup default) |
| 1 | Front palm tree tops |
| 8 | Cannonballs |
| 9 | Enemies + dust particles |
| 10 | Player sprite + sword hitbox |
| 100 | Floating score text |

---

## Menu Scene (Wood-and-Paper Style)
- **Main menu:** Animated background + clouds, title panel, player preview + **floating Derila pillows** (not coins), menu music
- **Three buttons:** PLAY (green, large), SETTINGS, HOW TO PLAY (smaller, side by side)
- **Settings overlay:** MUSIC and SFX toggle buttons — wired to `GameRegistry` (persist into game)
- **How to Play overlay:** Controls + collectible reference (includes Z = sword attack)
- **Color palette:** `0x2D1200` (dark wood), `0xC8860A` (gold border), `0x5C3A00` (button fill)
- Space/Enter starts game; ESC closes overlays

---

## Scene Communication
```javascript
// GameScene emits → UIScene listens
scene.events.emit('playerDamaged', health)   // health = 0–3
scene.events.emit('scoreUpdated', score)
scene.events.emit('coinCollected', count)
scene.events.emit('playerDied')

// GameScene → GameOverScene (via scene.start data)
{ win: boolean, score: number, coins: number }

// GameRegistry (any scene)
GameRegistry.get(this.game, 'musicOn')  // read
GameRegistry.set(this.game, 'sfxOn', false)  // write
```

---

## Asset Loading Patterns (PreloadScene)

```javascript
// loadFrames(keyPrefix, path, prefix, count, zeroPad=true)
// ALL sprite files use zeroPad=true (files named 01.png, 02.png …)
// EXCEPTION: cannon fire/explosion use zeroPad=false (1.png, 2.png …)

// Correct patterns:
this.loadFrames('player-idle',   playerBase + '01-Idle/',   'Idle ',   5);       // Idle 01.png
this.loadFrames('crabby-idle',   crabbyBase + '01-Idle/',   'Idle ',   9);       // Idle 01.png ← was broken (false), now fixed
this.loadFrames('player-attack1',swordBase  + '15-Attack 1/','Attack 1 ', 3);   // Attack 1 01.png
this.loadFrames('cannon-fire',   cannonBase + 'Cannon Fire/', '', 6, false);     // 1.png

// makeAnim MUST use { key: k, frame: 0 } for single-image textures in Phaser 3.87
makeAnim(key, frameKeys, frameRate, repeat) {
    const frames = frameKeys.map(k => ({ key: k, frame: 0 }));
    this.anims.create({ key, frames, frameRate, repeat });
}
```

**Known path quirks:**
- Dust particles: files directly in `Dust Particles/` folder (no subdirs)
- Pink Star attack: only 4 frames (not 5 like Fierce Tooth)
- Cannon fire/explosion: `zeroPad=false` (only exception to the rule)

---

## Phaser 3.87 Patterns
```javascript
// StaticGroup platform tiles (spritesheet frame)
this.platforms = this.physics.add.staticGroup();
this.platforms.create(x, y, 'terrain', 1); // frame 1 = grass-top

// Platform lookup set for O(1) edge detection
this._platformTileSet = new Set();
this.platforms.getChildren().forEach(t => {
    this._platformTileSet.add(`${Math.round(t.x/GAME.TILE)},${Math.round(t.y/GAME.TILE)}`);
});

// Cannonball overlap — register ONCE on the group, not per projectile
this.physics.add.overlap(this.allCannonballs, this.player.sprite, (ball) => {
    if (ball.active) { ball.destroy(); this.player.takeDamage(); }
});

// Sword hitbox overlap (registered in setupCollisions)
this.physics.add.overlap(
    this.player._fsm.swordHitbox, this.enemyGroup,
    (hitbox, enemySp) => { /* find enemy and call takeDamage */ }
);

// Enemy stomp detection
if (playerSp.body.velocity.y > 50 && playerFeet < enemyTop + 20) { /* stomp */ }

// Sound helper (respects sfxOn registry flag)
_playSound(key, volume = 0.6) {
    if (this.registry.get('sfxOn') && this.cache.audio.exists(key)) {
        this.sound.play(key, { volume });
    }
}
```

---

### UIHelper (`js/UIHelper.js`)
Reusable components for building pixel-art UI:
- `UIHelper.panel(scene, cx, cy, w, h, prefix)`: 9-slice container with tiling center/edges.
- `UIHelper.button(scene, cx, cy, w, h, label, prefix, onPress)`: Interactive button with hover/click effects.
- `UIHelper.banner(scene, cx, cy, w, text, fontSize)`: Horizontal scroll banner for titles.
- `UIHelper.toggle(scene, x, y, initialValue, onChange)`: Rounded-rect ON/OFF toggle. Returns `[graphics, label, zone]`.

#### Wood & Paper UI Sprite Layouts

**9-slice panels** (`Sprites/Green Board/`, `Sprites/Orange Paper/`, etc.) — 32×32px tiles, 9 frames:
```
0=TL  1=TC  2=TR
3=ML  4=MC  5=MR
6=BL  7=BC  8=BR
```
Frames 10–16 in source folder are hover/active/disabled state variants.

**Buttons** (`Sprites/Green Button/`, `Sprites/Yellow Button/`) — 14×14px tiles, 16 frames in source folder.
Only 3 source frames are used to build extensible buttons at any size:
- **8.png** = corner piece (rounded corner)
- **9.png** = edge piece (straight edge)
- **5.png** = center fill (solid)

All 4 corners are made by rotating/mirroring frame 8; all 4 edges from frame 9:
```
TL=f8           TC=f9           TR=f8 mirrorX
ML=f9 rot90ccw  MC=f5           MR=f9 rot90cw
BL=f8 rot90ccw  BC=f9 rot180    BR=f8 rot180
```

**Button spritesheet** (`ui-green-btn.png` / `ui-yellow-btn.png`) — 9-frame strip (126×14px):
- Generated from source frames with pre-applied rotations/mirrors
- Frame layout: `0=TL 1=TC 2=TR 3=ML 4=MC 5=MR 6=BL 7=BC 8=BR` (same as panels)
- To regenerate: use `gen-btn-sheets.html` or PIL script with `Image.transpose()` operations
- UIHelper renders small (14px) tiles at 2× scale (28px effective tile size)
- `cw <= 16` branch in `UIHelper.panel()` handles the scaling

**Banner** (`Sprites/Small Banner/`) — 32×32px tiles:
- Frame 1 = left cap, Frame 13 = center tile (tiled), Frame 2 = right cap
- Height renders at 48px (scale 1.5× the 32px source frames) for visible text

**Dev tool:** `test-ui.html` — visual component viewer showing all frames and assembled previews.

---

## Known Issues / TODOs
- [x] **Menu screen:** Floating Derila pillows around player preview (replaced coins)
- [x] **Derila pillows:** Level 1 now has 7 derila pillows (one per zone, most on secrets)
- [x] **Toggle consistency:** Both MenuScene and PauseScene use `UIHelper.toggle()` (rounded-rect style)
- [x] **Button spritesheets:** Proper 9-frame layout with corners, edges, and center (was broken 5-frame)
- [ ] `front-palm-bottom` (96×96 "Front Palm Bottom and Grass") renders as ugly blobs — excluded
- [ ] Mobile controls (sprites available in `Wood and Paper UI/Sprites/Mobile Buttons/`)
- [ ] Sword idle/run/jump animations unused (player reverts to no-sword sprites between attacks)
- [ ] Enemy `11-Attack Effect` sprites unused (could add hit sparks)
- [ ] Dialogue bubbles (`Exclamation`, `Interrogation`) unused — could show on enemy state change
- [ ] `music_3.mp3` and `music_4.mp3` loaded but not assigned to any scene
