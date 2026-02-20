class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.win        = data.win   || false;
        this.finalScore = data.score || 0;
        this.finalCoins = data.coins || 0;
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;
        const cx = 400;

        // ── Background ────────────────────────────────────────
        this.add.rectangle(0, 0, W, H, this.win ? 0x0a2a0a : 0x1a0505, 0.92).setOrigin(0, 0);

        // ── Outer green board ────────────────────────────────
        UIHelper.panel(this, cx, 250, 480, 360, 'ui-green-board');

        // ── Title banner at top edge of green board ──────────
        const bannerText = this.win ? 'VICTORY!' : 'GAME OVER';
        UIHelper.banner(this, cx, 250 - 180 + 2, 280, bannerText, '20px');

        // ── Inner orange paper for score area ────────────────
        UIHelper.panel(this, cx, 210, 420, 190, 'ui-orange-paper');

        // Sub-title text
        const subText = this.win
            ? 'You reached the flag!'
            : 'The pirates won this time...';
        this.add.text(cx, 137, subText, {
            fontSize: '11px',
            color: '#5C2800',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        // Divider line
        const dg = this.add.graphics();
        dg.lineStyle(1, 0x8B5A2B, 0.6);
        dg.lineBetween(cx - 180, 149, cx + 180, 149);

        // Score label
        this.add.text(cx, 175, 'FINAL SCORE', {
            fontSize: '12px', color: '#7A4010',
            fontFamily: '"Arial Black", Arial',
        }).setOrigin(0.5);

        // Large score number
        this.add.text(cx, 210, this.finalScore.toString(), {
            fontSize: '38px',
            color: '#3D1200',
            fontFamily: '"Arial Black", Arial',
            stroke: '#F5D890',
            strokeThickness: 3,
        }).setOrigin(0.5);

        // Coin icon + count
        const coinIcon = this.add.sprite(cx - 52, 250, 'coin-1').setScale(1.5);
        coinIcon.play('coin-spin');
        this.add.text(cx - 34, 250, `x ${this.finalCoins}  coins`, {
            fontSize: '13px', color: '#5C2800', fontFamily: 'Arial',
        }).setOrigin(0, 0.5);

        // ── Ranking ──────────────────────────────────────────
        let rank = 'Keep trying, matey!';
        if (this.finalScore >= 1000) rank = 'Master Treasure Hunter!';
        else if (this.finalScore >= 500) rank = 'Seasoned Pirate!';
        else if (this.finalScore >= 200) rank = 'Deck Hand!';

        // Unlock next level on win
        if (this.win) {
            const cur = this.registry.get('level') || 1;
            const max = this.registry.get('maxLevel') || 1;
            if (cur >= max) this.registry.set('maxLevel', Math.min(3, cur + 1));
        }

        // ── Buttons ──────────────────────────────────────────
        UIHelper.button(this, cx - 78, 370, 140, 36, 'PLAY AGAIN', 'ui-green-btn', () => {
            this.scene.start('LevelSelectScene');
        });
        UIHelper.button(this, cx + 78, 370, 140, 36, 'MAIN MENU', 'ui-yellow-btn', () => {
            this.scene.start('MenuScene');
        });

        // ── Rank banner at bottom ────────────────────────────
        UIHelper.banner(this, cx, 432, 240, rank, '12px');

        // ── Keyboard shortcuts ────────────────────────────────
        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('LevelSelectScene'));
        this.input.keyboard.once('keydown-ENTER', () => this.scene.start('LevelSelectScene'));
        this.input.keyboard.once('keydown-ESC',   () => this.scene.start('MenuScene'));

        // ── Confetti on win ───────────────────────────────────
        if (this.win) this._addCelebration();
    }

    _addCelebration() {
        const W = this.scale.width;
        const colors = [0xFFD700, 0xff69b4, 0x00bfff, 0x7fff00, 0xff6347];
        for (let i = 0; i < 40; i++) {
            const x = Phaser.Math.Between(0, W);
            const rect = this.add.rectangle(x, -20, 8, 14,
                colors[i % colors.length]).setRotation(Phaser.Math.FloatBetween(0, Math.PI));
            this.tweens.add({
                targets: rect,
                y: this.scale.height + 50,
                x: x + Phaser.Math.Between(-80, 80),
                rotation: rect.rotation + Phaser.Math.FloatBetween(-3, 3),
                duration: Phaser.Math.Between(1500, 3500),
                delay: Phaser.Math.Between(0, 2000),
                ease: 'Linear',
                repeat: -1,
            });
        }
    }
}
