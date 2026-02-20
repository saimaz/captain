// ============================================================
// Player.js — Player entity
// Depends on: constants.js, PlayerStateMachine.js
// ============================================================
class Player {
    constructor(scene, x, y) {
        this.scene        = scene;
        this.health       = GAME.PLAYER.HEALTH;
        this.score        = 0;
        this.coins        = 0;
        this.isDead       = false;
        this.isInvincible = false;

        this._jumpsLeft    = GAME.PLAYER.MAX_JUMPS;
        this._onGround     = false;
        this._prevOnGround = false;
        this._jumpHeld     = false;

        // Sprite
        this.sprite = scene.physics.add.sprite(x, y, 'player-idle-1');
        this.sprite.setSize(32, 28).setOffset(16, 8);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setGravityY(GAME.GRAVITY);
        this.sprite.setDepth(10);

        // Keys
        this._keys = scene.input.keyboard.addKeys({
            left:  Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up:    Phaser.Input.Keyboard.KeyCodes.UP,
            a:     Phaser.Input.Keyboard.KeyCodes.A,
            d:     Phaser.Input.Keyboard.KeyCodes.D,
            w:     Phaser.Input.Keyboard.KeyCodes.W,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        // Dust particles
        this._dustRun = scene.add.particles(0, 0, 'dust-run-1', {
            speed: 30, scale: { start: 0.6, end: 0 }, alpha: { start: 0.7, end: 0 },
            lifespan: 300, quantity: 1, emitting: false
        }).setDepth(9);

        this._dustJump = scene.add.particles(0, 0, 'dust-jump-1', {
            speed: 50, scale: { start: 0.8, end: 0 }, alpha: { start: 0.8, end: 0 },
            lifespan: 350, quantity: 6, emitting: false
        }).setDepth(9);

        // State machine (animation + sword combat)
        this._fsm = new PlayerStateMachine(this, scene);
    }

    update(dt) {
        if (this.isDead) return;

        const sp   = this.sprite;
        const k    = this._keys;
        const body = sp.body;

        const onGround = body.blocked.down;
        this._prevOnGround = this._onGround;
        this._onGround     = onGround;

        if (onGround && !this._prevOnGround) {
            this._jumpsLeft = GAME.PLAYER.MAX_JUMPS;
            this._dustJump.emitParticleAt(sp.x, sp.y + 16);
        }

        const goLeft  = k.left.isDown || k.a.isDown;
        const goRight = k.right.isDown || k.d.isDown;

        if (goLeft) {
            sp.setVelocityX(-GAME.PLAYER.SPEED);
            sp.setFlipX(true);
        } else if (goRight) {
            sp.setVelocityX(GAME.PLAYER.SPEED);
            sp.setFlipX(false);
        } else {
            sp.setVelocityX(0);
        }

        const jumpPressed = k.up.isDown || k.w.isDown || k.space.isDown;
        if (jumpPressed && !this._jumpHeld && this._jumpsLeft > 0) {
            sp.setVelocityY(GAME.PLAYER.JUMP_VEL);
            this._jumpsLeft--;
            this._jumpHeld = true;
            this._dustJump.emitParticleAt(sp.x, sp.y + 16);
            this.scene._playSound('jump', 0.55);
        }
        if (!jumpPressed) this._jumpHeld = false;

        if (onGround && (goLeft || goRight)) {
            this._dustRun.emitParticleAt(sp.x, sp.y + 16);
        }

        // Delegate animation + sword to state machine
        this._fsm.update(dt, onGround, goLeft || goRight, this._prevOnGround);
    }

    takeDamage() {
        if (this.isDead || this.isInvincible) return;
        this.health = Math.max(0, this.health - 1);
        this.scene.events.emit('playerDamaged', this.health);

        if (this.health <= 0) { this.die(); return; }

        this.isInvincible = true;
        this._fsm.setHit();
        this.sprite.play('player-hit', true);

        const kbDir = this.sprite.flipX ? 1 : -1;
        this.sprite.setVelocity(kbDir * 160, -200);

        this.scene.tweens.add({
            targets: this.sprite, alpha: 0, duration: 100, yoyo: true, repeat: 7,
            onComplete: () => { if (this.sprite && this.sprite.active) this.sprite.setAlpha(1); }
        });

        this.scene._playSound('hit', 0.6);

        this.scene.time.delayedCall(GAME.PLAYER.INVINCIBLE_MS, () => {
            this.isInvincible = false;
            this._fsm.clearHit();
        });
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this._fsm.setDead();
        this.sprite.setVelocity(0, -200);
        this.sprite.play('player-dead-hit', true);
        this.scene._playSound('hit', 0.8);

        this.scene.time.delayedCall(600, () => {
            if (this.sprite && this.sprite.active) this.sprite.play('player-dead-ground', true);
        });
        this.scene.time.delayedCall(2000, () => {
            this.scene.events.emit('playerDied');
        });
    }

    heal() {
        this.health = Math.min(GAME.PLAYER.HEALTH, this.health + 1);
        this.scene.events.emit('playerDamaged', this.health);
    }

    collectItem(points) {
        this.score += points;
        this.scene.events.emit('scoreUpdated', this.score);
    }

    destroy() {
        if (this._fsm) this._fsm.destroy();
    }
}
