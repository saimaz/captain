// ============================================================
// LevelSelectScene.js — 3-card level selection screen
// ============================================================

class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create() {
        const W = this.scale.width;   // 800
        const H = this.scale.height;  // 480

        // ── Background ─────────────────────────────────────────────
        this.add.rectangle(0, 0, W, H, 0x0a1428, 1).setOrigin(0, 0);

        this.bg = this.add.tileSprite(0, 0, W, H, 'bg-main').setOrigin(0, 0).setAlpha(0.5);
        const bgTex = this.textures.get('bg-main').getSourceImage();
        if (bgTex && bgTex.height > 0) {
            const s = H / bgTex.height;
            this.bg.setScale(s, s);
        }

        // ── Title ──────────────────────────────────────────────────
        UIHelper.banner(this, W / 2, 48, 380, 'SELECT LEVEL', '20px');

        // ── Level cards ────────────────────────────────────────────
        const maxLevel  = this.registry.get('maxLevel') || 1;
        const levelDefs = [
            { num: 1, name: 'THE BEACH',      sub: 'Jungle & Shore',  color: 0x3A7A2A, difficulty: 1 },
            { num: 2, name: 'PIRATE SHIP',    sub: 'Ship Interior',   color: 0x4A2A1A, difficulty: 2 },
            { num: 3, name: 'OCEAN CROSSING', sub: 'Moving Ships',    color: 0x1A3A5C, difficulty: 3 },
        ];

        const cardXs = [135, 400, 665];
        const cardW  = 200;
        const cardH  = 260;
        const cardY  = H / 2 + 20;

        levelDefs.forEach((def, i) => {
            const locked = def.num > maxLevel;
            this._makeCard(cardXs[i], cardY, cardW, cardH, def, locked);
        });

        // ── Back button ────────────────────────────────────────────
        UIHelper.button(this, W / 2, H - 32, 140, 32, 'BACK', 'ui-yellow-btn', () => {
            this.scene.start('MenuScene');
        });

        this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
    }

    _makeCard(cx, cy, cardW, cardH, def, locked) {
        // Card background
        const bg = this.add.graphics();
        bg.fillStyle(locked ? 0x1a1a2e : def.color, locked ? 0.5 : 0.9);
        bg.fillRoundedRect(cx - cardW/2, cy - cardH/2, cardW, cardH, 12);
        bg.lineStyle(2, locked ? 0x444466 : 0xC8860A, 1);
        bg.strokeRoundedRect(cx - cardW/2, cy - cardH/2, cardW, cardH, 12);

        // Color strip (top)
        const stripH = 80;
        const strip = this.add.graphics();
        strip.fillStyle(locked ? 0x222244 : def.color, locked ? 0.3 : 1.0);
        strip.fillRoundedRect(
            cx - cardW/2 + 4, cy - cardH/2 + 4, cardW - 8, stripH,
            { tl: 10, tr: 10, bl: 0, br: 0 }
        );

        // Level number
        this.add.text(cx, cy - cardH/2 + stripH/2 + 4, def.num.toString(), {
            fontSize: '40px', color: locked ? '#555577' : '#F5D76E',
            fontFamily: '"Arial Black", Arial',
            stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5);

        // Level name
        this.add.text(cx, cy - cardH/2 + stripH + 22, def.name, {
            fontSize: '13px', color: locked ? '#555566' : '#F5D76E',
            fontFamily: '"Arial Black", Arial',
            stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(cx, cy - cardH/2 + stripH + 44, def.sub, {
            fontSize: '11px', color: locked ? '#444455' : '#D4A870',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        // Difficulty stars
        const starY = cy - cardH/2 + stripH + 74;
        for (let s = 0; s < 3; s++) {
            const filled = s < def.difficulty && !locked;
            this.add.text(cx - 22 + s * 22, starY, filled ? '\u2605' : '\u2606', {
                fontSize: '18px',
                color: filled ? '#FFD700' : (locked ? '#333344' : '#886600'),
            }).setOrigin(0.5);
        }

        if (locked) {
            // Lock overlay
            const lockBg = this.add.graphics();
            lockBg.fillStyle(0x000000, 0.55);
            lockBg.fillRoundedRect(cx - cardW/2, cy - cardH/2, cardW, cardH, 12);

            this.add.text(cx, cy + 10, '\uD83D\uDD12', { fontSize: '28px' }).setOrigin(0.5);
            this.add.text(cx, cy + 50, 'Complete prev\nlevel to unlock', {
                fontSize: '10px', color: '#8888AA',
                fontFamily: 'Arial', align: 'center',
            }).setOrigin(0.5);
        } else {
            // PLAY button inside card
            UIHelper.button(this, cx, cy + cardH/2 - 28, 140, 34, 'PLAY', 'ui-green-btn', () => {
                this.registry.set('level', def.num);
                this.registry.set('health', GAME.PLAYER.HEALTH);
                this.registry.set('score', 0);
                this.registry.set('coins', 0);
                this.scene.start('GameScene');
            });
        }
    }

    update() {
        if (this.bg) this.bg.tilePositionX += 0.3;
    }
}
