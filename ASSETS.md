# Captain ORBIO Adventure — Asset Reference

This document provides a comprehensive list of all graphical and audio assets available in the `asset/` and `sound/` folders. It is designed to help LLMs and developers understand how to use, animate, and reference these assets.

---

## 1. Player: Captain Clown Nose

The player character has two main sprite sets: with a sword and without. All sprites are **64x40px** per frame.

### Without Sword (Base Movement)
- **Folder:** `asset/Captain Clown Nose/Sprites/Captain Clown Nose/Captain Clown Nose without Sword/`
- **Animations:**
  - `01-Idle/`: 5 frames ("Idle 01.png" - "Idle 05.png")
  - `02-Run/`: 6 frames ("Run 01.png" - "Run 06.png")
  - `03-Jump/`: 3 frames ("Jump 01.png" - "Jump 03.png")
  - `04-Fall/`: 1 frame ("Fall 01.png")
  - `05-Ground/`: 2 frames ("Ground 01.png" - "Ground 02.png")
  - `06-Hit/`: 4 frames ("Hit 01.png" - "Hit 04.png")
  - `07-Dead Hit/`: 4 frames ("Dead Hit 01.png" - "Dead Hit 04.png")
  - `08-Dead Ground/`: 4 frames ("Dead Ground 01.png" - "Dead Ground 04.png")

### With Sword (Combat)
- **Folder:** `asset/Captain Clown Nose/Sprites/Captain Clown Nose/Captain Clown Nose with Sword/`
- **Animations:**
  - `15-Attack 1/`: 3 frames ("Attack 1 01.png" - "Attack 1 03.png")
  - `16-Attack 2/`: 3 frames ("Attack 2 01.png" - "Attack 2 03.png")
  - `17-Attack 3/`: 3 frames ("Attack 3 01.png" - "Attack 3 03.png")
  - `18-Air Attack 1/`: 3 frames ("Air Attack 1 01.png" - "Air Attack 1 03.png")
  - `19-Air Attack 2/`: 3 frames ("Air Attack 2 01.png" - "Air Attack 2 03.png")
  - *Note: Other folders like 09-Idle, 10-Run, 11-Jump, 12-Fall, 13-Ground, 14-Hit also exist for the "with sword" set but are currently unused.*

### Dialogue Bubbles
- **Folder:** `asset/Captain Clown Nose/Sprites/Dialogue/`
- **Animations:** `Dead/`, `Exclamation/`, `Interrogation/` (2 frames each: 1.png, 2.png)

### Dust Particles
- **Folder:** `asset/Captain Clown Nose/Sprites/Dust Particles/`
- **Animations:**
  - `Jump 01.png` - `Jump 06.png`: 6 frames
  - `Run 01.png` - `Run 05.png`: 5 frames
  - `Fall 01.png` - `Fall 05.png`: 5 frames

---

## 2. The Crusty Crew (Enemies)

All enemies have similar state folders and use zero-padded naming (e.g., `Idle 01.png`).

### Crabby
- **Folder:** `asset/The Crusty Crew/Sprites/Crabby/`
- **Stats:** 1 Hit to kill, 55px/s speed.
- **Animations:**
  - `01-Idle/`: 9 frames
  - `02-Run/`: 6 frames
  - `06-Anticipation/`: 3 frames
  - `07-Attack/`: 4 frames
  - `08-Hit/`: 4 frames
  - `09-Dead Hit/`: 4 frames
  - `10-Dead Ground/`: 4 frames

### Fierce Tooth
- **Folder:** `asset/The Crusty Crew/Sprites/Fierce Tooth/`
- **Stats:** 2 Hits to kill, 75px/s speed.
- **Animations:**
  - `01-Idle/`: 8 frames
  - `02-Run/`: 6 frames
  - `06-Anticipation/`: 3 frames
  - `07-Attack/`: 5 frames
  - `08-Hit/`: 4 frames
  - `09-Dead Hit/`: 4 frames
  - `10-Dead Ground/`: 4 frames

### Pink Star
- **Folder:** `asset/The Crusty Crew/Sprites/Pink Star/`
- **Stats:** 3 Hits to kill, 65px/s speed.
- **Animations:**
  - `01-Idle/`: 8 frames
  - `02-Run/`: 6 frames
  - `06-Anticipation/`: 3 frames
  - `07-Attack/`: 4 frames
  - `08-Hit/`: 4 frames
  - `09-Dead Hit/`: 4 frames
  - `10-Dead Ground/`: 4 frames

