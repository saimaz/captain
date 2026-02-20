// ============================================================
// Level3Data.js — Level 3: Ocean Crossing
// ============================================================

const Level3Data = Object.freeze({
    visual: {
        skyColor:        0x1A3A5C,
        bgKey:           'bg-water',
        bgScrollRate:    0.15,
        bgScaleToHeight: true,
        hasClouds:       true,
        cloudPositions: [
            [100, 50, 0], [450, 35, 2], [900, 60, 1], [1400, 45, 3],
            [1900, 55, 0], [2500, 38, 2], [3100, 65, 1], [3700, 48, 3],
            [4300, 40, 0], [4900, 62, 2], [5400, 52, 1], [5900, 42, 3],
            [6200, 58, 0],
        ],
        hasWaterPits:  true,
        waterColor:    0x0D3B57,
        waterTopColor: 0x1A6B8A,
        hasBackPalms:  false,
        borderFrame:   false,
        ambientOverlay: null,
        musicKey:      'music-alt2',
    },
    worldW:     6400,
    worldH:     1280,
    groundRow:  35,
    groundTerrainKey: 'terrain',
    groundTopFrame:   1,
    groundFillFrame:  7,
    frontPalms:  null,
    backPalms:   null,
    decorations: null,

    ground: [
        [0,  15],
        [185, 15],
    ],

    platforms: [
        [2,  33, 4], [8,  31, 4],
        [187,32, 4], [192,30, 5], [197,28, 8],
    ],

    movingPlatforms: [
        { col: 18,  row: 33, width: 8,  moveAxis: 'x', rangeMin:  18*32, rangeMax:  26*32, speed: 25,  terrainKey: 'terrain', frame: 1 },
        { col: 32,  row: 32, width: 6,  moveAxis: 'x', rangeMin:  30*32, rangeMax:  40*32, speed: 40,  terrainKey: 'terrain', frame: 1 },
        { col: 48,  row: 33, width: 10, moveAxis: 'x', rangeMin:  45*32, rangeMax:  58*32, speed: 20,  terrainKey: 'terrain', frame: 1 },
        { col: 65,  row: 31, width: 7,  moveAxis: 'x', rangeMin:  62*32, rangeMax:  74*32, speed: 35,  terrainKey: 'terrain', frame: 1 },
        { col: 82,  row: 32, width: 8,  moveAxis: 'x', rangeMin:  79*32, rangeMax:  92*32, speed: 30,  terrainKey: 'terrain', frame: 1 },
        { col: 84,  row: 30, width: 4,  moveAxis: 'x', rangeMin:  79*32, rangeMax:  92*32, speed: 30,  terrainKey: 'terrain', frame: 1 },
        { col: 100, row: 33, width: 7,  moveAxis: 'x', rangeMin:  97*32, rangeMax: 110*32, speed: 45,  terrainKey: 'terrain', frame: 1 },
        { col: 118, row: 32, width: 12, moveAxis: 'x', rangeMin: 115*32, rangeMax: 130*32, speed: 18,  terrainKey: 'terrain', frame: 1 },
        { col: 138, row: 33, width: 7,  moveAxis: 'x', rangeMin: 135*32, rangeMax: 148*32, speed: 38,  terrainKey: 'terrain', frame: 1 },
        { col: 155, row: 32, width: 8,  moveAxis: 'x', rangeMin: 152*32, rangeMax: 165*32, speed: 25,  terrainKey: 'terrain', frame: 1 },
        { col: 172, row: 33, width: 10, moveAxis: 'x', rangeMin: 169*32, rangeMax: 183*32, speed: 22,  terrainKey: 'terrain', frame: 1 },
    ],

    waterPits: [
        [15 * 32, 185 * 32],
    ],

    enemies: [
        [  5, 34, 'crabby', 80], [10, 30, 'fierce', 60],
        [122, 31, 'fierce', 80], [126,31, 'crabby', 60],
        [188, 31, 'fierce', 60], [193,29, 'pink',   50], [197,27, 'fierce', 60],
    ],

    coinArcs: [
        [3,  34, 3, 1], [9,  31, 3, 1],
        [119,32, 4, 1], [123,31, 3, 1],
        [188,32, 3, 1], [193,30, 3, 1], [198,28, 5, 1],
    ],

    diamonds: [
        [8, 30], [120, 31], [192, 29], [197, 27],
    ],

    derila: [
        [10, 30], [119, 30], [197, 26],
    ],

    potions: [
        [5, 33], [125, 30], [193, 28],
    ],

    spikes: [
        [4, 34], [12, 34],
        [190, 34], [195, 34],
    ],

    cannons: [],

    chestCol: 196, chestRow: 28,
    doorCol:  199, doorRow:  27,

    playerStart: { col: 3, row: 34 },
});
