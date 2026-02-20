class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this._overlay = null;
        this._music   = null;
    }

    get _musicOn() { return this.game.registry.get('musicOn'); }
    get _sfxOn()   { return this.game.registry.get('sfxOn');   }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        // ── Animated background ───────────────────────────────────────
        this.bg = this.add.tileSprite(0, 0, W, H, 'bg-main').setOrigin(0, 0);
        const bgTex = this.textures.get('bg-main').getSourceImage();
        if (bgTex && bgTex.height > 0) {
            const s = H / bgTex.height;
            this.bg.setScale(s, s);
        }

        // Clouds
        this.clouds = [];
        const cloudKeys = ['cloud-1', 'cloud-2', 'cloud-3', 'cloud-big'];
        for (let i = 0; i < 8; i++) {
            const key = cloudKeys[i % cloudKeys.length];
            const cloud = this.add.image(
                Phaser.Math.Between(0, W),
                Phaser.Math.Between(20, 130),
                key
            ).setAlpha(0.9).setScale(Phaser.Math.FloatBetween(1.0, 1.6));
            this.clouds.push({ img: cloud, speed: Phaser.Math.FloatBetween(0.2, 0.5) });
        }

        // Warm gradient overlay at bottom
        const grad = this.add.graphics();
        grad.fillGradientStyle(0x1a0800, 0x1a0800, 0x1a0800, 0x1a0800, 0, 0, 0.7, 0.7);
        grad.fillRect(0, H * 0.5, W, H * 0.5);

        // ── Title banner ──────────────────────────────────────────────
        UIHelper.banner(this, W / 2, 72, 620, 'CAPTAIN ORBIO ADVENTURE', '26px', 4.5);

        // ── Player preview + floating branded items ────────────────────
        const previewY = H / 2 - 10;
        const player = this.add.sprite(W / 2, previewY, 'player-idle-1').setScale(3);
        if (this.anims.exists('player-idle')) player.play('player-idle');

        // All 4 branded collectibles spread around the player
        const itemDefs = [
            { key: 'derila',  ox: -110, oy: -15, scale: 1.1, floatDur: 1400, wobble:  8, wDur: 1800 },
            { key: 'matsato', ox:  -65, oy:  40, scale: 1.2, floatDur: 1650, wobble: -7, wDur: 2000 },
            { key: 'sinoshi', ox: -130, oy: -55, scale: 1.0, floatDur: 1250, wobble:  6, wDur: 1650 },
            { key: 'ryoko',   ox:   80, oy:  35, scale: 1.1, floatDur: 1550, wobble: -8, wDur: 1900 },
            { key: 'derila',  ox:  120, oy: -15, scale: 1.0, floatDur: 1300, wobble:  7, wDur: 1750 },
            { key: 'matsato', ox:   90, oy: -55, scale: 1.1, floatDur: 1700, wobble: -6, wDur: 2100 },
            { key: 'sinoshi', ox:   40, oy: -70, scale: 1.0, floatDur: 1450, wobble:  5, wDur: 1850 },
            { key: 'ryoko',   ox:  -40, oy: -65, scale: 1.0, floatDur: 1350, wobble: -7, wDur: 1950 },
        ];
        itemDefs.forEach(({ key, ox, oy, scale, floatDur, wobble, wDur }) => {
            const p = this.add.image(W / 2 + ox, previewY + oy, key).setScale(scale);
            this.tweens.add({
                targets: p, y: p.y - 14,
                duration: floatDur, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
            this.tweens.add({
                targets: p, angle: wobble,
                duration: wDur, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
                delay: floatDur / 3
            });
        });

        // ── Main buttons panel ────────────────────────────────────────
        const btnPanelY = H - 155;
        UIHelper.panel(this, W / 2, btnPanelY + 10, 500, 120, 'ui-green-board');

        // PLAY button (big, green)
        UIHelper.button(this, W / 2, btnPanelY - 18, 220, 44, 'PLAY', 'ui-green-btn', () => {
            this._closeOverlay();
            if (this._music) { this._music.stop(); this._music.destroy(); this._music = null; }
            this.scene.start('LevelSelectScene');
        });

        // SETTINGS and HOW TO PLAY (smaller, side by side)
        UIHelper.button(this, W / 2 - 115, btnPanelY + 38, 160, 36, 'SETTINGS', 'ui-yellow-btn', () => {
            this._showSettings();
        });
        UIHelper.button(this, W / 2 + 115, btnPanelY + 38, 160, 36, 'HOW TO PLAY', 'ui-yellow-btn', () => {
            this._showHowToPlay();
        });

        // ── Menu music ────────────────────────────────────────────────
        if (this._musicOn && this.cache.audio.exists('music-menu')) {
            this._music = this.sound.add('music-menu', { loop: true, volume: 0.35 });
            this._music.play();
        }

        // ── Input ─────────────────────────────────────────────────────
        const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        const startGame = () => {
            if (this._overlay) return;
            if (this._music) { this._music.stop(); this._music.destroy(); this._music = null; }
            this.scene.start('LevelSelectScene');
        };
        spaceKey.on('down', startGame);
        enterKey.on('down', startGame);

        this.input.keyboard.on('keydown-ESC', () => this._closeOverlay());
    }

    // ── Overlay system ─────────────────────────────────────────────────
    _closeOverlay() {
        if (this._overlay) {
            this._overlay.forEach(obj => { if (obj && obj.destroy) obj.destroy(); });
            this._overlay = null;
        }
    }

    _showSettings() {
        this._closeOverlay();
        const W = this.scale.width, H = this.scale.height;
        const cx = W / 2, cy = H / 2;
        const pw = 360, ph = 240;
        this._overlay = [];

        const dim = this.add.rectangle(cx, cy, W, H, 0x000000, 0.6);
        dim.setInteractive();
        this._overlay.push(dim);

        this._overlay.push(UIHelper.panel(this, cx, cy, pw, ph, 'ui-orange-paper'));
        this._overlay.push(UIHelper.banner(this, cx, cy - ph / 2 - 2, 200, 'SETTINGS', '16px'));

        // MUSIC row
        const rowY1 = cy - 32;
        const musicLabel = this.add.text(cx - 80, rowY1, 'MUSIC', {
            fontSize: '15px', color: '#3D1200', fontFamily: 'Arial Black, Arial'
        }).setOrigin(0, 0.5);
        this._overlay.push(musicLabel);

        const musicToggle = this._makeToggle(cx + 60, rowY1, this._musicOn, (val) => {
            GameRegistry.set(this.game, 'musicOn', val);
            if (!val && this._music) {
                this._music.stop();
            } else if (val && !this._music && this.cache.audio.exists('music-menu')) {
                this._music = this.sound.add('music-menu', { loop: true, volume: 0.35 });
                this._music.play();
            }
        });
        this._overlay.push(...musicToggle);

        // SFX row
        const rowY2 = cy + 20;
        const sfxLabel = this.add.text(cx - 80, rowY2, 'SFX', {
            fontSize: '15px', color: '#3D1200', fontFamily: 'Arial Black, Arial'
        }).setOrigin(0, 0.5);
        this._overlay.push(sfxLabel);

        const sfxToggle = this._makeToggle(cx + 60, rowY2, this._sfxOn, (val) => {
            GameRegistry.set(this.game, 'sfxOn', val);
        });
        this._overlay.push(...sfxToggle);

        // BACK button
        const back = UIHelper.button(this, cx, cy + ph / 2 - 28, 120, 32, 'BACK', 'ui-yellow-btn', () => {
            this._closeOverlay();
        });
        this._overlay.push(back.container, back.zone);
    }

    _makeToggle(x, y, initialValue, onChange) {
        return UIHelper.toggle(this, x, y, initialValue, onChange);
    }

    _showHowToPlay() {
        this._closeOverlay();
        const W = this.scale.width, H = this.scale.height;
        const cx = W / 2, cy = H / 2;
        const pw = 420, ph = 300;
        this._overlay = [];

        const dim = this.add.rectangle(cx, cy, W, H, 0x000000, 0.6);
        dim.setInteractive();
        this._overlay.push(dim);

        this._overlay.push(UIHelper.panel(this, cx, cy, pw, ph, 'ui-orange-paper'));
        this._overlay.push(UIHelper.banner(this, cx, cy - ph / 2 - 2, 240, 'HOW TO PLAY', '16px'));

        const lines = [
            ['← → / A D',    'Move left & right'],
            ['↑ / W / SPACE', 'Jump (double-jump available!)'],
            ['Z',             'Sword attack (3-hit combo!)'],
            ['STOMP enemies', 'Jump on top to defeat them'],
            ['COINS',         '+10 pts each'],
            ['DIAMONDS',      '+50 pts each'],
            ['DERILA / MATSATO', '+250–500 pts — hidden items!'],
            ['RED POTION',    'Restores 1 heart'],
            ['CHEST + DOOR',  'Reach the door to WIN!'],
        ];

        lines.forEach(([key, desc], i) => {
            const ly = cy - ph / 2 + 60 + i * 22;
            const t1 = this.add.text(cx - pw / 2 + 22, ly, key, {
                fontSize: '11px', color: '#5C1200', fontFamily: 'Arial Black, Arial'
            }).setOrigin(0, 0.5);
            const t2 = this.add.text(cx - pw / 2 + 160, ly, desc, {
                fontSize: '11px', color: '#3D1200', fontFamily: 'Arial'
            }).setOrigin(0, 0.5);
            this._overlay.push(t1, t2);
        });

        const back = UIHelper.button(this, cx, cy + ph / 2 - 24, 120, 32, 'BACK', 'ui-yellow-btn', () => {
            this._closeOverlay();
        });
        this._overlay.push(back.container, back.zone);
    }

    update() {
        this.bg.tilePositionX += 0.4;

        this.clouds.forEach(c => {
            c.img.x -= c.speed;
            if (c.img.x < -120) {
                c.img.x = this.scale.width + 120;
                c.img.y = Phaser.Math.Between(20, 130);
            }
        });
    }
}
