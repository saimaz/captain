// ============================================================
// UIHelper — reusable sprite-based UI building blocks
//
// Spritesheets (one file per component, frameWidth = tile size):
//   ui-green-board / ui-orange-paper / ui-yellow-board / ui-yellow-paper
//     → 9 frames (32×32 each):  0=TL 1=TC 2=TR 3=ML 4=MC 5=MR 6=BL 7=BC 8=BR
//   ui-green-btn / ui-yellow-btn
//     → 9 frames (14×14 each):  0=TL 1=TC 2=TR 3=ML 4=MC 5=MR 6=BL 7=BC 8=BR
//     → Generated from source frames: 8.png=corner, 9.png=edge, 5.png=center
//       Corners: TL=f8, TR=f8 mirrorX, BL=f8 rot90ccw, BR=f8 rot180
//       Edges:   TC=f9, BC=f9 rot180,  ML=f9 rot90ccw, MR=f9 rot90cw
//       Center:  MC=f5
//     → Small tiles (14px) are rendered at 2× scale (28px effective tile size)
//   ui-banner
//     → 3 frames (32×32 each):  0=left_cap 1=center_tile 2=right_cap
// ============================================================
const UIHelper = {};

// ── 9-slice panel ────────────────────────────────────────────
// Returns a Phaser.GameObjects.Container.
UIHelper.panel = function (scene, cx, cy, w, h, prefix) {
    const cw = scene.textures.get(prefix).get(0).realWidth;
    const ch = cw;

    const c = scene.add.container(0, 0);

    if (cw <= 16) {
        // ── Small tiles (14×14 buttons) — 9-frame layout at 2× scale ──
        // 0=TL 1=TC 2=TR 3=ML 4=MC 5=MR 6=BL 7=BC 8=BR
        const vs = 2;
        const tw = cw * vs;  // 28px effective tile
        const vc = Math.min(Math.floor(w / 2), Math.floor(h / 2), tw);
        const scale = vc / cw;
        const iw = Math.max(0, w - vc * 2);
        const ih = Math.max(0, h - vc * 2);

        const corner = (frame, x, y) => c.add(scene.add.image(x, y, prefix, frame).setScale(scale));
        corner(0, cx - w / 2 + vc / 2, cy - h / 2 + vc / 2); // TL
        corner(2, cx + w / 2 - vc / 2, cy - h / 2 + vc / 2); // TR
        corner(6, cx - w / 2 + vc / 2, cy + h / 2 - vc / 2); // BL
        corner(8, cx + w / 2 - vc / 2, cy + h / 2 - vc / 2); // BR

        const tile = (frame, x, y, tw2, th2) => {
            if (tw2 > 0 && th2 > 0)
                c.add(scene.add.tileSprite(x, y, tw2, th2, prefix, frame).setTileScale(scale, scale));
        };
        tile(1, cx,                    cy - h / 2 + vc / 2, iw, vc); // TC
        tile(7, cx,                    cy + h / 2 - vc / 2, iw, vc); // BC
        tile(3, cx - w / 2 + vc / 2,  cy,                  vc, ih);  // ML
        tile(5, cx + w / 2 - vc / 2,  cy,                  vc, ih);  // MR
        tile(4, cx,                    cy,                   iw, ih); // MC

    } else {
        // ── Large tiles (32×32 panels) — 9-frame layout at 1:1 ──────
        // 0=TL 1=TC 2=TR 3=ML 4=MC 5=MR 6=BL 7=BC 8=BR
        const iw = Math.max(0, w - cw * 2);
        const ih = Math.max(0, h - ch * 2);

        const corner = (frame, x, y) => c.add(scene.add.image(x, y, prefix, frame));
        corner(0, cx - w / 2 + cw / 2, cy - h / 2 + ch / 2); // TL
        corner(2, cx + w / 2 - cw / 2, cy - h / 2 + ch / 2); // TR
        corner(6, cx - w / 2 + cw / 2, cy + h / 2 - ch / 2); // BL
        corner(8, cx + w / 2 - cw / 2, cy + h / 2 - ch / 2); // BR

        const tile = (frame, x, y, tw, th) => {
            if (tw > 0 && th > 0)
                c.add(scene.add.tileSprite(x, y, tw, th, prefix, frame));
        };
        tile(1, cx,                    cy - h / 2 + ch / 2, iw, ch); // TC
        tile(7, cx,                    cy + h / 2 - ch / 2, iw, ch); // BC
        tile(3, cx - w / 2 + cw / 2,  cy,                  cw, ih); // ML
        tile(5, cx + w / 2 - cw / 2,  cy,                  cw, ih); // MR
        tile(4, cx,                    cy,                   iw, ih); // MC
    }

    return c;
};

