class Player extends Phaser.Sprite {

  MAXSPEED: number = 400;
  DRAG: number = 3000;
  ACCELERATION: number = 3000;
  bank: number;
  shipTrail:Phaser.Particles.Arcade.Emitter;
  lives: number;
  invulnerable: boolean = false;
  bulletGroup: Phaser.Group;
  fireLoop = this.game.time.events.loop(Phaser.Timer.SECOND*0.40, this.fireBullet, this);
  turboShot: boolean = false;
  shotFX;

  constructor(game: Phaser.Game, x: number, y: number){
    super(game, x, y, 'player');
    this.anchor.setTo(0.5, 0.5);
    this.lives = 3;

    //  Add an emitter for the ship's trail
    this.shipTrail = this.game.add.emitter(this.x, this.y + 10, 10);
    this.shipTrail.width = 5;
    this.shipTrail.makeParticles('trail');
    this.shipTrail.setXSpeed(20, -20);
    this.shipTrail.setYSpeed(150, 120);
    this.shipTrail.setRotation(50,-50);
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


  update(){
    this.body.acceleration.x = 0;
    /*
    if(this.game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 0.1) && this.alive)
    {
      //**Dentro de la clase:
      Player.prototype.fireBullet.call(this);
      //fireBullet.call(this);
    }*/

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
        (this.game.input.activePointer.isDown && this.game.input.activePointer.x < this.game.width/2))
    {
        this.body.acceleration.x = -this.ACCELERATION;
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
        (this.game.input.activePointer.isDown && this.game.input.activePointer.x >= this.game.width/2))
    {
        this.body.acceleration.x = this.ACCELERATION;
    }
    //  Stop at screen edges
    if (this.x > this.game.width-30)
    {
       this.x = this.game.width - 30;
       this.body.acceleration.x = 0;
    }
    if (this.x < 30)
    {
       this.x = 30;
       this.body.acceleration.x = 0;
    }
    //  Squish and rotate ship for illusion of "banking"
    this.bank = this.body.velocity.x / this.MAXSPEED;
    this.scale.y = 1 - Math.abs(this.bank) / 3;
    this.angle = this.bank * 20 -90;
    this.shipTrail.x = this.x;
    this.shipTrail.y = this.y + 10;
  }

  fireBullet() {
    if(this.lives>0){
      var bullet = this.bulletGroup.getFirstExists(false);
      if (bullet)
      {
          this.shotFX.play();
          bullet.reset(this.x, this.y);
          bullet.angle = this.angle;
          this.game.physics.arcade.velocityFromRotation(this.rotation, 800, bullet.body.velocity);
      }
    }
  }
}
