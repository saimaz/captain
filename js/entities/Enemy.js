// ============================================================
// Enemy.js — Enemy entity with patrol / chase / attack AI
// Depends on: constants.js
// ============================================================
class Enemy {
    constructor(scene, x, y, type, patrolRange) {
        this.scene       = scene;
        this.type        = type;
        this.startX      = x;
        this.patrolRange = patrolRange;
        this.isDead      = false;

        const cfg    = GAME.ENEMIES[type] || GAME.ENEMIES.crabby;
        this.speed   = cfg.speed;
        this.health  = cfg.health;
        this._dir    = -1;

        // AI state: 'patrol' | 'chase' | 'attack'
        this._aiState        = 'patrol';
        this._attackCooldown = 0;
        this._isAttacking    = false;
        this._wasOnGround    = true;

        // Pink Star rolling movement
        this._isPink       = (type === 'pink');
        this._jumpCooldown = 0;
        this._isInAir      = false;

        this.sprite = scene.physics.add.sprite(x, y, type + '-idle-1');
        this.sprite.setSize(40, 28).setOffset(16, 2);
        this.sprite.setGravityY(400); // world gravity (900) + 400 extra = 1300 total
        this.sprite.setCollideWorldBounds(false);
        this.sprite.setDepth(9);
        this.sprite.play(type + '-run', true);
    }

    update(dt, playerSprite) {
        if (this.isDead) return;
        const sp   = this.sprite;
        const body = sp.body;

        this._attackCooldown = Math.max(0, this._attackCooldown - dt);
        if (this._isPink) this._jumpCooldown = Math.max(0, this._jumpCooldown - dt);

        // Edge detection: was on ground last frame, now falling -> at edge, reverse
        const onGround = body.blocked.down;
        if (this._wasOnGround && !onGround && !this._isAttacking) {
            this._dir *= -1;
            sp.x += this._dir * 8;
        }

        // Pink Star: track air state and play jump/fall/ground animations
        if (this._isPink && !this._isAttacking) {
            if (!onGround) {
                this._isInAir = true;
                if (body.velocity.y < 0) sp.play('pink-jump', true);
                else                     sp.play('pink-fall', true);
            } else if (this._isInAir) {
                this._isInAir = false;
                sp.play('pink-ground', true);
                this.scene.time.delayedCall(200, () => {
                    if (!this.isDead && !this._isAttacking) sp.play('pink-run', true);
                });
            }
        }

        this._wasOnGround = onGround;

        if (this._isAttacking) return;

        const dist = Phaser.Math.Distance.Between(sp.x, sp.y, playerSprite.x, playerSprite.y);
        const ai   = GAME.ENEMY_AI;

        switch (this._aiState) {
            case 'patrol':
                this._doPatrol();
                if (dist < ai.CHASE_RANGE) this._aiState = 'chase';
                break;

            case 'chase':
                if (dist < ai.ATTACK_RANGE && this._attackCooldown <= 0) {
                    this._startAttack(playerSprite);
                } else if (dist > ai.ABANDON_RANGE) {
                    this._aiState = 'patrol';
                    sp.play(this.type + '-run', true);
                } else {
                    this._doChase(playerSprite);
                }
                break;

            case 'attack':
                // Managed by _startAttack callbacks
                break;
        }
    }

    _doPatrol() {
        const sp = this.sprite;
        const distFromStart = sp.x - this.startX;
        if (distFromStart >  this.patrolRange / 2) this._dir = -1;
        if (distFromStart < -this.patrolRange / 2) this._dir =  1;
        const worldRight = this.scene.physics.world.bounds.right;
        if (sp.x <= 16)              this._dir =  1;
        if (sp.x >= worldRight - 16) this._dir = -1;

        sp.setVelocityX(this._dir * this.speed);
        sp.setFlipX(this._dir > 0);
        if (sp.body.blocked.down && !this._isInAir) {
            if (this._isPink) this._pinkJumpTick(sp, this.speed);
            else              sp.play(this.type + '-run', true);
        }
    }

