// ============================================================
// Level1Data.js — All static data for Level 1
// Seven zones: Shore → Jungle → Tidal Pools → Ancient Ruins
//              → Cliff Face → Storm Ridge → The Lookout
// World: 352 cols × 32px = 11264px wide
// ============================================================

const Level1Data = Object.freeze({

    visual: {
        skyColor:        0xD4690A,
        bgKey:           'bg-main',
        bgScrollRate:    0.2,
        bgScaleToHeight: true,
        hasClouds:       true,
        cloudPositions: [
            [100,55,0],[480,40,1],[860,65,2],[1240,48,3],[1620,60,0],
            [2000,38,1],[2380,70,2],[2760,50,3],[3140,42,0],[3520,65,1],
            [3900,55,2],[4280,44,3],[4660,68,0],[5040,52,1],[5420,40,2],
            [5800,58,3],[6180,45,0],[6560,62,1],[6940,48,2],[7320,55,3],
            [7700,42,0],[8080,60,1],[8460,50,2],[8840,44,3],[9220,65,0],
            [9600,38,1],[9980,55,2],[10360,48,3],[10740,42,0],
        ],
        hasWaterPits:  true,
        waterColor:    0x1A6B8A,
        waterTopColor: 0x2FA8C4,
        hasBackPalms:  true,
        borderFrame:   true,
        ambientOverlay: null,
        musicKey:      'music-game',
    },
    worldW:     11264,
    worldH:     1280,
    groundRow:  35,
    groundTerrainKey: 'terrain',
    groundTopFrame:   1,
    groundFillFrame:  7,
    movingPlatforms:  null,
    decorations:      null,
    playerStart: { col: 3, row: 34 },

    // ── Ground segments ──────────────────────────────────────
    // [startCol, widthInTiles] — row 35 (grass) + row 36 (fill)
    ground: [
        [0,   53],   // Zone 1 – The Shore
        [58,  51],   // Zone 2 – The Jungle
        [114, 52],   // Zone 3 – Tidal Pools
        [171, 50],   // Zone 4 – Ancient Ruins
        [226, 50],   // Zone 5 – Cliff Face
        [281, 45],   // Zone 6 – Storm Ridge
        [331, 20],   // Zone 7 – The Lookout
    ],

    // ── Elevated platforms ────────────────────────────────────
    // [startCol, row, widthInTiles, terrainKey?, frame?]
    // Multi-height blocks: top row = grass (default frame 1),
    // lower rows use fill frame: [col, row, w, null, 7]
    platforms: [
        // ── Zone 1 – The Shore (easy intro, single-height) ──
        [6,  33, 3],
        [12, 32, 4],
        [19, 33, 3],
        [25, 31, 4],
        [32, 33, 5],
        [39, 32, 3],
        [44, 31, 4],
        [50, 33, 3],
        [35, 24, 3],                    // secret high platform (derila)

        // ── Zone 2 – The Jungle (2-high blocks) ─────────────
        [61, 31, 4],
        [61, 32, 4, null, 7],
        [69, 30, 5],
        [69, 31, 5, null, 7],
        [78, 32, 4],
        [78, 33, 4, null, 7],
        [85, 29, 4],
        [85, 30, 4, null, 7],
        [93, 31, 5],
        [93, 32, 5, null, 7],
        [101, 30, 4],
        [101, 31, 4, null, 7],
        [107, 32, 3],
        [75, 22, 3],                    // secret canopy (derila)

        // ── Zone 3 – Tidal Pools (varied, 4-high tower) ─────
        [117, 33, 4],
        [120, 32, 3],
        [124, 31, 5],
        [132, 30, 3],
        [136, 33, 3],
        [140, 28, 3],                   // tower top
        [140, 29, 3, null, 7],
        [140, 30, 3, null, 7],
        [140, 31, 3, null, 7],
        [147, 32, 4],
        [149, 29, 3],
        [153, 30, 5],
        [153, 31, 5, null, 7],
        [158, 33, 3],
        [161, 31, 4],
        [164, 32, 4],

        // ── Zone 4 – Ancient Ruins (L-shapes, tall towers) ──
        [174, 33, 5],
        [174, 34, 5, null, 7],
        [179, 30, 3],
        [182, 31, 4],
        [182, 32, 4, null, 7],
        [189, 29, 3],
        [189, 30, 3, null, 7],
        [189, 31, 3, null, 7],
        [195, 33, 6],
        [197, 28, 4],
        [204, 30, 4],
        [204, 31, 4, null, 7],
        [204, 32, 4, null, 7],
        [211, 28, 3],
        [211, 29, 3, null, 7],
        [216, 32, 5],
        [216, 33, 5, null, 7],
        [200, 20, 3],                   // hidden alcove (derila)

        // ── Zone 5 – Cliff Face (ascending staircase) ───────
        [229, 33, 5],
        [229, 34, 5, null, 7],
        [234, 33, 3],
        [237, 31, 5],
        [237, 32, 5, null, 7],
        [240, 34, 3],
        [245, 29, 5],
        [245, 30, 5, null, 7],
        [253, 27, 5],
        [253, 28, 5, null, 7],
        [261, 25, 5],
        [261, 26, 5, null, 7],
        [265, 33, 3],
        [268, 33, 4],
        [270, 30, 3],                   // secret side alcove (derila)
        [273, 28, 3],

        // ── Zone 6 – Storm Ridge (dense, spiky) ─────────────
        [284, 33, 4],
        [286, 30, 3],
        [289, 31, 4],
        [289, 32, 4, null, 7],
        [293, 28, 3],
        [296, 33, 5],
        [299, 33, 3],
        [303, 29, 3],                   // 3-high central tower
        [303, 30, 3, null, 7],
        [303, 31, 3, null, 7],
        [309, 32, 4],
        [309, 33, 4, null, 7],
        [312, 28, 3],
        [315, 30, 5],
        [315, 31, 5, null, 7],
        [319, 28, 3],
        [322, 33, 4],
        [307, 18, 3],                   // secret above the storm (derila)

        // ── Zone 7 – The Lookout (victory stretch) ──────────
        [334, 33, 4],
        [339, 31, 3],
        [346, 27, 4],                   // door tower top
        [346, 28, 4, null, 7],
        [346, 29, 4, null, 7],
        [346, 30, 4, null, 7],
        [346, 31, 4, null, 7],
    ],

    // ── Front palm decorations ────────────────────────────────
    // [col, row] — placed just above platform surface
    frontPalms: [
        // Zone 1
        [6, 33], [19, 33], [44, 31],
        // Zone 2
        [61, 31], [69, 30], [85, 29], [101, 30],
        // Zone 3
        [117, 33], [132, 30], [153, 30], [161, 31],
        // Zone 4
        [174, 33], [189, 29], [204, 30], [216, 32],
        // Zone 5
        [237, 31], [253, 27], [261, 25],
        // Zone 6
        [289, 31], [303, 29], [315, 30],
        // Zone 7
        [346, 27],
    ],

    // ── Water pit gaps ────────────────────────────────────────
    // [x1Pixels, x2Pixels] — teal fill between zones
    waterPits: [
        [53  * 32, 58  * 32],   // Shore → Jungle
        [109 * 32, 114 * 32],   // Jungle → Tidal Pools
        [166 * 32, 171 * 32],   // Tidal Pools → Ancient Ruins
        [221 * 32, 226 * 32],   // Ancient Ruins → Cliff Face
        [276 * 32, 281 * 32],   // Cliff Face → Storm Ridge
        [326 * 32, 331 * 32],   // Storm Ridge → The Lookout
    ],

    // ── Back palm tree decorations ────────────────────────────
    // [worldX, variantIndex(0-2), scale]
    backPalms: [
        [100,  1, 2.2], [375,  2, 2.0], [650,  0, 2.4], [925,  1, 1.9],
        [1200, 2, 2.2], [1475, 0, 2.0], [1750, 1, 2.3], [2025, 2, 1.8],
        [2300, 0, 2.1], [2575, 1, 2.3], [2850, 2, 2.0], [3125, 0, 2.2],
        [3400, 1, 1.9], [3675, 2, 2.4], [3950, 0, 2.1], [4225, 1, 2.0],
        [4500, 2, 2.3], [4775, 0, 1.8], [5050, 1, 2.2], [5325, 2, 2.0],
        [5600, 0, 2.4], [5875, 1, 2.1], [6150, 2, 1.9], [6425, 0, 2.3],
        [6700, 1, 2.0], [6975, 2, 2.2], [7250, 0, 2.1], [7525, 1, 2.4],
        [7800, 2, 2.0], [8075, 0, 1.9], [8350, 1, 2.3], [8625, 2, 2.1],
        [8900, 0, 2.0], [9175, 1, 2.2], [9450, 2, 1.8], [9725, 0, 2.4],
        [10000, 1, 2.1], [10275, 2, 2.0], [10550, 0, 2.3], [10825, 1, 1.9],
        [11100, 2, 2.2],
    ],

    // ── Enemies ────────────────────────────────────────────────
    // [col, row, type, patrolRange]
    // Rule: all enemies placed on ground (row 34) only
    enemies: [
        // Zone 1 – The Shore (crabbies only)
        [10,  34, 'crabby',  80],
        [24,  34, 'crabby',  80],
        [36,  34, 'crabby', 100],
        [48,  34, 'crabby',  80],

        // Zone 2 – The Jungle (crabbies + fierce)
        [64,  34, 'crabby',  80],
        [72,  34, 'fierce',  80],
        [82,  34, 'crabby',  80],
        [88,  34, 'fierce',  80],
        [98,  34, 'fierce',  80],

        // Zone 3 – Tidal Pools (first pink stars)
        [119, 34, 'crabby',  80],
        [127, 34, 'fierce',  80],
        [137, 34, 'crabby',  80],
        [141, 34, 'pink',    80],
        [155, 34, 'fierce',  80],
        [163, 34, 'pink',    80],

        // Zone 4 – Ancient Ruins (fierce + pink)
        [177, 34, 'fierce',  80],
        [190, 34, 'pink',    80],
        [196, 34, 'fierce',  80],
        [207, 34, 'pink',    80],
        [213, 34, 'pink',    80],

        // Zone 5 – Cliff Face (ascending battle)
        [232, 34, 'crabby',  80],
        [240, 34, 'fierce',  80],
        [248, 34, 'pink',    80],
        [256, 34, 'pink',    80],
        [263, 34, 'pink',    80],

        // Zone 6 – Storm Ridge (densest enemies)
        [287, 34, 'fierce',  80],
        [292, 34, 'pink',    80],
        [300, 34, 'fierce',  80],
        [304, 34, 'pink',    80],
        [313, 34, 'pink',    80],
        [320, 34, 'pink',    80],

        // Zone 7 – The Lookout (final guardians)
        [336, 34, 'fierce',  80],
        [343, 34, 'fierce',  80],
    ],

    // ── Coin arcs ─────────────────────────────────────────────
    // [startCol, platRow, count, spacing]
    coinArcs: [
        // Zone 1 – The Shore
        [2,  35, 4, 1], [7,  33, 3, 1], [13, 32, 3, 1],
        [16, 35, 3, 1], [20, 33, 3, 1], [26, 31, 3, 1],
        [33, 33, 3, 1], [40, 32, 3, 1], [45, 31, 3, 1],

        // Zone 2 – The Jungle
        [58, 35, 3, 1], [62, 31, 3, 1], [70, 30, 4, 1],
        [79, 32, 3, 1], [86, 29, 3, 1], [94, 31, 4, 1],
        [102, 30, 3, 1], [107, 32, 3, 1],

        // Zone 3 – Tidal Pools
        [114, 35, 4, 1], [118, 33, 3, 1], [125, 31, 4, 1],
        [133, 30, 3, 1], [148, 32, 3, 1], [150, 29, 3, 1],
        [154, 30, 4, 1], [162, 31, 3, 1],

        // Zone 4 – Ancient Ruins
        [171, 35, 4, 1], [175, 33, 4, 1], [183, 31, 3, 1],
        [190, 29, 3, 1], [196, 33, 5, 1], [205, 30, 3, 1],
        [212, 28, 3, 1], [217, 32, 4, 1],

        // Zone 5 – Cliff Face
        [226, 35, 3, 1], [230, 33, 4, 1], [238, 31, 4, 1],
        [246, 29, 4, 1], [254, 27, 4, 1], [262, 25, 4, 1],
        [269, 33, 3, 1], [271, 30, 3, 1],

        // Zone 6 – Storm Ridge
        [281, 35, 4, 1], [285, 33, 3, 1], [290, 31, 3, 1],
        [297, 33, 4, 1], [304, 29, 3, 1], [310, 32, 3, 1],
        [316, 30, 4, 1], [323, 33, 3, 1],

        // Zone 7 – The Lookout
        [331, 35, 3, 1], [335, 33, 3, 1], [340, 31, 3, 1],
        [343, 35, 3, 1],
    ],

    // ── Diamonds ─────────────────────────────────────────────
    // [col, row]
    diamonds: [
        [25, 30],                       // Zone 1
        [86, 28], [102, 29],            // Zone 2
        [132, 29], [161, 30],           // Zone 3
        [189, 28], [204, 29], [216, 31],// Zone 4
        [253, 26], [273, 27],           // Zone 5
        [303, 28], [319, 27],           // Zone 6
        [339, 30], [348, 26],           // Zone 7
    ],

    // ── Derila pillows ────────────────────────────────────────
    // [col, row]
    derila: [
        [36,  23],                      // Zone 1 – secret high platform
        [76,  21],                      // Zone 2 – canopy secret
        [142, 27], [160, 30],           // Zone 3 – tower top + extra
        [201, 19],                      // Zone 4 – hidden alcove
        [271, 29],                      // Zone 5 – side alcove
        [308, 17],                      // Zone 6 – above the storm
    ],

    // ── Ryoko wifi routers ────────────────────────────────────
    // [col, row] — rare collectible (250pts)
    ryoko: [
        [32,  33],                      // Zone 1 – shore platform
        [78,  29],                      // Zone 2 – jungle high
        [136, 32],                      // Zone 3 – tidal pool ledge
        [179, 29],                      // Zone 4 – ruins block
        [237, 30],                      // Zone 5 – cliff step
        [286, 29],                      // Zone 6 – storm ridge
        [334, 32],                      // Zone 7 – lookout approach
    ],

    // ── Sinoshi shower heads ──────────────────────────────────
    // [col, row] — rare collectible (250pts), alternates with matsato per zone
    sinoshi: [
        [12,  31],                      // Zone 1 – low platform
        [101, 29],                      // Zone 2 – jungle block
        [124, 30],                      // Zone 3 – tidal pool
        [211, 27],                      // Zone 4 – ruins tower
        [261, 24],                      // Zone 5 – cliff top
        [293, 27],                      // Zone 6 – storm ridge
        [339, 30],                      // Zone 7 – lookout
    ],

    // ── Matsato knives ────────────────────────────────────────
    // [col, row] — rare high-value collectible (250pts), on secret/elevated platforms
    matsato: [
        [45,  30],                      // Zone 1 – platform ledge
        [85,  28],                      // Zone 2 – jungle high
        [149, 28],                      // Zone 3 – tidal tower
        [197, 27],                      // Zone 4 – ruins alcove
        [253, 26],                      // Zone 5 – cliff top
        [312, 27],                      // Zone 6 – storm ridge high
        [346, 26],                      // Zone 7 – door tower
    ],

    // ── Potions ────────────────────────────────────────────────
    // [col, row]
    potions: [
        [50,  32],                      // Zone 1
        [158, 32],                      // Zone 3
        [195, 32],                      // Zone 4
        [268, 32],                      // Zone 5
        [347, 26],                      // Zone 7
    ],

    // ── Spike traps ────────────────────────────────────────────
    // [col, row]
    spikes: [
        // Zone 1
        [10,  34], [32,  34],
        // Zone 2
        [66,  34], [82,  34], [96,  34],
        // Zone 3
        [119, 34], [130, 34], [150, 34],
        // Zone 4
        [180, 34], [193, 28], [198, 34], [210, 34],
        // Zone 5
        [235, 34], [250, 34], [260, 34],
        // Zone 6
        [288, 34], [301, 34], [314, 29], [318, 34], [324, 34],
    ],

    // ── Cannons ────────────────────────────────────────────────
    // [col, row, 'left'|'right']
    cannons: [],

    traps: [],

    // ── Goals ────────────────────────────────────────────────
    chestCol: 347, chestRow: 28,
    doorCol:  349, doorRow:  27,
});
