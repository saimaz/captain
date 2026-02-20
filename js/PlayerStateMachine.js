// ============================================================
// PlayerStateMachine.js — Player animation FSM + sword combat
//
// States:
//   idle | running | jumping | falling | landing | hit | dead
//   attacking | air_attacking
//
// Responsibilities:
//   - Play the correct animation for each state
//   - Manage 3-hit sword combo (Z key)
//   - Manage sword hitbox for damage detection
//   - Transitions between all states
// ============================================================

class PlayerStateMachine {
    constructor(player, scene) {
        this._player   = player;
        this._scene    = scene;
        this._state    = 'idle';

        // Combo tracking
        this._comboStep  = 0;    // 1-3 (current attack in combo)
        this._comboTimer = 0;    // ms remaining to continue combo

        // Landing sub-state timer
        this._landingTimer = 0;

        // Track if last attack animation is done
        this._attackDone = true;

        // Z key for sword attack
        this._attackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // Sword hitbox — invisible physics body used for damage overlap
        // Positioned ahead of player during attack frames
        this._swordHitbox = scene.physics.add.image(-9999, -9999, 'block');
        this._swordHitbox.setSize(36, 28).setVisible(false);
        this._swordHitbox.body.allowGravity = false;
        this._swordHitbox.body.enable = false;
        this._swordHitbox.setDepth(10);
    }

    /** Exposed so GameScene can register overlap collisions */
    get swordHitbox() { return this._swordHitbox; }

    /** True while an attack animation is actively playing */
    isAttacking() {
        return this._state === 'attacking' || this._state === 'air_attacking';
    }

    // ──────────────────────────────────────────────────────────
    // Called every frame from Player.update()
    // Parameters mirror what Player already computed to avoid
    // redundant body reads.
    // ──────────────────────────────────────────────────────────
    update(dt, onGround, isMoving, prevOnGround) {
        const player = this._player;
        const sp     = player.sprite;
        if (player.isDead) return;

        // Tick combo timer
        if (this._comboTimer > 0) {
            this._comboTimer -= dt;
            if (this._comboTimer <= 0) this._comboStep = 0;
        }

        // Keep sword hitbox tracking player position when active
        if (this._swordHitbox.body.enable) {
            this._syncSwordHitbox();
        }

        const attackJustDown = Phaser.Input.Keyboard.JustDown(this._attackKey);

        switch (this._state) {

            // ── Grounded states ──────────────────────────────
            case 'idle':
            case 'running': {
                if (attackJustDown) { this._beginAttack(); return; }
                if (!onGround) {
                    const vy = sp.body.velocity.y;
                    this._state = vy < 0 ? 'jumping' : 'falling';
                    sp.play(this._state === 'jumping' ? 'player-jump' : 'player-fall', true);
                    return;
                }
                // Just landed
                if (onGround && !prevOnGround && this._state !== 'landing') {
                    this._state = 'landing';
                    this._landingTimer = 200;
                    sp.play('player-ground', true);
                    return;
                }
                // Normal ground locomotion
                if (isMoving) {
                    this._state = 'running';
                    sp.play('player-run', true);
                } else {
                    this._state = 'idle';
                    sp.play('player-idle', true);
                }
                break;
            }

            case 'landing': {
                this._landingTimer -= dt;
                if (this._landingTimer <= 0) {
                    this._state = 'idle';
                    sp.play('player-idle', true);
                }
                break;
            }

            // ── Airborne states ──────────────────────────────
            case 'jumping': {
                if (attackJustDown) { this._beginAirAttack(); return; }
                const vy = sp.body.velocity.y;
                if (vy >= 0) {
                    this._state = 'falling';
                    sp.play('player-fall', true);
                } else {
                    sp.play('player-jump', true);
                }
                break;
            }

            case 'falling': {
                if (attackJustDown) { this._beginAirAttack(); return; }
                if (onGround) {
                    this._state = 'landing';
                    this._landingTimer = 200;
                    sp.play('player-ground', true);
                    return;
                }
                sp.play('player-fall', true);
                break;
            }

            // ── Attack states ─────────────────────────────────
            case 'attacking': {
                // Allow combo extension while attacking
                if (attackJustDown && this._comboStep < 3 && !this._attackDone) {
                    this._comboTimer = GAME.PLAYER.COMBO_WINDOW + 100; // small grace
                }
                // Animation complete callback handles state transition
                break;
            }

            case 'air_attacking': {
                // Land detection — end air attack
                if (onGround) {
                    this._endAttack(true);
                }
                break;
            }

            // ── Passive states ────────────────────────────────
            case 'hit':
            case 'dead':
                // Managed externally by Player.takeDamage() / die()
                break;
        }
    }

