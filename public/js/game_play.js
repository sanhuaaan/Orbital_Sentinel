var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GamePlay = (function (_super) {
    __extends(GamePlay, _super);
    function GamePlay() {
        _super.apply(this, arguments);
    }
    GamePlay.prototype.init = function () {
    };
    GamePlay.prototype.preload = function () {
    };
    GamePlay.prototype.create = function () {
        var _this = this;
        this.itemFX = this.game.add.audio('item');
        this.explodeFX = this.game.add.audio('explode');
        this.bg1 = this.game.add.tileSprite(0, 0, 480, 854, 'background1');
        this.bg2 = this.game.add.tileSprite(0, 0, 480, 854, 'background2');
        this.bg3 = this.game.add.tileSprite(0, 0, 480, 854, 'background3');
        this.bg4 = this.game.add.tileSprite(0, 0, 480, 1320, 'background4');
        this.bg5 = this.game.add.tileSprite(0, 0, 480, 1437, 'background5');
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#000000';
        this.bulletGroup = this.game.add.group();
        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletGroup.createMultiple(30, 'bullet');
        this.bulletGroup.setAll('anchor.x', 0.5);
        this.bulletGroup.setAll('anchor.y', 0.5);
        this.bulletGroup.setAll('outOfBoundsKill', true);
        this.bulletGroup.setAll('checkWorldBounds', true);
        this.bulletGroup.callAll('body.setSize', 'body', 10, 10);
        this.player = new Player(this.game, this.game.width / 2, 900);
        this.player.body.setSize(20, 20);
        this.player.bulletGroup = this.bulletGroup;
        this.game.add.tween(this.player).to({ y: 700 }, 3000, "Linear", true, 0, 0).onComplete.add(function () {
            _this.enemySpawnLoop = _this.game.time.events.loop(Phaser.Timer.SECOND * 2, _this.launchEnemy, _this);
            _this.itemSpawnLoop = _this.game.time.events.loop(Phaser.Timer.SECOND * 10, _this.launchItem, _this);
        });
        this.itemGroup = this.game.add.group();
        this.itemGroup.enableBody = true;
        this.itemGroup.classType = Item;
        this.itemGroup.createMultiple(5, 'item');
        this.itemGroup.callAll('body.setSize', 'body', 25, 25);
        this.enemyGroup = this.game.add.group();
        this.enemyGroup.enableBody = true;
        this.enemyGroup.classType = Enemy;
        this.enemyGroup.createMultiple(10, 'enemy');
        this.enemyGroup.callAll('body.setSize', 'body', 25, 25);
        this.enemyBulletGroup = this.game.add.group();
        this.enemyBulletGroup.enableBody = true;
        this.enemyBulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyBulletGroup.createMultiple(30, 'enemyBullet');
        this.enemyBulletGroup.setAll('anchor.x', 0.5);
        this.enemyBulletGroup.setAll('anchor.y', 0.5);
        this.enemyBulletGroup.setAll('outOfBoundsKill', true);
        this.enemyBulletGroup.setAll('checkWorldBounds', true);
        this.enemyBulletGroup.callAll('body.setSize', 'body', 10, 10);
        this.enemyGroup.forEach(function (entity) {
            entity.player = _this.player;
            entity.bulletGroup = _this.enemyBulletGroup;
            entity.randomize();
        }, this, false);
        this.scrShk = this.game.plugins.add(Phaser.Plugin.ScreenShake);
        this.explosionGroup = this.game.add.group();
        this.explosionGroup.enableBody = true;
        this.explosionGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.explosionGroup.createMultiple(10, 'explosion');
        this.explosionGroup.setAll('anchor.x', 0.5);
        this.explosionGroup.setAll('anchor.y', 0.5);
        this.explosionGroup.callAll('animations.add', 'animations', 'explosion', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        this.score = 0;
        this.bmptxtScore = this.game.add.bitmapText(10, 10, 'carrier_command', '', 15);
        this.bmptxtLives = this.game.add.bitmapText(470, 10, 'carrier_command', '', 15);
        this.bmptxtLives.anchor.x = 1;
        this.bmptxtGameOver = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'carrier_command', 'GAME OVER', 40);
        this.bmptxtGameOver.anchor.setTo(0.5, 0.5);
        this.bmptxtGameOver.visible = false;
        this.bmptxtReplay = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 60, 'carrier_command', 'Tap to replay', 20);
        this.bmptxtReplay.anchor.setTo(0.5, 0.5);
        this.bmptxtReplay.visible = false;
    };
    GamePlay.prototype.update = function () {
        if (this.score > 500 && this.enemySpawnLoop.delay != 1500) {
            this.enemySpawnLoop.delay = 1500;
        }
        else if (this.score > 2000 && this.enemySpawnLoop.delay != 1000) {
            this.enemySpawnLoop.delay = 1000;
        }
        if (this.score > 5000 && this.enemySpawnLoop.delay != 850) {
            this.enemySpawnLoop.delay = 850;
            this.itemSpawnLoop.delay = 6500;
            this.enemyGroup.setAll('fireLoop.delay', 2500);
        }
        if (this.score > 10000 && this.enemySpawnLoop.delay != 600) {
            this.enemySpawnLoop.delay = 600;
            this.itemSpawnLoop.delay = 5000;
            this.enemyGroup.setAll('fireLoop.delay', 3000);
        }
        this.bmptxtScore.setText('SCORE: ' + this.score);
        this.bmptxtLives.setText('LIVES: ' + this.player.lives);
        this.game.physics.arcade.overlap(this.bulletGroup, this.enemyGroup, this.enemyHitted, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemyGroup, this.shipCollide, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemyBulletGroup, this.playerHitted, null, this);
        this.game.physics.arcade.overlap(this.player, this.itemGroup, this.itemGet, null, this);
        this.bg1.tilePosition.y += 0.1;
        this.bg2.tilePosition.y += 0.2;
        this.bg3.tilePosition.y += 0.4;
        this.bg4.tilePosition.y += 0.6;
        this.bg5.tilePosition.y += 0.8;
    };
    GamePlay.prototype.render = function () {
    };
    GamePlay.prototype.playerHitted = function (player, bullet) {
        if (!this.player.invulnerable) {
            this.setInvulnerability();
            this.explodeFX.play();
            var explosion = this.explosionGroup.getFirstExists(false);
            explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
            explosion.alpha = 0.7;
            explosion.play('explosion', 30, false, true);
            bullet.kill();
            this.player.lives--;
            this.scrShk.shake(20);
            this.checkGameOver();
        }
    };
    GamePlay.prototype.itemGet = function (player, item) {
        this.score += 50;
        item.kill();
        this.itemFX.play();
        player.turboShot = true;
        player.fireLoop.delay = 250;
        setTimeout(function () { player.fireLoop.delay = 400; player.turboShot = false; }, 10000);
    };
    GamePlay.prototype.shipCollide = function (player, enemy) {
        if (!this.player.invulnerable) {
            this.explodeFX.play();
            this.setInvulnerability();
            this.enemyExplosion(enemy);
            enemy.kill();
            this.score += 100;
            this.player.lives--;
            this.scrShk.shake(20);
            this.checkGameOver();
        }
    };
    GamePlay.prototype.checkGameOver = function () {
        if (this.player.lives === 0 && this.bmptxtGameOver.visible === false) {
            this.player.kill();
            this.player.shipTrail.on = false;
            this.bmptxtGameOver.visible = true;
            this.bmptxtReplay.visible = true;
            var fadeInGameOver = this.game.add.tween(this.bmptxtGameOver);
            fadeInGameOver.to({ alpha: 1 }, 1000, Phaser.Easing.Quintic.Out);
            fadeInGameOver.onComplete.add(this.setResetHandlers, this);
            fadeInGameOver.start();
            var fadeInReplay = this.game.add.tween(this.bmptxtReplay);
            fadeInGameOver.to({ alpha: 1 }, 1000, Phaser.Easing.Quintic.Out);
            fadeInGameOver.onComplete.add(this.setResetHandlers, this);
            fadeInGameOver.start();
        }
    };
    GamePlay.prototype.setInvulnerability = function () {
        var _this = this;
        this.playerInvulnerableTween = this.game.add.tween(this.player).to({ alpha: 0 }, 100, "Linear", true, 0, -1);
        this.playerInvulnerableTween.yoyo(true);
        this.trailInvulnerableTween = this.game.add.tween(this.player.shipTrail).to({ alpha: 0 }, 100, "Linear", true, 0, -1);
        this.trailInvulnerableTween.yoyo(true);
        this.player.invulnerable = true;
        this.playerInvulnerableTween.start();
        this.trailInvulnerableTween.start();
        setTimeout(function () {
            _this.player.invulnerable = false;
            _this.playerInvulnerableTween.stop();
            _this.trailInvulnerableTween.stop();
            _this.player.alpha = 1;
            _this.player.shipTrail.alpha = 1;
        }, 1000);
    };
    GamePlay.prototype.setResetHandlers = function () {
        var tapRestart = this.game.input.onTap.addOnce(_restart, this);
        function _restart() {
            tapRestart.detach();
            this.restart();
        }
    };
    GamePlay.prototype.restart = function () {
        this.enemyGroup.callAll('kill', null);
        this.itemGroup.callAll('kill', null);
        this.player.revive();
        this.player.x = this.game.width / 2;
        this.player.y = 700;
        this.player.shipTrail.on = true;
        this.player.lives = 3;
        this.player.turboShot = false;
        this.player.fireLoop.delay = 400;
        this.score = 0;
        this.bmptxtGameOver.visible = false;
        this.bmptxtReplay.visible = false;
    };
    GamePlay.prototype.launchEnemy = function () {
        var enemy = this.enemyGroup.getFirstExists(false);
        if (enemy) {
            enemy.pathStep = 0;
            enemy.reset(enemy.startingX, -30);
            enemy.body.drag.x = 100;
            enemy.shipTrail.on = true;
            enemy.randomize();
        }
    };
    GamePlay.prototype.launchItem = function () {
        if (!this.player.turboShot) {
            var item = this.itemGroup.getFirstExists(false);
            if (item) {
                item.reset(this.game.rnd.integerInRange(50, this.game.width - 50), -40);
            }
        }
    };
    GamePlay.prototype.enemyHitted = function (bullet, enemy) {
        if (enemy.y > 0) {
            this.explodeFX.play();
            this.enemyExplosion(enemy);
            bullet.kill();
            enemy.kill();
            if (enemy.y < 175)
                this.score += 50;
            else if (enemy.y < 350)
                this.score += 100;
            else if (enemy.y < 525)
                this.score += 150;
            else
                this.score += 200;
        }
    };
    GamePlay.prototype.enemyExplosion = function (enemy) {
        var explosion = this.explosionGroup.getFirstExists(false);
        explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
    };
    return GamePlay;
})(Phaser.State);
