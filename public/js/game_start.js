var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameStart = (function (_super) {
    __extends(GameStart, _super);
    function GameStart() {
        _super.apply(this, arguments);
    }
    GameStart.prototype.init = function () {
        this.game.renderer.renderSession.roundPixels = true;
    };
    GameStart.prototype.preload = function () {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.load.image('background1', 'assets/sprites/bg1.png');
        this.game.load.image('background2', 'assets/sprites/bg2.png');
        this.game.load.image('background3', 'assets/sprites/bg3.png');
        this.game.load.image('background4', 'assets/sprites/bg4-2.png');
        this.game.load.image('background5', 'assets/sprites/bg5-2.png');
        this.game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
        this.game.load.audio('musicLoop', ['assets/audio/Mars.mp3', 'assets/audio/Mars.ogg']);
        this.game.load.image('player', 'assets/sprites/player.png');
        this.game.load.image('bullet', 'assets/sprites/bullet.png');
        this.game.load.image('trail', 'assets/sprites/trail.png');
        this.game.load.image('enemyTrail', 'assets/sprites/enemyTrail.png');
        this.game.load.image('enemy', 'assets/sprites/enemyShip.png');
        this.game.load.image('enemy2', 'assets/sprites/enemyShip2.png');
        this.game.load.image('enemy3', 'assets/sprites/enemyShip3.png');
        this.game.load.image('enemyBullet', 'assets/sprites/enemyBullet.png');
        this.game.load.image('item', 'assets/sprites/item.png');
        this.game.load.spritesheet('explosion', 'assets/sprites/explosion.png', 80, 80);
        this.game.load.audio('item', ['assets/audio/item.mp3', 'assets/audio/item.ogg']);
        this.game.load.audio('shot', ['assets/audio/shot.mp3', 'assets/audio/shot.ogg']);
        this.game.load.audio('explode', ['assets/audio/explode.mp3', 'assets/audio/explode.ogg']);
        this.game.load.audio('select', ['assets/audio/select.mp3', 'assets/audio/select.ogg']);
    };
    GameStart.prototype.create = function () {
        var _this = this;
        this.game.add.tileSprite(0, 0, 480, 854, 'background1');
        this.game.add.tileSprite(0, 0, 480, 854, 'background2');
        this.game.add.tileSprite(0, 0, 480, 854, 'background3');
        this.game.add.tileSprite(0, 0, 480, 1320, 'background4');
        this.game.add.tileSprite(0, 0, 480, 1437, 'background5');
        this.selectFX = this.game.add.audio('select');
        var titleTXT = this.game.add.bitmapText(0, 200, 'carrier_command', 'SPACE\n\nSTRIFE', 60);
        titleTXT.align = 'center';
        titleTXT.x = this.game.width / 2 - titleTXT.textWidth / 2;
        var playTXT = this.game.add.bitmapText(0, 500, 'carrier_command', 'Play', 30);
        playTXT.align = 'center';
        playTXT.x = this.game.width / 2 - playTXT.textWidth / 2;
        playTXT.inputEnabled = true;
        playTXT.events.onInputDown.add(function () {
            _this.selectFX.play();
            _this.game.state.start("gameplay");
        });
        var instructionsTXT = this.game.add.bitmapText(0, 575, 'carrier_command', 'Instructions', 30);
        instructionsTXT.align = 'center';
        instructionsTXT.x = this.game.width / 2 - instructionsTXT.textWidth / 2;
        instructionsTXT.inputEnabled = true;
        instructionsTXT.events.onInputDown.add(function () {
            instructionsTXT.visible = false;
            titleTXT.visible = false;
            playTXT.y = 600;
            _this.selectFX.play();
            var instructionsExpTXT = _this.game.add.bitmapText(0, 200, 'carrier_command', '', 14);
            instructionsExpTXT.text = '* Tap on the left and \n\nright side of the screen \n\nto turn your spaceship.\n\n\n\n* The closer the enemies \n\nare to you when they \n\nare killed, the more points \n\nyou gain.\n\n\n\n* Get items for temporary \n\nturbo-shot.';
            instructionsExpTXT.align = 'center';
            instructionsExpTXT.x = _this.game.width / 2 - instructionsExpTXT.textWidth / 2;
        });
        var music = this.game.add.audio('musicLoop');
        music.loop = true;
        music.play();
    };
    return GameStart;
})(Phaser.State);