    // ──────────────────────────────────────────────────────────
    // Begin a ground sword attack (combo step 1-2-3)
    // ──────────────────────────────────────────────────────────
    _beginAttack() {
        // Determine combo step
        if (this._comboStep > 0 && this._comboTimer > 0 && this._attackDone) {
            this._comboStep = Math.min(this._comboStep + 1, 3);
        } else {
            this._comboStep = 1;
        }
        this._comboTimer  = GAME.PLAYER.COMBO_WINDOW;
        this._attackDone  = false;
        this._state       = 'attacking';

        const animKey = 'player-attack' + this._comboStep;
        const sp      = this._player.sprite;
        sp.play(animKey, true);

        // Activate hitbox on frame 2 (≈80ms in at 12fps)
        this._scene.time.delayedCall(80, () => {
            if (this._state === 'attacking') this._enableSwordHitbox();
        });

        // When animation finishes, transition out (or accept next combo)
        sp.once('animationcomplete', (anim) => {
            if (anim.key !== animKey) return;
            this._disableSwordHitbox();
            this._attackDone = true;

            if (this._state !== 'attacking') return;
            const onGround = this._player.sprite.body.blocked.down;
            this._state = onGround ? 'idle' : 'falling';
            this._player.sprite.play(onGround ? 'player-idle' : 'player-fall', true);
        });

        // Play fight sound
        this._scene._playSound('fight', 0.35);
    }

    // ──────────────────────────────────────────────────────────
    // Begin an air sword attack
    // ──────────────────────────────────────────────────────────
    _beginAirAttack() {
        this._attackDone = false;
        this._state      = 'air_attacking';
        const sp         = this._player.sprite;
        sp.play('player-air-attack1', true);

        this._scene.time.delayedCall(80, () => {
            if (this._state === 'air_attacking') this._enableSwordHitbox();
        });

        sp.once('animationcomplete', (anim) => {
            if (anim.key !== 'player-air-attack1') return;
            this._disableSwordHitbox();
            this._attackDone = true;
            if (this._state === 'air_attacking') {
                this._state = 'falling';
                this._player.sprite.play('player-fall', true);
            }
        });

        this._scene._playSound('fight', 0.35);
    }

    // ──────────────────────────────────────────────────────────
    // Called when landing during air attack, or external cleanup
    // ──────────────────────────────────────────────────────────
    _endAttack(landing = false) {
        this._disableSwordHitbox();
        this._attackDone = true;
        this._comboStep  = 0;
        if (landing) {
            this._state        = 'landing';
            this._landingTimer = 200;
            this._player.sprite.play('player-ground', true);
        } else {
            this._state = 'idle';
            this._player.sprite.play('player-idle', true);
        }
    }

    // ──────────────────────────────────────────────────────────
    // External state setters (called by Player.takeDamage/die)
    // ──────────────────────────────────────────────────────────
    setHit() {
        this._disableSwordHitbox();
        this._comboStep  = 0;
        this._comboTimer = 0;
        this._state      = 'hit';
    }

    clearHit() {
        if (this._state !== 'hit') return;
        const sp = this._player.sprite;
        this._state = sp.body.blocked.down ? 'idle' : 'falling';
    }

    setDead() {
        this._disableSwordHitbox();
        this._state = 'dead';
    }

    // ──────────────────────────────────────────────────────────
    // Sword hitbox helpers
    // ──────────────────────────────────────────────────────────
    _enableSwordHitbox() {
        this._syncSwordHitbox();
        this._swordHitbox.body.enable = true;
    }

    _disableSwordHitbox() {
        this._swordHitbox.body.enable = false;
        this._swordHitbox.setPosition(-9999, -9999);
    }

    _syncSwordHitbox() {
        const sp  = this._player.sprite;
        const dir = sp.flipX ? -1 : 1;
        this._swordHitbox.setPosition(
            sp.x + dir * GAME.PLAYER.SWORD_OFFSET,
            sp.y
        );
    }

    destroy() {
        if (this._swordHitbox) {
            this._swordHitbox.destroy();
            this._swordHitbox = null;
        }
    }
}
