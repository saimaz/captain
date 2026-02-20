class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        const W = this.scale.width;

        // ── Health bar (top-left) ──────────────────────────────────
        this.add.text(14, 12, '❤', {
            fontSize: '14px', color: '#ff4444', fontFamily: 'Arial'
        });
        this.healthText = this.add.text(32, 10, 'x 3', {
            fontSize: '16px', color: '#ffffff',
            fontFamily: 'Arial Black, Arial',
            stroke: '#000', strokeThickness: 3
        });

        // Health icons (hearts)
        this.hearts = [];
        for (let i = 0; i < 3; i++) {
            const h = this.add.text(50 + i * 22, 10, '♥', {
                fontSize: '18px', color: '#ff4444', fontFamily: 'Arial',
                stroke: '#000', strokeThickness: 2
            });
            this.hearts.push(h);
        }

        // ── Score (top-center) ────────────────────────────────────
        this.scoreLabel = this.add.text(W / 2, 10, 'SCORE', {
            fontSize: '10px', color: '#aaaaaa', fontFamily: 'Arial'
        }).setOrigin(0.5, 0);

        this.scoreText = this.add.text(W / 2, 22, '0', {
            fontSize: '22px', color: '#FFD700',
            fontFamily: 'Arial Black, Arial',
            stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5, 0);

        // ── Coin counter (top-right) ─────────────────────────────
        const coinIcon = this.add.sprite(W - 80, 18, 'coin-1').setScale(1.5);
        coinIcon.play('coin-spin');

        this.coinText = this.add.text(W - 66, 10, 'x 0', {
            fontSize: '16px', color: '#FFD700',
            fontFamily: 'Arial Black, Arial',
            stroke: '#000', strokeThickness: 3
        });

        // ── Semi-transparent top bar background ───────────────────
        const bar = this.add.graphics();
        bar.fillStyle(0x000000, 0.45);
        bar.fillRect(0, 0, W, 42);
        bar.setDepth(-1);

        // ── Listen for events from GameScene ─────────────────────
        this.events.on('healthChanged', (health) => {
            this.updateHealth(health);
        });

        this.events.on('scoreChanged', (score) => {
            this.scoreText.setText(score.toString());
            // Quick scale pop
            this.tweens.add({
                targets: this.scoreText,
                scaleX: 1.3, scaleY: 1.3,
                duration: 80, yoyo: true,
                ease: 'Power2'
            });
        });

        this.events.on('coinCountChanged', (count) => {
            this.coinText.setText('x ' + count);
        });
    }

    updateHealth(health) {
        this.hearts.forEach((h, i) => {
            if (i < health) {
                h.setColor('#ff4444').setAlpha(1);
            } else {
                h.setColor('#555555').setAlpha(0.5);
            }
        });

        // Shake hearts when damaged
        this.tweens.add({
            targets: this.hearts,
            x: '+=3',
            duration: 50,
            yoyo: true,
            repeat: 3,
            ease: 'Linear'
        });
    }
}