// ── Interactive button ───────────────────────────────────────
// Returns { container, zone }.
UIHelper.button = function (scene, cx, cy, w, h, label, prefix, onPress) {
    const c = UIHelper.panel(scene, cx, cy, w, h, prefix);

    const txt = scene.add.text(cx, cy, label, {
        fontSize: h > 38 ? '15px' : '13px',
        fontFamily: '"Arial Black", Arial',
        color: '#F0DCA0',
        stroke: '#1C2E1A',
        strokeThickness: 3,
    }).setOrigin(0.5);
    c.add(txt);

    const zone = scene.add.zone(cx, cy, w, h).setInteractive({ useHandCursor: true });

    zone.on('pointerover', () => {
        c.setAlpha(0.85);
        txt.setColor('#FFE050');
    });
    zone.on('pointerout', () => {
        c.setAlpha(1);
        txt.setColor('#F0DCA0');
    });
    zone.on('pointerdown', () => {
        scene.tweens.add({ targets: c, scaleX: 0.96, scaleY: 0.96, duration: 60, yoyo: true });
        onPress();
    });

    return { container: c, zone };
};

// ── Toggle switch (rounded rect ON/OFF) ─────────────────────
// Returns [graphics, label, zone] — compatible with overlay cleanup pattern.
UIHelper.toggle = function (scene, x, y, initialValue, onChange) {
    let isOn = initialValue;
    const onColor  = 0x2A7A1A;
    const offColor = 0x5C1414;
    const w = 90, h = 28;
    const objs = [];

    const g = scene.add.graphics();
    const draw = () => {
        g.clear();
        g.fillStyle(isOn ? onColor : offColor, 1);
        g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);
        g.lineStyle(2, isOn ? 0x5CDD4A : 0xDD4444, 1);
        g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 8);
    };
    draw();

    const lbl = scene.add.text(x, y, isOn ? 'ON' : 'OFF', {
        fontSize: '13px', color: '#FFF5E0',
        fontFamily: 'Arial Black, Arial',
        stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5);

    const zone = scene.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => {
        isOn = !isOn;
        draw();
        lbl.setText(isOn ? 'ON' : 'OFF');
        onChange(isOn);
    });

    objs.push(g, lbl, zone);
    return objs;
};

// ── Horizontal scroll banner ─────────────────────────────────
// Returns a Phaser.GameObjects.Container.
// ui-banner frames: 0=left cap, 1=center tile, 2=right cap (32×32 px each)
// ribbonScaleY: vertical scale for the ribbon only (text stays normal size)
UIHelper.banner = function (scene, cx, cy, w, text, fontSize, ribbonScaleY) {
    fontSize = fontSize || '18px';
    ribbonScaleY = ribbonScaleY || 1;
    const capW = 32, capH = 32;
    const midW = Math.max(0, w - capW * 2);

    const c = scene.add.container(0, 0);
    c.add(scene.add.image(cx - w / 2 + capW / 2, cy, 'ui-banner', 0).setScale(1, ribbonScaleY));
    if (midW > 0) {
        c.add(scene.add.tileSprite(cx, cy, midW, capH, 'ui-banner', 1).setScale(1, ribbonScaleY));
    }
    c.add(scene.add.image(cx + w / 2 - capW / 2, cy, 'ui-banner', 2).setScale(1, ribbonScaleY));

    if (text) {
        c.add(scene.add.text(cx, cy, text, {
            fontSize,
            fontFamily: '"Georgia", serif',
            fontStyle: 'bold',
            color: '#F8E890',
            stroke: '#1C2E1A',
            strokeThickness: 3,
        }).setOrigin(0.5));
    }

    return c;
};
