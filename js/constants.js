// ============================================================
// constants.js — Global game constants
// Loaded first — all other files depend on this
// ============================================================

const GAME = Object.freeze({
    TILE:       32,
    WORLD_W:    250 * 32,   // 8000px
    WORLD_H:    40  * 32,   // 1280px
    GROUND_ROW: 35,
    GROUND_Y:   35 * 32,    // 1120px
    CANVAS_W:   800,
    CANVAS_H:   480,
    GRAVITY:    900,

    PLAYER: {
        SPEED:            185,
        JUMP_VEL:        -440,
        MAX_JUMPS:          2,
        HEALTH:             3,
        INVINCIBLE_MS:   1500,
        COMBO_WINDOW:     800,  // ms to chain sword combos
        SWORD_OFFSET:      30,  // px ahead of player center for hitbox
    },

    ENEMIES: {
        crabby: { speed:  55, patrol: 200, health: 1 },
        fierce: { speed:  75, patrol: 250, health: 2 },
        pink:   { speed:  65, patrol: 220, health: 3 },
    },

    ENEMY_AI: {
        CHASE_RANGE:        150,   // px — enter chase state
        ATTACK_RANGE:        65,   // px — enter attack state
        ABANDON_RANGE:      350,   // px — give up and return to patrol
        CHASE_SPEED_MULT:   1.4,
        ATTACK_COOLDOWN:   1500,   // ms between attacks
        DMG_DELAY:          300,   // ms into attack animation before damage
    },

    POINTS: {
        COIN:    10,
        DIAMOND: 50,
        DERILA:  500,
        MATSATO: 250,
        SINOSHI: 250,
        RYOKO:   250,
        CHEST:   200,
        STOMP:   100,
        SWORD:    75,
    },

    VISUALS: {
        CLOUD_Y_MIN: 40,
        CLOUD_Y_MAX: 160,
        BIG_CLOUD_Y: 100,
        CLOUD_DRIFT_MIN: 0.1,
        CLOUD_DRIFT_MAX: 0.3,
        BIG_CLOUD_SPEED: 0.2,
    },
});