    _doChase(playerSprite) {
        const sp  = this.sprite;
        const dir = playerSprite.x > sp.x ? 1 : -1;
        this._dir = dir;
        sp.setVelocityX(dir * this.speed * GAME.ENEMY_AI.CHASE_SPEED_MULT);
        sp.setFlipX(dir > 0);
        if (sp.body.blocked.down && !this._isInAir) {
            if (this._isPink) this._pinkJumpTick(sp, this.speed * GAME.ENEMY_AI.CHASE_SPEED_MULT);
            else              sp.play(this.type + '-run', true);
        }
    }

    _pinkJumpTick(sp, vx) {
        if (this._jumpCooldown > 0) {
            sp.play('pink-run', true);
            return;
        }
        this._jumpCooldown = 1400;
        sp.setVelocityY(-420);
        sp.setVelocityX(this._dir * (vx + 40));
    }

    _startAttack(playerSprite) {
        this._isAttacking = true;
        this._aiState     = 'attack';

        const sp  = this.sprite;
        const dir = playerSprite.x > sp.x ? 1 : -1;
        this._dir = dir;
        sp.setFlipX(dir > 0);
        sp.setVelocityX(0);

        sp.play(this.type + '-anticipation', true);
        sp.once('animationcomplete', () => {
            if (this.isDead) return;
            sp.play(this.type + '-attack', true);

            this.scene.time.delayedCall(GAME.ENEMY_AI.DMG_DELAY, () => {
                if (this.isDead) return;
                const player = this.scene.player;
                if (!player || player.isDead || player.isInvincible) return;
                const d = Phaser.Math.Distance.Between(sp.x, sp.y, player.sprite.x, player.sprite.y);
                if (d < GAME.ENEMY_AI.ATTACK_RANGE + 20) player.takeDamage();
            });

            sp.once('animationcomplete', () => {
                if (this.isDead) return;
                this._isAttacking    = false;
                this._attackCooldown = GAME.ENEMY_AI.ATTACK_COOLDOWN;
                this._aiState        = 'chase';
                sp.play(this.type + '-run', true);
            });
        });
    }

    takeDamage(amount, playerRef) {
        if (this.isDead) return;
        this.health -= amount;

        if (this.health <= 0) {
            this._die(playerRef);
            return;
        }

        const sp = this.sprite;
        sp.play(this.type + '-hit', true);
        sp.setTintFill(0xffffff);
        this.scene.time.delayedCall(100, () => {
            if (!this.isDead) {
                sp.clearTint();
                sp.play(this.type + '-run', true);
                this._isAttacking = false;
            }
        });

        const kbDir = sp.flipX ? 1 : -1;
        sp.setVelocityX(kbDir * 120);

        this.scene._playSound('hit', 0.4);
        playerRef.collectItem(GAME.POINTS.SWORD);
    }

    _die(playerRef) {
        this.isDead       = true;
        this._isAttacking = false;

        const sp = this.sprite;
        sp.setVelocityX(0);
        sp.body.enable = false;
        sp.clearTint();
        sp.play(this.type + '-dead', true);

        if (playerRef) playerRef.collectItem(GAME.POINTS.SWORD);

        this.scene._playSound('hit', 0.4);

        sp.once('animationcomplete', () => {
            if (sp && sp.active) {
                sp.play(this.type + '-dead-ground', true);
                sp.once('animationcomplete', () => {
                    this.scene.time.delayedCall(400, () => this.destroy());
                });
            }
        });
    }

    stomp(playerRef) {
        if (this.isDead) return;
        this._die(null);
        playerRef.collectItem(GAME.POINTS.STOMP);
        playerRef.sprite.setVelocityY(-380);
    }

    destroy() {
        if (this.sprite && this.sprite.active) this.sprite.destroy();
    }
}
