const config = {
    type: Phaser.AUTO,
    width:  GAME.CANVAS_W,
    height: GAME.CANVAS_H,
    backgroundColor: '#5c94fc',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
            debug: false
        }
    },
    scale: {
        mode:       Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width:  GAME.CANVAS_W,
        height: GAME.CANVAS_H,
    },
    scene: [
        PreloadScene,
        MenuScene,
        LevelSelectScene,
        GameScene,
        UIScene,
        GameOverScene,
        PauseScene,
    ]
};

const game = new Phaser.Game(config);
