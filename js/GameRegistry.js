// ============================================================
// GameRegistry.js — Cross-scene persistent state manager
// Wraps Phaser's game.registry for a clean API
// ============================================================

class GameRegistry {
    /** Initialize all registry values at game start */
    static init(game) {
        game.registry.set('health',  GAME.PLAYER.HEALTH);
        game.registry.set('score',   0);
        game.registry.set('coins',   0);
        game.registry.set('level',   1);
        game.registry.set('maxLevel', 1);
        game.registry.set('musicOn', true);
        game.registry.set('sfxOn',   true);
    }

    static get(game, key) {
        return game.registry.get(key);
    }

    static set(game, key, val) {
        game.registry.set(key, val);
        return val;
    }

    /** Toggle a boolean registry value; returns new value */
    static toggle(game, key) {
        const next = !game.registry.get(key);
        game.registry.set(key, next);
        return next;
    }
}
