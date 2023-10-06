var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(game, x, y) {
        _super.call(this, game, x, y, 'player');
        this.MAXSPEED = 400;
        this.DRAG = 3000;
        this.ACCELERATION = 3000;
        this.invulnerable = false;
        this.fireLoop = this.game.time.events.loop(Phaser.Timer.SECOND * 0.40, this.fireBullet, this);
        this.turboShot = false;
        this.anchor.setTo(0.5, 0.5);
        this.lives = 3;
        this.shipTrail = this.game.add.emitter(this.x, this.y + 10, 10);
        this.shipTrail.width = 5;
        this.shipTrail.makeParticles('trail');
        this.shipTrail.setXSpeed(20, -20);
        this.shipTrail.setYSpeed(150, 120);
        this.shipTrail.setRotation(50, -50);
        this.shipTrail.setAlpha(1, 0.01, 500);
        this.shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
        this.shipTrail.start(false, 200, 10);
        game.add.existing(this);
        this.angle = -90;
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.maxVelocity.setTo(this.MAXSPEED, this.MAXSPEED);
        this.body.drag.setTo(this.DRAG, this.DRAG);
        this.shotFX = this.game.add.audio('shot');
    }
    Player.prototype.update = function () {
        this.body.acceleration.x = 0;
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
            (this.game.input.activePointer.isDown && this.game.input.activePointer.x < this.game.width / 2)) {
            this.body.acceleration.x = -this.ACCELERATION;
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
            (this.game.input.activePointer.isDown && this.game.input.activePointer.x >= this.game.width / 2)) {
            this.body.acceleration.x = this.ACCELERATION;
        }
        if (this.x > this.game.width - 30) {
            this.x = this.game.width - 30;
            this.body.acceleration.x = 0;
        }
        if (this.x < 30) {
            this.x = 30;
            this.body.acceleration.x = 0;
        }
        this.bank = this.body.velocity.x / this.MAXSPEED;
        this.scale.y = 1 - Math.abs(this.bank) / 3;
        this.angle = this.bank * 20 - 90;
        this.shipTrail.x = this.x;
        this.shipTrail.y = this.y + 10;
    };
    Player.prototype.fireBullet = function () {
        if (this.lives > 0) {
            var bullet = this.bulletGroup.getFirstExists(false);
            if (bullet) {
                this.shotFX.play();
                bullet.reset(this.x, this.y);
                bullet.angle = this.angle;
                this.game.physics.arcade.velocityFromRotation(this.rotation, 800, bullet.body.velocity);
            }
        }
    };
    return Player;
})(Phaser.Sprite);
