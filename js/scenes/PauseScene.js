// ============================================================
// PauseScene.js — In-game pause menu overlay
// ============================================================

class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const W = GAME.CANVAS_W;
        const H = GAME.CANVAS_H;

        this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.68);

        this._panelObjs = [];
        this._showMain();

        this.input.keyboard.on('keydown-ESC', () => this._resume());
    }

    // ──────────────────────────────────────────────────────────
    _clearPanel() {
        this._panelObjs.forEach(o => { if (o && o.destroy) o.destroy(); });
        this._panelObjs = [];
    }

    // ──────────────────────────────────────────────────────────
    _showMain() {
        this._clearPanel();

        const W = GAME.CANVAS_W, H = GAME.CANVAS_H;
        const cx = W / 2, cy = H / 2;
        const pw = 270, ph = 250;
        const allObjs = [];

        allObjs.push(UIHelper.panel(this, cx, cy, pw, ph, 'ui-green-board'));
        allObjs.push(UIHelper.banner(this, cx, cy - ph / 2 - 2, 180, 'PAUSED'));

        const b1 = UIHelper.button(this, cx, cy - 46, 240, 36, '▶  RESUME',    'ui-green-btn',  () => this._resume());
        const b2 = UIHelper.button(this, cx, cy + 14, 240, 36, '⚙  SETTINGS',  'ui-yellow-btn', () => this._showSettings());
        const b3 = UIHelper.button(this, cx, cy + 74, 240, 36, '✕  MAIN MENU', 'ui-yellow-btn', () => this._exitToMenu());
        allObjs.push(b1.container, b1.zone, b2.container, b2.zone, b3.container, b3.zone);

        this._panelObjs = allObjs;

        // Pop-in tween (zones have no setAlpha — filter them out)
        allObjs.forEach(o => { if (o && o.setAlpha) o.setAlpha(0); });
        this.tweens.add({
            targets: allObjs.filter(o => o && o.setAlpha),
            alpha: 1, duration: 120, ease: 'Power2'
        });
    }

    // ──────────────────────────────────────────────────────────
    _showSettings() {
        this._clearPanel();

        const W = GAME.CANVAS_W, H = GAME.CANVAS_H;
        const cx = W / 2, cy = H / 2;
        const pw = 290, ph = 270;
        const allObjs = [];

        allObjs.push(UIHelper.panel(this, cx, cy, pw, ph, 'ui-green-board'));
        allObjs.push(UIHelper.banner(this, cx, cy - ph / 2 - 2, 180, 'SETTINGS', '13px'));

        // MUSIC row
        const rowY1 = cy - 68;
        allObjs.push(this._rowLabel(cx - 58, rowY1, 'MUSIC'));
        allObjs.push(...UIHelper.toggle(this, cx + 62, rowY1, this.registry.get('musicOn'), (val) => {
            GameRegistry.set(this.game, 'musicOn', val);
            const gs = this.scene.get('GameScene');
            if (gs && gs._music) {
                val ? gs._music.resume() : gs._music.pause();
            }
        }));

        // SFX row
        const rowY2 = cy - 4;
        allObjs.push(this._rowLabel(cx - 58, rowY2, 'SFX'));
        allObjs.push(...UIHelper.toggle(this, cx + 62, rowY2, this.registry.get('sfxOn'), (val) => {
            GameRegistry.set(this.game, 'sfxOn', val);
        }));

        // Divider
        const div = this.add.graphics();
        div.lineStyle(2, 0x3A5A35, 0.65);
        div.lineBetween(cx - pw / 2 + 18, cy + 54, cx + pw / 2 - 18, cy + 54);
        allObjs.push(div);

        const bBack = UIHelper.button(this, cx, cy + 90, 200, 36, '←  BACK', 'ui-yellow-btn', () => this._showMain());
        allObjs.push(bBack.container, bBack.zone);

        this._panelObjs = allObjs;

        allObjs.forEach(o => { if (o && o.setAlpha) o.setAlpha(0); });
        this.tweens.add({
            targets: allObjs.filter(o => o && o.setAlpha),
            alpha: 1, duration: 120, ease: 'Power2'
        });
    }

    // ──────────────────────────────────────────────────────────
    _resume() {
        const gs = this.scene.get('GameScene');
        if (gs) gs._paused = false;
        this.scene.resume('GameScene');
        this.scene.stop('PauseScene');
    }

    _exitToMenu() {
        const gs = this.scene.get('GameScene');
        if (gs) {
            if (gs._music) { gs._music.stop(); gs._music.destroy(); gs._music = null; }
            gs._paused = false;
            this.scene.resume('GameScene');
            this.scene.stop('UIScene');
            this.scene.stop('GameScene');
        }
        this.scene.start('MenuScene');
    }

    // ──────────────────────────────────────────────────────────
    _rowLabel(x, y, text) {
        return this.add.text(x, y, text, {
            fontSize: '14px',
            fontFamily: '"Arial Black", Arial',
            color: '#F0DCA0',
            stroke: '#1C2E1A',
            strokeThickness: 3,
        }).setOrigin(0, 0.5);
    }

}
