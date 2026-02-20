class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        const width  = GAME.CANVAS_W;
        const height = GAME.CANVAS_H;

        // ── Loading UI ────────────────────────────────────────
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a0a2e);

        for (let i = 0; i < 60; i++) {
            const x    = Phaser.Math.Between(0, width);
            const y    = Phaser.Math.Between(0, height * 0.7);
            const size = Phaser.Math.FloatBetween(1, 2.5);
            this.add.circle(x, y, size, 0xffffff, Phaser.Math.FloatBetween(0.3, 1));
        }

        this.add.text(width / 2, height / 2 - 90, 'Captain ORBIO Adventure', {
            fontSize: '28px', fontFamily: 'Georgia, serif', color: '#f5d76e',
            stroke: '#7a3b00', strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4, fill: true }
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 55, '~ A Pirate Platformer ~', {
            fontSize: '16px', fontFamily: 'Georgia, serif', color: '#a8d8ea', alpha: 0.85
        }).setOrigin(0.5);

        const barWidth  = 400, barHeight = 28;
        const barX = width / 2 - barWidth / 2;
        const barY = height / 2 - 14;
        this.add.rectangle(width / 2, height / 2, barWidth + 8, barHeight + 8, 0x000000, 0.6)
            .setStrokeStyle(2, 0xf5d76e, 0.8);
        this.add.rectangle(barX, barY, barWidth, barHeight, 0x0d0020).setOrigin(0, 0);
        const bar         = this.add.rectangle(barX, barY, 0, barHeight, 0xf5d76e).setOrigin(0, 0);
        const percentText = this.add.text(width / 2, height / 2 + 30, '0%', {
            fontSize: '16px', fontFamily: 'Georgia, serif', color: '#ffffff'
        }).setOrigin(0.5);
        const statusText  = this.add.text(width / 2, height / 2 + 55, 'Loading...', {
            fontSize: '13px', fontFamily: 'Georgia, serif', color: '#a8d8ea', alpha: 0.8
        }).setOrigin(0.5);

        this.load.on('progress',     (v) => { bar.width = barWidth * v; percentText.setText(Math.floor(v * 100) + '%'); });
        this.load.on('fileprogress', (f) => { statusText.setText('Loading: ' + f.key); });
        this.load.on('complete',     ()  => { percentText.setText('100%'); statusText.setText('Ready!'); });

        // =====================================================
        // LOAD ALL ASSETS
        // =====================================================

        // Terrain
        this.load.spritesheet('terrain',
            'asset/Palm Tree Island/Sprites/Terrain/Terrain (32x32).png',
            { frameWidth: 32, frameHeight: 32 }
        );

        // Backgrounds
        this.load.image('bg-main',   'asset/Palm Tree Island/Sprites/Background/BG Image.png');
        this.load.image('bg-sky',    'asset/Palm Tree Island/Sprites/Background/Additional Sky.png');
        this.load.image('bg-water',  'asset/Palm Tree Island/Sprites/Background/Additional Water.png');
        this.load.image('cloud-1',   'asset/Palm Tree Island/Sprites/Background/Small Cloud 1.png');
        this.load.image('cloud-2',   'asset/Palm Tree Island/Sprites/Background/Small Cloud 2.png');
        this.load.image('cloud-3',   'asset/Palm Tree Island/Sprites/Background/Small Cloud 3.png');
        this.load.image('cloud-big', 'asset/Palm Tree Island/Sprites/Background/Big Clouds.png');

        // ── Player — without sword (base movement) ────────────
        const playerBase  = 'asset/Captain Clown Nose/Sprites/Captain Clown Nose/Captain Clown Nose without Sword/';
        this.loadFrames('player-idle',        playerBase + '01-Idle/',        'Idle ',        5);
        this.loadFrames('player-run',         playerBase + '02-Run/',         'Run ',         6);
        this.loadFrames('player-jump',        playerBase + '03-Jump/',        'Jump ',        3);
        this.loadFrames('player-fall',        playerBase + '04-Fall/',        'Fall ',        1);
        this.loadFrames('player-ground',      playerBase + '05-Ground/',      'Ground ',      2);
        this.loadFrames('player-hit',         playerBase + '06-Hit/',         'Hit ',         4);
        this.loadFrames('player-dead-hit',    playerBase + '07-Dead Hit/',    'Dead Hit ',    4);
        this.loadFrames('player-dead-ground', playerBase + '08-Dead Ground/', 'Dead Ground ', 4);

        // ── Player — with sword (attack animations) ───────────
        const playerSword = 'asset/Captain Clown Nose/Sprites/Captain Clown Nose/Captain Clown Nose with Sword/';
        this.loadFrames('player-attack1',     playerSword + '15-Attack 1/',   'Attack 1 ',    3);
        this.loadFrames('player-attack2',     playerSword + '16-Attack 2/',   'Attack 2 ',    3);
        this.loadFrames('player-attack3',     playerSword + '17-Attack 3/',   'Attack 3 ',    3);
        this.loadFrames('player-air-attack1', playerSword + '18-Air Attack 1/', 'Air Attack 1 ', 3);
        this.loadFrames('player-air-attack2', playerSword + '19-Air Attack 2/', 'Air Attack 2 ', 3);

        // ── Dust particles ────────────────────────────────────
        const dustBase = 'asset/Captain Clown Nose/Sprites/Dust Particles/';
        this.loadFrames('dust-jump', dustBase, 'Jump ', 6);
        this.loadFrames('dust-run',  dustBase, 'Run ',  5);
        this.loadFrames('dust-fall', dustBase, 'Fall ', 5);

        // ── Enemies ───────────────────────────────────────────
        // NOTE: All enemy sprite files use zero-padded names (01.png, 02.png …)
        //       so zeroPad=true (the default).
        const crabbyBase = 'asset/The Crusty Crew/Sprites/Crabby/';
        const fierceBase = 'asset/The Crusty Crew/Sprites/Fierce Tooth/';
        const pinkBase   = 'asset/The Crusty Crew/Sprites/Pink Star/';

        // Crabby
        this.loadFrames('crabby-idle',         crabbyBase + '01-Idle/',          'Idle ',            9);
        this.loadFrames('crabby-run',          crabbyBase + '02-Run/',           'Run ',             6);
        this.loadFrames('crabby-anticipation', crabbyBase + '06-Anticipation/',  'Anticipation ',    3);
        this.loadFrames('crabby-attack',       crabbyBase + '07-Attack/',        'Attack ',          4);
        this.loadFrames('crabby-hit',          crabbyBase + '08-Hit/',           'Hit ',             4);
        this.loadFrames('crabby-dead',         crabbyBase + '09-Dead Hit/',      'Dead Hit ',        4);
        this.loadFrames('crabby-dead-ground',  crabbyBase + '10-Dead Ground/',   'Dead Ground ',     4);

        // Fierce Tooth
        this.loadFrames('fierce-idle',         fierceBase + '01-Idle/',          'Idle ',            8);
        this.loadFrames('fierce-run',          fierceBase + '02-Run/',           'Run ',             6);
        this.loadFrames('fierce-anticipation', fierceBase + '06-Anticipation/',  'Anticipation ',    3);
        this.loadFrames('fierce-attack',       fierceBase + '07-Attack/',        'Attack ',          5);
        this.loadFrames('fierce-hit',          fierceBase + '08-Hit/',           'Hit ',             4);
        this.loadFrames('fierce-dead',         fierceBase + '09-Dead Hit/',      'Dead Hit ',        4);
        this.loadFrames('fierce-dead-ground',  fierceBase + '10-Dead Ground/',   'Dead Ground ',     4);

        // Pink Star (attack only has 4 frames; also has jump/fall/ground for rolling movement)
        this.loadFrames('pink-idle',           pinkBase + '01-Idle/',            'Idle ',            8);
        this.loadFrames('pink-run',            pinkBase + '02-Run/',             'Run ',             6);
        this.loadFrames('pink-jump',           pinkBase + '03-Jump/',            'Jump ',            3);
        this.loadFrames('pink-fall',           pinkBase + '04-Fall/',            'Fall ',            1);
        this.loadFrames('pink-ground',         pinkBase + '05-Ground/',          'Ground ',          2);
        this.loadFrames('pink-anticipation',   pinkBase + '06-Anticipation/',    'Anticipation ',    3);
        this.loadFrames('pink-attack',         pinkBase + '07-Attack/',          'Attack ',          4);
        this.loadFrames('pink-hit',            pinkBase + '08-Hit/',             'Hit ',             4);
        this.loadFrames('pink-dead',           pinkBase + '09-Dead Hit/',        'Dead Hit ',        4);
        this.loadFrames('pink-dead-ground',    pinkBase + '10-Dead Ground/',     'Dead Ground ',     4);

        // ── Collectibles (01.png naming, no prefix) ───────────
        const treasureBase = 'asset/Pirate Treasure/Sprites/';
        this.loadFrames('coin',    treasureBase + 'Gold Coin/',    '', 4);
        this.loadFrames('diamond', treasureBase + 'Blue Diamond/', '', 4);
        this.loadFrames('potion',  treasureBase + 'Red Potion/',   '', 7);
        this.loadFrames('skull',   treasureBase + 'Golden Skull/', '', 8);

        // Derila pillow
        this.load.image('derila', 'asset/derila-game.png');

        // Matsato knife
        this.load.image('matsato', 'asset/matsato-game.png');

        // Sinoshi shower head
        this.load.image('sinoshi', 'asset/sinoshi-game.png');

        // Ryoko wifi router
        this.load.image('ryoko', 'asset/ryoko-game.png');

        // ── Cannon traps ──────────────────────────────────────
        const cannonBase = 'asset/Shooter Traps/Sprites/Cannon/';
        this.load.image('cannon-idle', cannonBase + 'Cannon Idle/1.png');
        this.loadFrames('cannon-fire',       cannonBase + 'Cannon Fire/',          '', 6, false);
        this.load.image('cannonball',        cannonBase + 'Cannon Ball Idle/1.png');
        this.loadFrames('cannonball-explode', cannonBase + 'Cannon Ball Explosion/', '', 7, false);

        // ── Seashell trap ─────────────────────────────────────
        const shellBase = 'asset/Shooter Traps/Sprites/Seashell/';
        this.load.image('seashell-idle',     shellBase + 'Seashell Idle/1.png');
        this.loadFrames('seashell-opening',  shellBase + 'Seashell Opening/',  '', 5, false);
        this.loadFrames('seashell-fire',     shellBase + 'Seashell Fire/',     '', 6, false);
        this.loadFrames('seashell-hit',      shellBase + 'Seashell Hit/',      '', 4, false);
        this.loadFrames('seashell-dead',     shellBase + 'Seashell Destroyed/','', 5, false);
        this.load.image('pearl',             shellBase + 'Pearl Idle/1.png');
        this.loadFrames('pearl-dead',        shellBase + 'Pearl Destroyed/',   '', 3, false);

        // ── Totem traps ───────────────────────────────────────
        const totemBase = 'asset/Shooter Traps/Sprites/Totems/';
        [1, 2, 3].forEach(n => {
            const h = `${totemBase}Head ${n}/`;
            this.load.image(`totem${n}-idle`,   h + 'Idle 1/1.png');
            this.loadFrames(`totem${n}-attack`,  h + 'Attack 1/', '', 6, false);
            this.loadFrames(`totem${n}-hit`,     h + 'Hit 1/',    '', 4, false);
            this.loadFrames(`totem${n}-dead`,    h + 'Destroyed/','', 6, false);
        });
        this.load.image('wood-spike', totemBase + 'Wood Spike/Idle/1.png');

        // ── Environment ───────────────────────────────────────
        this.load.image('spikes', 'asset/Palm Tree Island/Sprites/Objects/Spikes/Spikes.png');

        const chestBase = 'asset/Palm Tree Island/Sprites/Objects/Chest/';
        this.loadFrames('chest-close', chestBase, 'Chest Close ', 10);
        this.loadFrames('chest-open',  chestBase, 'Chest Open ',  10);

        const flagBase = 'asset/Palm Tree Island/Sprites/Objects/Flag/';
        this.loadFrames('flag', flagBase, 'Flag ', 9);
        this.load.image('flag-platform', flagBase + 'Platform.png');

        // ── UI health bar ─────────────────────────────────────
        const uiBase = 'asset/Wood and Paper UI/Sprites/Life Bars/Small Bars/';
        this.loadFrames('health', uiBase, '', 5, false);

        // ── Wood & Paper UI — spritesheets (1 file per component) ─
        // Frame layout — 9-slice panels: 0=TL 1=TC 2=TR 3=ML 4=MC 5=MR 6=BL 7=BC 8=BR
        // Buttons (5 frames):  0=TL 1=TR 2=center 3=BL 4=BR
        // Banner (3 frames):   0=left_cap 1=center_tile 2=right_cap
        const UI2 = 'asset/Wood and Paper UI/';
        [
            ['ui-green-board',  32],
            ['ui-orange-paper', 32],
            ['ui-yellow-board', 32],
            ['ui-yellow-paper', 32],
        ].forEach(([key, fw]) =>
            this.load.spritesheet(key, `${UI2}${key}.png`, { frameWidth: fw, frameHeight: fw })
        );
        [
            ['ui-green-btn',  14],
            ['ui-yellow-btn', 14],
        ].forEach(([key, fw]) =>
            this.load.spritesheet(key, `${UI2}${key}.png`, { frameWidth: fw, frameHeight: fw })
        );
        this.load.spritesheet('ui-banner', `${UI2}ui-banner.png`, { frameWidth: 32, frameHeight: 32 });

        // ── Palm trees ────────────────────────────────────────
        const backPalmBase  = 'asset/Palm Tree Island/Sprites/Back Palm Trees/';
        this.loadFrames('back-palm-left',    backPalmBase, 'Back Palm Tree Left ',    4);
        this.loadFrames('back-palm-regular', backPalmBase, 'Back Palm Tree Regular ', 4);
        this.loadFrames('back-palm-right',   backPalmBase, 'Back Palm Tree Right ',   4);

        const frontPalmBase = 'asset/Palm Tree Island/Sprites/Front Palm Trees/';
        this.loadFrames('front-palm-top', frontPalmBase, 'Front Palm Tree Top ', 4);
        this.load.image('front-palm-bottom', frontPalmBase + 'Front Palm Bottom and Grass (32x32).png');

        // ── Sounds ────────────────────────────────────────────
        this.load.audio('jump',       'sound/jump.mp3');
        this.load.audio('fight',      'sound/fight.mp3');
        this.load.audio('hit',        'sound/fitght_hit.mp3');
        this.load.audio('music-game', 'sound/music_1.mp3');
        this.load.audio('music-menu', 'sound/music_2.mp3');
        this.load.audio('music-alt1', 'sound/music_3.mp3');
        this.load.audio('music-alt2', 'sound/music_4.mp3');

        // ── Door (goal for all levels) ────────────────────────────────
        const doorBase = 'asset/Pirate Ship/Sprites/Decorations/Door/';
        this.loadFrames('door-open',  doorBase + 'Opening/', '', 5);
        this.loadFrames('door-close', doorBase + 'Closing/', '', 5);

        // ── Level 2: Pirate Ship tilesets ─────────────────────────────
        this.load.spritesheet('pirate-terrain',
            'asset/Pirate Ship/Sprites/Tilesets/Terrain and Back Wall (32x32).png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('pirate-platform',
            'asset/Pirate Ship/Sprites/Tilesets/Platforms (32x32).png',
            { frameWidth: 32, frameHeight: 32 }
        );

        // ── Level 2: Pirate Ship decorations ──────────────────────────
        const chainBase  = 'asset/Pirate Ship/Sprites/Decorations/Chains/';
        this.loadFrames('chain-big',   chainBase + 'Big/',   '', 8);
        this.loadFrames('chain-small', chainBase + 'Small/', '', 8);
        this.loadFrames('candle', 'asset/Pirate Ship/Sprites/Decorations/Candle/Candle/', '', 6);

        // ── Level 3: Merchant Ship / Ocean decorations ────────────────
        this.loadFrames('anchor',       'asset/Merchant Ship/Sprites/Ship/Anchor/',          '', 2,  false);
        this.loadFrames('sail-wind',    'asset/Merchant Ship/Sprites/Ship/Sail/Wind/',       '', 4,  false);
        this.loadFrames('water-splash', 'asset/Merchant Ship/Sprites/Water/Water Splash 1/', '', 5,  false);
    }

    // ──────────────────────────────────────────────────────────
    // HELPER: Load a numbered sequence of frame images
    //   keyPrefix  — e.g. 'player-idle' → keys 'player-idle-1', 'player-idle-2', …
    //   path       — directory with trailing slash
    //   prefix     — filename prefix before the number, e.g. 'Idle ' or ''
    //   count      — number of frames
    //   zeroPad    — true → '01.png', '02.png' …; false → '1.png', '2.png' …
    // ──────────────────────────────────────────────────────────
    loadFrames(keyPrefix, path, prefix, count, zeroPad = true) {
        for (let i = 1; i <= count; i++) {
            const num  = zeroPad ? String(i).padStart(2, '0') : String(i);
            const key  = keyPrefix + '-' + i;
            const file = path + prefix + num + '.png';
            this.load.image(key, file);
        }
    }

    // ──────────────────────────────────────────────────────────
    // HELPER: Build array of keys ['prefix-1', 'prefix-2', …, 'prefix-N']
    // ──────────────────────────────────────────────────────────
    frameKeys(prefix, count) {
        const keys = [];
        for (let i = 1; i <= count; i++) keys.push(prefix + '-' + i);
        return keys;
    }

    // ──────────────────────────────────────────────────────────
    // HELPER: Create a Phaser animation from texture key array
    // Each frame uses frame:0 (required for single-image textures)
    // ──────────────────────────────────────────────────────────
    makeAnim(key, frameKeys, frameRate, repeat) {
        const frames = frameKeys.map(k => ({ key: k, frame: 0 }));
        this.anims.create({ key, frames, frameRate, repeat });
    }

    create() {
        // =====================================================
        // CREATE ALL ANIMATIONS
        // =====================================================

        // ── Player (without sword) ────────────────────────────
        this.makeAnim('player-idle',        this.frameKeys('player-idle', 5),         8,  -1);
        this.makeAnim('player-run',         this.frameKeys('player-run', 6),          10, -1);
        this.makeAnim('player-jump',        this.frameKeys('player-jump', 3),         10,  0);
        this.makeAnim('player-fall',        this.frameKeys('player-fall', 1),         8,   0);
        this.makeAnim('player-ground',      this.frameKeys('player-ground', 2),       8,   0);
        this.makeAnim('player-hit',         this.frameKeys('player-hit', 4),          10,  0);
        this.makeAnim('player-dead-hit',    this.frameKeys('player-dead-hit', 4),     8,   0);
        this.makeAnim('player-dead-ground', this.frameKeys('player-dead-ground', 4),  8,   0);

        // ── Player — sword attacks ─────────────────────────────
        this.makeAnim('player-attack1',     this.frameKeys('player-attack1', 3),      12,  0);
        this.makeAnim('player-attack2',     this.frameKeys('player-attack2', 3),      12,  0);
        this.makeAnim('player-attack3',     this.frameKeys('player-attack3', 3),      12,  0);
        this.makeAnim('player-air-attack1', this.frameKeys('player-air-attack1', 3),  12,  0);
        this.makeAnim('player-air-attack2', this.frameKeys('player-air-attack2', 3),  12,  0);

        // ── Crabby ────────────────────────────────────────────
        this.makeAnim('crabby-idle',         this.frameKeys('crabby-idle', 9),         8,  -1);
        this.makeAnim('crabby-run',          this.frameKeys('crabby-run', 6),          10, -1);
        this.makeAnim('crabby-anticipation', this.frameKeys('crabby-anticipation', 3), 8,   0);
        this.makeAnim('crabby-attack',       this.frameKeys('crabby-attack', 4),       10,  0);
        this.makeAnim('crabby-hit',          this.frameKeys('crabby-hit', 4),          10,  0);
        this.makeAnim('crabby-dead',         this.frameKeys('crabby-dead', 4),         8,   0);
        this.makeAnim('crabby-dead-ground',  this.frameKeys('crabby-dead-ground', 4),  6,   0);

        // ── Fierce Tooth ──────────────────────────────────────
        this.makeAnim('fierce-idle',         this.frameKeys('fierce-idle', 8),         8,  -1);
        this.makeAnim('fierce-run',          this.frameKeys('fierce-run', 6),          10, -1);
        this.makeAnim('fierce-anticipation', this.frameKeys('fierce-anticipation', 3), 8,   0);
        this.makeAnim('fierce-attack',       this.frameKeys('fierce-attack', 5),       10,  0);
        this.makeAnim('fierce-hit',          this.frameKeys('fierce-hit', 4),          10,  0);
        this.makeAnim('fierce-dead',         this.frameKeys('fierce-dead', 4),         8,   0);
        this.makeAnim('fierce-dead-ground',  this.frameKeys('fierce-dead-ground', 4),  6,   0);

        // ── Pink Star ─────────────────────────────────────────
        this.makeAnim('pink-idle',           this.frameKeys('pink-idle', 8),           8,  -1);
        this.makeAnim('pink-run',            this.frameKeys('pink-run', 6),            10, -1);
        this.makeAnim('pink-jump',           this.frameKeys('pink-jump', 3),           10,  0);
        this.makeAnim('pink-fall',           this.frameKeys('pink-fall', 1),           8,   0);
        this.makeAnim('pink-ground',         this.frameKeys('pink-ground', 2),         8,   0);
        this.makeAnim('pink-anticipation',   this.frameKeys('pink-anticipation', 3),   8,   0);
        this.makeAnim('pink-attack',         this.frameKeys('pink-attack', 4),         10,  0);
        this.makeAnim('pink-hit',            this.frameKeys('pink-hit', 4),            10,  0);
        this.makeAnim('pink-dead',           this.frameKeys('pink-dead', 4),           8,   0);
        this.makeAnim('pink-dead-ground',    this.frameKeys('pink-dead-ground', 4),    6,   0);

        // ── Collectibles ──────────────────────────────────────
        this.makeAnim('coin-spin',    this.frameKeys('coin', 4),    8,  -1);
        this.makeAnim('diamond-spin', this.frameKeys('diamond', 4), 8,  -1);
        this.makeAnim('potion-idle',  this.frameKeys('potion', 7),  6,  -1);
        this.makeAnim('skull-idle',   this.frameKeys('skull', 8),   8,  -1);

        // ── Cannon ────────────────────────────────────────────
        this.makeAnim('cannon-fire',       this.frameKeys('cannon-fire', 6),       12, 0);
        this.makeAnim('cannonball-explode', this.frameKeys('cannonball-explode', 7), 12, 0);

        // ── Seashell ──────────────────────────────────────────
        this.makeAnim('seashell-opening', this.frameKeys('seashell-opening', 5), 8,  0);
        this.makeAnim('seashell-fire',    this.frameKeys('seashell-fire',    6), 10, 0);
        this.makeAnim('seashell-hit',     this.frameKeys('seashell-hit',     4), 10, 0);
        this.makeAnim('seashell-dead',    this.frameKeys('seashell-dead',    5), 8,  0);
        this.makeAnim('pearl-dead',       this.frameKeys('pearl-dead',       3), 12, 0);

        // ── Totems ────────────────────────────────────────────
        [1, 2, 3].forEach(n => {
            this.makeAnim(`totem${n}-attack`, this.frameKeys(`totem${n}-attack`, 6), 10, 0);
            this.makeAnim(`totem${n}-hit`,    this.frameKeys(`totem${n}-hit`,    4), 10, 0);
            this.makeAnim(`totem${n}-dead`,   this.frameKeys(`totem${n}-dead`,   6), 8,  0);
        });

        // ── Chest / Flag ──────────────────────────────────────
        this.makeAnim('chest-closed',  this.frameKeys('chest-close', 10), 4,  -1);
        this.makeAnim('chest-opening', this.frameKeys('chest-open', 10),  8,   0);
        this.makeAnim('flag-wave',     this.frameKeys('flag', 9),         10, -1);

        // ── Dust ──────────────────────────────────────────────
        this.makeAnim('dust-jump', this.frameKeys('dust-jump', 6), 12, 0);
        this.makeAnim('dust-run',  this.frameKeys('dust-run', 5),  12, 0);
        this.makeAnim('dust-fall', this.frameKeys('dust-fall', 5), 12, 0);

        // ── Palm trees ────────────────────────────────────────
        this.makeAnim('back-palm-left',    this.frameKeys('back-palm-left', 4),    5, -1);
        this.makeAnim('back-palm-regular', this.frameKeys('back-palm-regular', 4), 5, -1);
        this.makeAnim('back-palm-right',   this.frameKeys('back-palm-right', 4),   5, -1);
        this.makeAnim('front-palm-top',    this.frameKeys('front-palm-top', 4),    5, -1);

        // ── Door ─────────────────────────────────────────────────────
        this.makeAnim('door-open',  this.frameKeys('door-open',  5), 10, 0);
        this.makeAnim('door-close', this.frameKeys('door-close', 5), 8, -1);

        // ── Pirate Ship decorations ───────────────────────────────────
        this.makeAnim('chain-big',   this.frameKeys('chain-big',   8), 8, -1);
        this.makeAnim('chain-small', this.frameKeys('chain-small', 8), 8, -1);
        this.makeAnim('candle',      this.frameKeys('candle',      6), 8, -1);

        // ── Ocean / Merchant Ship ─────────────────────────────────────
        this.makeAnim('anchor',       this.frameKeys('anchor',       2), 4, -1);
        this.makeAnim('sail-wind',    this.frameKeys('sail-wind',    4), 6, -1);
        this.makeAnim('water-splash', this.frameKeys('water-splash', 5), 8, -1);

        // ── Initialize registry & start menu ─────────────────
        GameRegistry.init(this.game);
        this.scene.start('MenuScene');
    }
}
