// ============================================================
// Level2Data.js — Level 2: Pirate Ship Interior
// ============================================================

const Level2Data = Object.freeze({
    visual: {
        skyColor:        0x0D0A18,
        bgKey:           null,
        bgScrollRate:    0,
        bgScaleToHeight: false,
        hasClouds:       false,
        cloudPositions:  [],
        hasWaterPits:    false,
        waterColor:      0x000000,
        waterTopColor:   0x000000,
        hasBackPalms:    false,
        borderFrame:     false,
        ambientOverlay:  { color: 0x000020, alpha: 0.28 },
        musicKey:        'music-alt1',
    },
    worldW:     4800,
    worldH:     1280,
    groundRow:  35,
    groundTerrainKey: 'pirate-terrain',
    groundTopFrame:   0,
    groundFillFrame:  1,
    movingPlatforms:  null,
    frontPalms:       null,
    backPalms:        null,

    ground: [
        [0,  75],
        [80, 70],
    ],

    platforms: [
        [5,  32, 4, 'pirate-platform', 0], [13, 31, 3, 'pirate-platform', 0],
        [20, 33, 5, 'pirate-platform', 0], [28, 30, 3, 'pirate-platform', 0],
        [36, 31, 4, 'pirate-platform', 0], [44, 29, 3, 'pirate-platform', 0],
        [50, 31, 5, 'pirate-platform', 0], [59, 28, 4, 'pirate-platform', 0],
        [66, 30, 4, 'pirate-platform', 0],
        [82, 30, 5, 'pirate-platform', 0], [91, 28, 4, 'pirate-platform', 0],
        [98, 26, 5, 'pirate-platform', 0], [107,28, 4, 'pirate-platform', 0],
        [115,30, 5, 'pirate-platform', 0],
        [88, 25, 3, 'pirate-platform', 0], [96, 23, 4, 'pirate-platform', 0],
        [104,24, 5, 'pirate-platform', 0], [113,23, 8, 'pirate-platform', 0],
    ],

    waterPits: [],

    decorations: [
        { key: 'chain-big',   worldX: 200,  worldY: 700, scale: 1.5, depth: -4, animKey: 'chain-big'   },
        { key: 'chain-small', worldX: 600,  worldY: 650, scale: 1.2, depth: -4, animKey: 'chain-small' },
        { key: 'chain-big',   worldX: 1100, worldY: 720, scale: 1.5, depth: -4, animKey: 'chain-big'   },
        { key: 'chain-small', worldX: 1550, worldY: 680, scale: 1.2, depth: -4, animKey: 'chain-small' },
        { key: 'chain-big',   worldX: 2000, worldY: 700, scale: 1.5, depth: -4, animKey: 'chain-big'   },
        { key: 'chain-small', worldX: 2450, worldY: 650, scale: 1.2, depth: -4, animKey: 'chain-small' },
        { key: 'chain-big',   worldX: 2900, worldY: 710, scale: 1.5, depth: -4, animKey: 'chain-big'   },
        { key: 'chain-small', worldX: 3350, worldY: 670, scale: 1.2, depth: -4, animKey: 'chain-small' },
        { key: 'chain-big',   worldX: 3800, worldY: 700, scale: 1.5, depth: -4, animKey: 'chain-big'   },
        { key: 'chain-small', worldX: 4250, worldY: 660, scale: 1.2, depth: -4, animKey: 'chain-small' },
        { key: 'candle', worldX: 300,  worldY: 1110, scale: 1.5, depth: 2, animKey: 'candle' },
        { key: 'candle', worldX: 750,  worldY: 1110, scale: 1.5, depth: 2, animKey: 'candle' },
        { key: 'candle', worldX: 1200, worldY: 1110, scale: 1.5, depth: 2, animKey: 'candle' },
        { key: 'candle', worldX: 1650, worldY: 1110, scale: 1.5, depth: 2, animKey: 'candle' },
        { key: 'candle', worldX: 2100, worldY: 1110, scale: 1.5, depth: 2, animKey: 'candle' },
        { key: 'candle', worldX: 2550, worldY: 1110, scale: 1.5, depth: 2, animKey: 'candle' },
        { key: 'candle', worldX: 3000, worldY: 1110, scale: 1.5, depth: 2, animKey: 'candle' },
        { key: 'candle', worldX: 3450, worldY: 1110, scale: 1.5, depth: 2, animKey: 'candle' },
    ],

    enemies: [
        [ 8, 33, 'crabby',  60], [16, 30, 'fierce',  60], [24, 32, 'fierce', 60],
        [32, 29, 'pink',    50], [40, 30, 'fierce',  60], [54, 27, 'pink',   50],
        [62, 29, 'fierce',  60],
        [84, 29, 'fierce',  60], [93, 27, 'pink',    50], [101,25, 'fierce', 60],
        [109,29, 'fierce',  60], [115,22, 'pink',    50], [120,22, 'fierce', 60],
    ],

    coinArcs: [
        [ 6, 32, 3, 1], [14, 31, 3, 1], [21, 33, 4, 1],
        [29, 30, 3, 1], [37, 31, 3, 1], [45, 29, 3, 1],
        [51, 31, 4, 1], [60, 28, 3, 1], [67, 30, 3, 1],
        [83, 30, 4, 1], [92, 28, 3, 1], [99, 26, 4, 1],
        [108,28, 3, 1], [116,30, 4, 1],
        [89, 25, 3, 1], [97, 23, 3, 1], [105,24, 4, 1], [114,23, 5, 1],
    ],

    diamonds: [
        [30, 29], [67, 28], [95, 25], [115, 22],
    ],

    derila: [
        [40, 28], [88, 24], [114, 21],
    ],

    potions: [
        [22, 32], [82, 29], [107, 27],
    ],

    spikes: [
        [75, 35], [76, 35], [77, 35], [78, 35], [79, 35],
        [18, 34], [46, 34], [68, 34],
        [90, 34], [110, 34],
    ],

    cannons: [],

    chestCol: 119, chestRow: 23,
    doorCol:  122, doorRow:  24,

    playerStart: { col: 3, row: 34 },
});