---

## 3. Collectibles & Treasure

### Pirate Treasure
- **Folder:** `asset/Pirate Treasure/Sprites/`
- **Active in game:**
  - `Gold Coin/`: 4 frames (used as `coin`)
  - `Blue Diamond/`: 4 frames (used as `diamond`)
  - `Red Potion/`: 7 frames (used as `potion`)
  - `Golden Skull/`: 8 frames (used as `skull`)
- **Unused but available:**
  - `Silver Coin/`, `Green Bottle/`, `Green Diamond/`, `Red Diamond/`
  - `Big Map/`, `Small Maps/`
  - Collection effects (e.g., `Coin Effect/`, `Diamond Effect/`)

### Derila Pillow (Special)
- **Images:** `derila.png`, `derila-game.png` (used in level), `derila-preview.png` (used in UI)
- **Score:** 500 points.

---

## 4. Environment & Traps

### Palm Tree Island (Level 1)
- **Tileset:** `asset/Palm Tree Island/Sprites/Terrain/Terrain (32x32).png` (85 tiles, 17x5 grid)
- **Backgrounds:** `BG Image.png`, `Additional Sky.png`, `Additional Water.png`, `Big Clouds.png`, `Small Cloud 1, 2, 3.png`
- **Objects:**
  - `Spikes/Spikes.png` (single image)
  - `Chest/`: 10 frames each for `Chest Close` and `Chest Open`
  - `Flag/`: 9 frames for `Flag`, single image for `Platform.png`
  - `Back Palm Trees/`: 4 frames for `Left`, `Regular`, `Right`
  - `Front Palm Trees/`: 4 frames for `Top`, `Bottom` (96x96, currently avoided as it's messy)

### Shooter Traps
- **Folder:** `asset/Shooter Traps/Sprites/`
- **Cannon:**
  - `Cannon Idle/1.png`
  - `Cannon Fire/`: 6 frames (1.png - 6.png)
  - `Cannon Ball Idle/1.png`
  - `Cannon Ball Explosion/`: 7 frames (1.png - 7.png)
- **Unused:** `Seashell/`, `Totems/` (potential new enemies/traps)

### Pirate Ship (Level 2)
- **Tilesets:** `Terrain and Back Wall (32x32).png`, `Platforms (32x32).png`
- **Decorations:**
  - `Door/`: 5 frames for `Opening`, 5 frames for `Closing`
  - `Chains/`: 8 frames for `Big`, 8 frames for `Small`
  - `Candle/`: 6 frames
  - `Barrels and Bottles/`, `Window/` (unused)

### Merchant Ship (Level 3)
- **Folder:** `asset/Merchant Ship/Sprites/`
- **Active in game:**
  - `Ship/Anchor/`: 2 frames
  - `Ship/Sail/Wind/`: 4 frames
  - `Water/Water Splash 1/`: 5 frames
- **Unused:** `Barrel/`, `Box/`, `Chest/`, `Chest Key/`, `Ship/Sail/Idle/`, `Ship/Sail/No Wind/`, `Water/Reflexes/`, `Water/Water Splash 2/`

---

## 5. UI Elements

### Wood and Paper UI
- **Folder:** `asset/Wood and Paper UI/Sprites/`
- **Panels & Boards (9-Slice parts 1-16):**
  - `Green Board/`, `Yellow Board/`, `Orange Paper/`, `Yellow Paper/`
- **Buttons (9-Slice parts 1-16):**
  - `Green Button/`, `Yellow Button/`
- **Banners:**
  - `Small Banner/`: 13 parts (1-13)
  - `Big Banner/`: (available)
- **Health/Life Bars:**
  - `Life Bars/Small Bars/`: 5 frames (1.png - 5.png)
- **Misc:** `Mobile Buttons/`, `Inventory/`, `Sliders/`, `Big Text/`, `Small Text/`

---

## 6. Audio

- **Folder:** `sound/`
- **SFX:**
  - `jump.mp3`: Player jump
  - `fight.mp3`: Sword attack
  - `fitght_hit.mp3`: Damage/hit
- **Music:**
  - `music_1.mp3`: In-game (active)
  - `music_2.mp3`: Menu (active)
  - `music_3.mp3`: Alternative (unused)
  - `music_4.mp3`: Alternative (unused)
