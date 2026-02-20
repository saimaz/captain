// ============================================================
// GameScene.js — Main game scene (orchestration only)
// Depends on: constants.js, GameRegistry.js, GameLevelRegistry.js,
//             PlayerStateMachine.js, Player.js, Enemy.js, ShooterTrap.js
// ============================================================
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player           = null;
        this.enemyList        = [];
        this.enemyGroup       = null;
        this.trapList         = [];
        this.platforms        = null;
        this._movingPlatforms = [];
        this.winTriggered     = false;
        this.chestOpened      = false;
        this._music           = null;
        this._paused          = false;
        this._levelData       = null;
    }

    create() {
        // 1x1 white texture used for hitboxes
        const g = this.make.graphics({ add: false });
        g.fillStyle(0xffffff, 1);
        g.fillRect(0, 0, 1, 1);
        g.generateTexture('block', 1, 1);
        g.destroy();

        const levelNum  = this.registry.get('level') || 1;
        this._levelData = GameLevelRegistry[levelNum] || GameLevelRegistry[1];
        const LD        = this._levelData;

        this.physics.world.setBounds(0, 0, LD.worldW, LD.worldH);
        this.physics.world.gravity.y = 0;
        this.cameras.main.setBounds(0, 0, LD.worldW, LD.worldH);

        this.createBackground();
        this.createLevel();
        this.createPlayer();
        this.createEnemies();
        this.createCollectibles();
        this.createTraps();
        this.createGoals();
        this.setupCollisions();

        this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12, 0, 90);

        this.scene.launch('UIScene');
        this.time.delayedCall(50, () => {
            this.events.emit('playerDamaged', GAME.PLAYER.HEALTH);
            this.events.emit('scoreUpdated',  0);
            this.events.emit('coinCollected', 0);
        });

        this.setupEvents();
        this.winTriggered = false;
        this._paused      = false;

        this.input.keyboard.on('keydown-ESC', () => {
            if (this._paused || !this.player || this.player.isDead || this.winTriggered) return;
            this._paused = true;
            this.scene.launch('PauseScene');
            this.scene.pause();
        });

        this._startMusic();
    }

    // ──────────────────────────────────────────────────────────
    // Sound
    // ──────────────────────────────────────────────────────────
    _playSound(key, volume = 0.6) {
        if (this.registry.get('sfxOn') && this.cache.audio.exists(key)) {
            this.sound.play(key, { volume });
        }
    }

    _startMusic() {
        if (!this.registry.get('musicOn')) return;
        const key = (this._levelData && this._levelData.visual && this._levelData.visual.musicKey)
            ? this._levelData.visual.musicKey
            : 'music-game';
        if (!this.cache.audio.exists(key)) return;
        if (this._music) { this._music.stop(); this._music.destroy(); }
        this._music = this.sound.add(key, { loop: true, volume: 0.35 });
        this._music.play();
    }

    _stopMusic() {
        if (this._music) { this._music.stop(); this._music.destroy(); this._music = null; }
    }

    // ──────────────────────────────────────────────────────────
    // Background
    // ──────────────────────────────────────────────────────────
    createBackground() {
        const W  = GAME.CANVAS_W, H = GAME.CANVAS_H;
        const LD = this._levelData;
        const V  = LD.visual;
        const groundY = LD.groundRow * GAME.TILE;

        this.add.rectangle(W/2, H/2, W, H, V.skyColor).setScrollFactor(0).setDepth(-20);

        this.bgLayer = null;
        if (V.bgKey) {
            this.bgLayer = this.add.tileSprite(W/2, H/2, W, H, V.bgKey)
                .setScrollFactor(0).setDepth(-19);
            if (V.bgScaleToHeight) {
                const bgTex = this.textures.get(V.bgKey).getSourceImage();
                if (bgTex && bgTex.height > 0) {
                    const s = H / bgTex.height;
                    this.bgLayer.setScale(s, s);
                }
            }
        }

        if (V.ambientOverlay) {
            this.add.rectangle(W/2, H/2, W, H, V.ambientOverlay.color, V.ambientOverlay.alpha)
                .setScrollFactor(0).setDepth(-17);
        }

        if (V.hasClouds && V.cloudPositions && V.cloudPositions.length > 0) {
            const cloudKeys = ['cloud-1', 'cloud-2', 'cloud-3', 'cloud-big'];
            V.cloudPositions.forEach(([wx, wy, ki]) => {
                this.add.image(wx, wy, cloudKeys[ki]).setScrollFactor(0.06).setDepth(-18).setScale(1.2);
            });
        }

        if (V.hasWaterPits && LD.waterPits && LD.waterPits.length > 0) {
            LD.waterPits.forEach(([x1, x2]) => {
                const midX = (x1 + x2) / 2;
                const w    = x2 - x1;
                this.add.rectangle(midX, groundY + 16,  w, 32,  V.waterTopColor || 0x5CD8E8).setDepth(-3);
                this.add.rectangle(midX, groundY + 200, w, 400, V.waterColor    || 0x2BB5C8).setDepth(-3);
            });
        }

        if (V.hasBackPalms && LD.backPalms && LD.backPalms.length > 0) {
            const palmVariants = ['back-palm-left', 'back-palm-regular', 'back-palm-right'];
            LD.backPalms.forEach(([wx, vi, sc]) => {
                const key  = palmVariants[vi];
                const palm = this.add.sprite(wx, groundY - 10, key + '-1')
                    .setScale(sc).setDepth(-5).setOrigin(0.5, 1);
                if (this.anims.exists(key)) palm.play(key);
            });
        }

        if (LD.decorations && LD.decorations.length > 0) {
            LD.decorations.forEach(dec => {
                let obj;
                if (dec.animKey) {
                    obj = this.add.sprite(dec.worldX, dec.worldY, dec.key + '-1');
                    if (this.anims.exists(dec.animKey)) obj.play(dec.animKey);
                } else {
                    obj = this.add.image(dec.worldX, dec.worldY, dec.key);
                }
                obj.setScale(dec.scale || 1).setDepth(dec.depth || 0);
                if (dec.flipX)  obj.setFlipX(true);
                if (dec.origin) obj.setOrigin(dec.origin[0], dec.origin[1]);
            });
        }

        if (V.borderFrame) this._drawBorderFrame();
    }

    _drawBorderFrame() {
        const W = GAME.CANVAS_W, H = GAME.CANVAS_H, T = 48, C = 0x120A00;
        [
            [W/2,   T/2,   W, T],
            [W/2,   H-T/2, W, T],
            [T/2,   H/2,   T, H],
            [W-T/2, H/2,   T, H],
        ].forEach(([x, y, w, h]) =>
            this.add.rectangle(x, y, w, h, C).setScrollFactor(0).setDepth(-10)
        );
    }

    // ──────────────────────────────────────────────────────────
    // Level
    // ──────────────────────────────────────────────────────────
    _tile(col, row, frame = 1, texKey = 'terrain') {
        const x = col * GAME.TILE + GAME.TILE / 2;
        const y = row * GAME.TILE + GAME.TILE / 2;
        return this.platforms.create(x, y, texKey, frame);
    }

    _tileRow(startCol, row, count, frame = 1) {
        for (let c = 0; c < count; c++) this._tile(startCol + c, row, frame);
    }

    _tileRowKey(startCol, row, count, frame = 1, texKey = 'terrain') {
        for (let c = 0; c < count; c++) this._tile(startCol + c, row, frame, texKey);
    }

    createLevel() {
        const LD        = this._levelData;
        const groundRow = LD.groundRow;
        const groundKey = LD.groundTerrainKey || 'terrain';
        const topFrame  = LD.groundTopFrame  ?? 1;
        const fillFrame = LD.groundFillFrame ?? 7;

        this.platforms = this.physics.add.staticGroup();

        LD.ground.forEach(([col, w]) => {
            this._tileRowKey(col, groundRow,     w, topFrame,  groundKey);
            this._tileRowKey(col, groundRow + 1, w, fillFrame, groundKey);
        });

        LD.platforms.forEach(([col, row, w, key, fr]) => {
            this._tileRowKey(col, row, w, fr ?? 1, key || groundKey);
        });

        this._movingPlatforms = [];
        if (LD.movingPlatforms) {
            LD.movingPlatforms.forEach(mp => {
                const tiles = [];
                for (let i = 0; i < mp.width; i++) {
                    const t = this.physics.add.staticImage(
                        mp.col * GAME.TILE + i * GAME.TILE + 16,
                        mp.row * GAME.TILE + 16,
                        mp.terrainKey || groundKey
                    ).setFrame(mp.frame ?? 1);
                    this.platforms.add(t);
                    tiles.push(t);
                }
                this._movingPlatforms.push({
                    tiles,
                    rangeMin: mp.rangeMin,
                    rangeMax: mp.rangeMax,
                    speed:    mp.speed,
                    _pos:     mp.col * GAME.TILE,
                    _vel:     mp.speed,
                });
            });
        }

        this._platformTileSet = new Set();
        this.platforms.getChildren().forEach(tile => {
            const tx = Math.round(tile.x / GAME.TILE);
            const ty = Math.round(tile.y / GAME.TILE);
            this._platformTileSet.add(`${tx},${ty}`);
        });

        if (LD.frontPalms) {
            LD.frontPalms.forEach(([col, row]) => {
                const bx  = col * GAME.TILE + GAME.TILE / 2;
                const by  = row * GAME.TILE - 4;
                const top = this.add.sprite(bx, by, 'front-palm-top-1')
                    .setScale(2.2).setDepth(1).setOrigin(0.5, 1);
                if (this.anims.exists('front-palm-top')) top.play('front-palm-top');
            });
        }
    }

    // ──────────────────────────────────────────────────────────
    // Player
    // ──────────────────────────────────────────────────────────
    createPlayer() {
        const LD     = this._levelData;
        const start  = LD.playerStart || { col: 5, row: LD.groundRow - 1 };
        const startX = start.col * GAME.TILE + 16;
        const startY = start.row * GAME.TILE - 16;
        this.player  = new Player(this, startX, startY);
    }

    // ──────────────────────────────────────────────────────────
    // Enemies
    // ──────────────────────────────────────────────────────────
    createEnemies() {
        this.enemyList  = [];
        this.enemyGroup = this.physics.add.group();

        this._levelData.enemies.forEach(([col, row, type, range]) => {
            const e = new Enemy(this, col * GAME.TILE + 16, row * GAME.TILE, type, range);
            this.enemyList.push(e);
            this.enemyGroup.add(e.sprite);
        });
    }

    // ──────────────────────────────────────────────────────────
    // Collectibles
    // ──────────────────────────────────────────────────────────
    createCollectibles() {
        const LD = this._levelData;
        this.coins    = this.physics.add.staticGroup();
        this.diamonds = this.physics.add.staticGroup();
        this.derila   = this.physics.add.staticGroup();
        this.matsato  = this.physics.add.staticGroup();
        this.sinoshi  = this.physics.add.staticGroup();
        this.ryoko    = this.physics.add.staticGroup();
        this.potions  = this.physics.add.staticGroup();

        LD.coinArcs.forEach(([startCol, platRow, count, spacing]) => {
            for (let i = 0; i < count; i++) {
                const col = startCol + i * spacing;
                const c   = this.coins.create(col * GAME.TILE + 16, (platRow - 1) * GAME.TILE + 8, 'coin-1');
                c.setSize(12, 12).refreshBody();
                c.play('coin-spin');
            }
        });

        LD.diamonds.forEach(([col, row]) => {
            const d = this.diamonds.create(col * GAME.TILE + 16, row * GAME.TILE + 8, 'diamond-1');
            d.setSize(12, 12).refreshBody();
            d.play('diamond-spin');
        });

        LD.derila.forEach(([col, row]) => {
            const p = this.derila.create(col * GAME.TILE + 16, row * GAME.TILE, 'derila');
            p.setScale(0.7);
            p.setSize(28, 36).refreshBody();
            this.tweens.add({ targets: p, y: p.y - 8, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        });

        (LD.matsato || []).forEach(([col, row]) => {
            const k = this.matsato.create(col * GAME.TILE + 16, row * GAME.TILE, 'matsato');
            k.setScale(0.8);
            k.setSize(28, 14).refreshBody();
            this.tweens.add({ targets: k, y: k.y - 6, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        });

        (LD.sinoshi || []).forEach(([col, row]) => {
            const s = this.sinoshi.create(col * GAME.TILE + 16, row * GAME.TILE, 'sinoshi');
            s.setScale(0.8);
            s.setSize(20, 28).refreshBody();
            this.tweens.add({ targets: s, y: s.y - 6, duration: 1050, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        });

        (LD.ryoko || []).forEach(([col, row]) => {
            const r = this.ryoko.create(col * GAME.TILE + 16, row * GAME.TILE, 'ryoko');
            r.setScale(0.8);
            r.setSize(22, 28).refreshBody();
            this.tweens.add({ targets: r, y: r.y - 6, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        });

        LD.potions.forEach(([col, row]) => {
            const pot = this.potions.create(col * GAME.TILE + 16, row * GAME.TILE + 8, 'potion-1');
            pot.setSize(12, 20).refreshBody();
            pot.play('potion-idle');
        });
    }

    // ──────────────────────────────────────────────────────────
    // Traps
    // ──────────────────────────────────────────────────────────
    createTraps() {
        const LD = this._levelData;
        this.spikes         = this.physics.add.staticGroup();
        this.cannons        = [];
        this.allCannonballs = this.physics.add.group();

        LD.spikes.forEach(([col, row]) => {
            const s = this.spikes.create(col * GAME.TILE + 16, row * GAME.TILE + 12, 'spikes');
            s.setSize(28, 14).setOffset(2, 10).refreshBody();
        });

        this.trapList = [];
        if (LD.traps) {
            LD.traps.forEach(([col, row, type, dir]) => {
                this.trapList.push(new ShooterTrap(this, col, row, type, dir));
            });
        }

        LD.cannons.forEach(([col, row, dir]) => {
            const cx = col * GAME.TILE + 16;
            const cy = row * GAME.TILE - 13;

            const sprite = this.physics.add.staticImage(cx, cy, 'cannon-idle');
            if (dir === 'right') sprite.setFlipX(true);
            this.cannons.push({ sprite, dir, cx, cy });

            const delay = 2800 + Math.random() * 2500;
            this.time.addEvent({
                delay, loop: true, startAt: Math.random() * delay,
                callback: () => {
                    if (!this.player || this.player.isDead) return;
                    const ball = this.physics.add.image(cx, cy, 'cannonball');
                    ball.body.allowGravity = false;
                    ball.setVelocityX(dir === 'left' ? -220 : 220);
                    ball.setDepth(8);
                    this.allCannonballs.add(ball);
                    this.time.delayedCall(3200, () => { if (ball.active) ball.destroy(); });
                }
            });
        });
    }

    // ──────────────────────────────────────────────────────────
    // Goals
    // ──────────────────────────────────────────────────────────
    createGoals() {
        const LD = this._levelData;
        const { chestCol, chestRow, doorCol, doorRow } = LD;

        this.chest = this.physics.add.staticSprite(
            chestCol * GAME.TILE + 16, chestRow * GAME.TILE - 12, 'chest-close-1'
        );
        this.chest.play('chest-closed');
        this.chest.setSize(28, 24).refreshBody();
        this.chestOpened = false;

        const dx = doorCol * GAME.TILE + 16;
        const dy = (doorRow + 1) * GAME.TILE;
        this.door = this.physics.add.staticSprite(dx, dy, 'door-close-1').setOrigin(0.5, 1).setDepth(2);
        if (this.anims.exists('door-close')) this.door.play('door-close');
        this.door.setSize(28, 48).refreshBody();
    }

    // ──────────────────────────────────────────────────────────
    // Collisions
    // ──────────────────────────────────────────────────────────
    setupCollisions() {
        this.physics.add.collider(this.player.sprite, this.platforms);

        this.enemyList.forEach(enemy => {
            this.physics.add.collider(enemy.sprite, this.platforms);

            this.physics.add.overlap(this.player.sprite, enemy.sprite, (playerSp, enemySp) => {
                if (enemy.isDead) return;
                const playerFeet = playerSp.body.bottom;
                const enemyTop   = enemySp.body.top;
                if (playerSp.body.velocity.y > 50 && playerFeet < enemyTop + 20) {
                    enemy.stomp(this.player);
                } else {
                    this.player.takeDamage();
                }
            });
        });

        this.physics.add.overlap(
            this.player._fsm.swordHitbox, this.enemyGroup,
            (hitbox, enemySp) => {
                if (!this.player._fsm.isAttacking()) return;
                const enemy = this.enemyList.find(e => e.sprite === enemySp);
                if (enemy && !enemy.isDead) enemy.takeDamage(1, this.player);
            }
        );

        this.trapList.forEach(trap => {
            this.physics.add.overlap(
                this.player._fsm.swordHitbox, trap.sprite,
                () => {
                    if (this.player._fsm.isAttacking() && !trap.isDead) {
                        trap.takeDamage();
                        this.player.collectItem(GAME.POINTS.SWORD);
                    }
                }
            );
        });

        this.physics.add.overlap(this.player.sprite, this.spikes, () => {
            this.player.takeDamage();
        });

        this.physics.add.overlap(this.allCannonballs, this.player.sprite, (ball) => {
            if (ball.active) { ball.destroy(); this.player.takeDamage(); }
        });

        this.physics.add.overlap(this.player.sprite, this.coins, (_, coin) => {
            coin.destroy();
            this.player.collectItem(GAME.POINTS.COIN);
            this.player.coins++;
            this.events.emit('coinCollected', this.player.coins);
            this.showFloatingText(coin.x, coin.y, '+' + GAME.POINTS.COIN, '#FFD700');
        });

        this.physics.add.overlap(this.player.sprite, this.diamonds, (_, diamond) => {
            diamond.destroy();
            this.player.collectItem(GAME.POINTS.DIAMOND);
            this.showFloatingText(diamond.x, diamond.y, '+' + GAME.POINTS.DIAMOND, '#00BFFF');
        });

        this.physics.add.overlap(this.player.sprite, this.derila, (_, pillow) => {
            pillow.destroy();
            this.player.collectItem(GAME.POINTS.DERILA);
            this.showFloatingText(pillow.x, pillow.y, '+500 derila', '#FF69B4');
        });

        this.physics.add.overlap(this.player.sprite, this.matsato, (_, knife) => {
            knife.destroy();
            this.player.collectItem(GAME.POINTS.MATSATO);
            this.showFloatingText(knife.x, knife.y, '+250 matsato', '#C0A060');
        });

        this.physics.add.overlap(this.player.sprite, this.sinoshi, (_, item) => {
            item.destroy();
            this.player.collectItem(GAME.POINTS.SINOSHI);
            this.showFloatingText(item.x, item.y, '+250 sinoshi', '#80C0E0');
        });

        this.physics.add.overlap(this.player.sprite, this.ryoko, (_, item) => {
            item.destroy();
            this.player.collectItem(GAME.POINTS.RYOKO);
            this.showFloatingText(item.x, item.y, '+250 ryoko', '#A0D080');
        });

        this.physics.add.overlap(this.player.sprite, this.potions, (_, potion) => {
            potion.destroy();
            this.player.heal();
            this.showFloatingText(potion.x, potion.y, '+LIFE', '#FF4444');
        });

        this.physics.add.overlap(this.player.sprite, this.chest, () => {
            if (!this.chestOpened) {
                this.chestOpened = true;
                this.chest.play('chest-opening');
                this.player.collectItem(GAME.POINTS.CHEST);
                this.showFloatingText(this.chest.x, this.chest.y - 30, '+' + GAME.POINTS.CHEST + '!', '#FFD700');
            }
        });

        this.physics.add.overlap(this.player.sprite, this.door, () => {
            if (!this.winTriggered) {
                this.winTriggered = true;
                if (this.anims.exists('door-open')) this.door.play('door-open');
                this.time.delayedCall(500, () => this.triggerWin());
            }
        });
    }

    // ──────────────────────────────────────────────────────────
    // Floating score text
    // ──────────────────────────────────────────────────────────
    showFloatingText(x, y, text, color = '#ffffff') {
        const t = this.add.text(x, y - 20, text, {
            fontSize: '14px', color,
            fontFamily: 'Arial Black, Arial',
            stroke: '#000000', strokeThickness: 3
        }).setDepth(100);

        this.tweens.add({
            targets: t, y: y - 60, alpha: 0, duration: 1000, ease: 'Power2',
            onComplete: () => t.destroy()
        });
    }

    // ──────────────────────────────────────────────────────────
    // Win
    // ──────────────────────────────────────────────────────────
    triggerWin() {
        this.player.sprite.setVelocityX(0);
        this.time.delayedCall(600, () => {
            this._stopMusic();
            this.scene.stop('UIScene');
            this.scene.start('GameOverScene', {
                win: true, score: this.player.score, coins: this.player.coins
            });
        });
    }

    // ──────────────────────────────────────────────────────────
    // Events
    // ──────────────────────────────────────────────────────────
    setupEvents() {
        this.events.on('playerDied', () => {
            this._stopMusic();
            this.time.delayedCall(500, () => {
                this.scene.stop('UIScene');
                this.scene.start('GameOverScene', {
                    win: false, score: this.player.score, coins: this.player.coins
                });
            });
        });

        this.events.on('playerDamaged', (health) => {
            const uiScene = this.scene.get('UIScene');
            if (uiScene) uiScene.events.emit('healthChanged', health);
        });

        this.events.on('scoreUpdated', (score) => {
            const uiScene = this.scene.get('UIScene');
            if (uiScene) uiScene.events.emit('scoreChanged', score);
        });

        this.events.on('coinCollected', (count) => {
            const uiScene = this.scene.get('UIScene');
            if (uiScene) uiScene.events.emit('coinCountChanged', count);
        });
    }

    // ──────────────────────────────────────────────────────────
    // Update loop
    // ──────────────────────────────────────────────────────────
    update(time, delta) {
        if (!this.player) return;

        this.player.update(delta);

        const worldH = this._levelData ? this._levelData.worldH : GAME.WORLD_H;
        if (this.player.sprite.y > worldH + 100 && !this.player.isDead) {
            this.player.isDead = true;
            this.events.emit('playerDied');
        }

        this.enemyList.forEach(e => {
            if (!e.isDead) e.update(delta, this.player.sprite);
        });

        if (this._movingPlatforms && this._movingPlatforms.length > 0) {
            this._movingPlatforms.forEach(mp => {
                mp._pos += mp._vel * (delta / 1000);
                if (mp._pos >= mp.rangeMax || mp._pos <= mp.rangeMin) {
                    mp._vel *= -1;
                    mp._pos = Phaser.Math.Clamp(mp._pos, mp.rangeMin, mp.rangeMax);
                }
                mp.tiles.forEach((tile, i) => {
                    tile.body.reset(mp._pos + i * GAME.TILE + 16, tile.y);
                });
            });
        }

        if (this.bgLayer) {
            const scrollRate = (this._levelData && this._levelData.visual)
                ? (this._levelData.visual.bgScrollRate || 0.2)
                : 0.2;
            this.bgLayer.tilePositionX = this.cameras.main.scrollX * scrollRate;
        }
    }

    shutdown() {
        this._stopMusic();
    }
}
