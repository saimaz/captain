// ============================================================
// ShooterTrap.js — Stationary trap that fires projectiles
// Types: 'seashell' | 'totem1' | 'totem2' | 'totem3'
// Depends on: constants.js
// ============================================================
class ShooterTrap {
    constructor(scene, col, row, type, dir) {
        this.scene  = scene;
        this.type   = type;
        this.dir    = dir;   // 'left' | 'right'
        this.isDead = false;
        this.health = (type === 'seashell') ? 2 : 3;

        const x = col * GAME.TILE + 16;
        const y = row * GAME.TILE;

        const idleKey = type === 'seashell' ? 'seashell-idle' : `${type}-idle`;

        this.sprite = scene.physics.add.staticSprite(x, y, idleKey);
        this.sprite.setDepth(9);
        if (dir === 'right') this.sprite.setFlipX(true);

        const fireDelay = 2500 + Math.random() * 2000;
        this._timer = scene.time.addEvent({
            delay:   fireDelay,
            loop:    true,
            startAt: Math.random() * fireDelay,
            callback: () => this._tryFire()
        });
    }

    _tryFire() {
        if (this.isDead || !this.scene.player || this.scene.player.isDead) return;

        if (this.type === 'seashell') {
            this.sprite.setTexture('seashell-opening-1');
            this.sprite.play('seashell-opening').once('animationcomplete', () => {
                if (this.isDead) return;
                this.sprite.play('seashell-fire').once('animationcomplete', () => {
                    if (this.isDead) return;
                    this.sprite.setTexture('seashell-idle');
                });
                this._spawnProjectile('pearl');
            });
        } else {
            this.sprite.play(`${this.type}-attack`).once('animationcomplete', () => {
                if (this.isDead) return;
                this.sprite.setTexture(`${this.type}-idle`);
            });
            this._spawnProjectile('pearl');
        }
    }

    _spawnProjectile(key) {
        const vx = this.dir === 'left' ? -200 : 200;
        const proj = this.scene.physics.add.image(this.sprite.x, this.sprite.y - 4, key);
        proj.body.allowGravity = false;
        proj.setVelocityX(vx);
        proj.setDepth(8);
        this.scene.allCannonballs.add(proj);
        this.scene.time.delayedCall(3000, () => { if (proj.active) proj.destroy(); });
    }

    takeDamage() {
        if (this.isDead) return;
        this.health--;
        if (this.health <= 0) {
            this._die();
            return;
        }
        const hitAnim = this.type === 'seashell' ? 'seashell-hit' : `${this.type}-hit`;
        if (this.scene.anims.exists(hitAnim)) {
            this.sprite.play(hitAnim).once('animationcomplete', () => {
                if (!this.isDead) {
                    const idleKey = this.type === 'seashell' ? 'seashell-idle' : `${this.type}-idle`;
                    this.sprite.setTexture(idleKey);
                }
            });
        }
    }

    _die() {
        if (this.isDead) return;
        this.isDead = true;
        if (this._timer) this._timer.remove();
        const deadAnim = this.type === 'seashell' ? 'seashell-dead' : `${this.type}-dead`;
        if (this.scene.anims.exists(deadAnim)) {
            this.sprite.play(deadAnim).once('animationcomplete', () => this.sprite.destroy());
        } else {
            this.sprite.destroy();
        }
    }

    destroy() {
        if (this._timer) this._timer.remove();
        if (this.sprite && this.sprite.active) this.sprite.destroy();
    }
}
