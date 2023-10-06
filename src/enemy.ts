class Enemy extends Phaser.Sprite {

  shipTrail:Phaser.Particles.Arcade.Emitter;
  bulletGroup: Phaser.Group;
  player: Player;
  bulletSpeed: number = 500;
  //randomize en base a propiedad en app.ts:
  type: number;
  fireLoop = this.game.time.events.loop(Phaser.Timer.SECOND, this.enemyFire, this);
  startingX: number;
  //tipo1
  speed:number;
  velX: number;
  velY: number;
  //tipo2
  frequency: number;
  spread: number;
  waveIniDir: number;
  //tipo3
  wayPoints;
  pathStep: number = 0;
  path;
  pathIndx: number = 0;
  speedPath: number = 300; //a menor número->mayor velocidad


  constructor(game: Phaser.Game, x: number, y: number){
    super(game, x, y, 'enemy');
    this.anchor.setTo(0.5, 0.5);
    this.angle = 90;
    //this.body.drag.x = 100;

    //this.startingX = x;
    this.type = 3;

    this.shipTrail = this.game.add.emitter(this.x, this.y, 10);
    this.shipTrail.width = 5;
    this.shipTrail.makeParticles('enemyTrail');
    this.shipTrail.setXSpeed(20, -20);
    this.shipTrail.setYSpeed(150, 120);
    this.shipTrail.setRotation(50,-50);
    this.shipTrail.setAlpha(1, 0.01, 500);
    this.shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
    this.shipTrail.start(false, 200, 10);
    this.shipTrail.on = false;

    this.events.onKilled.add(function(){this.shipTrail.on = false;}, this);
  }

  update(){
    var p = new Phaser.Point(this.x, this.y);
    p.rotate(p.x, p.y, this.rotation, false, 10);
    this.shipTrail.x = p.x;
    this.shipTrail.y = p.y;

    switch (this.type){
      case 1:
        this.angle = 270 - Phaser.Math.radToDeg(Math.atan2(this.body.velocity.x, this.body.velocity.y));
        break;
      case 2:
        //  Wave movement
        this.body.x = this.startingX + Math.sin((this.y) / this.frequency) * (this.spread * this.waveIniDir);

        //  Squish and rotate ship for illusion of "banking"
        var bank = Math.cos((this.y + 60) / this.frequency) * this.waveIniDir;
        this.scale.x = 1 - Math.abs(bank) / 10;
        this.angle = 270 - bank * 10;
        break;
      case 3:
        this.x = this.path[this.pathStep].x;
        this.y = this.path[this.pathStep].y;
        this.rotation = this.path[this.pathStep].angle;

        this.pathStep++;
        if (this.pathStep >= this.path.length)
        {
            this.pathStep = 0;
        }
        break;
    }

    if (this.y > 880)
    {
      this.kill();
    }
  }

  enemyFire(){
    //  Fire
    var enemyBullet = this.bulletGroup.getFirstExists(false);
    if (enemyBullet &&
        this.alive &&
        this.player.lives > 0 &&
        this.y + 250 < this.player.y) {
          enemyBullet.reset(this.x, this.y + this.height / 2);
          var angle = this.game.physics.arcade.moveToObject(enemyBullet, this.player, this.bulletSpeed);
          enemyBullet.angle = Phaser.Math.radToDeg(angle);
    }
  }

  randomize(){
      // randomizar tipo****************
      var enemyTypes = [1,2,3];
      this.type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      this.fireLoop.delay = this.game.rnd.integerInRange(900,1500);
      this.startingX = this.game.rnd.integerInRange(75, this.game.width-75);
      //tipo1
      this.speed = 250;
      //this.body.velocity.x = this.game.rnd.integerInRange(-300, 300);
      this.body.velocity.y = this.speed;
      //tipo 2 (si lo es)
      var values = [1,-1];
      this.waveIniDir = values[Math.floor(Math.random() * values.length)];
      this.frequency = this.game.rnd.integerInRange(70,100);
      this.spread = this.game.rnd.integerInRange(40,70);

      switch (this.type){
        case 1:
              this.key = 'enemy';
              this.loadTexture('enemy', 0);
              break;
        case 2:
              this.key = 'enemy2';
              this.loadTexture('enemy2', 0);
              break;
        case 3:
              this.key = 'enemy3';
              this.loadTexture('enemy3', 0);
              this.wayPoints = {
                  'x': [ 240, 240, 240, 240, 240, 240 , 240 , 240 ],
                  'y': [ -30, 120, 270, 420, 420 + this.game.rnd.between(-30,-60), 570, 720, 881 ]
              };
              this.path = [];

              var pRandY = this.wayPoints.x;
              for (var i = 0; i < pRandY.length; i++)
              {
                  pRandY[i] = this.game.rnd.between(32, 432);
              }

              var x = 1 / this.speedPath;

              for (var i = 0; i <= 1; i += x)
              {
                var px = Phaser.Math.catmullRomInterpolation(this.wayPoints.x, i);
                var py = Phaser.Math.catmullRomInterpolation(this.wayPoints.y, i);

                var pAngle = 0;
                if(i>0){
                  pAngle = Phaser.Math.angleBetweenPoints(new Phaser.Point(px,py), new Phaser.Point(this.path[this.pathIndx - 1].x, this.path[this.pathIndx - 1].y));
                }
                this.path.push( { x: px, y: py , angle: pAngle});
                this.pathIndx++;
              }
              this.pathIndx = 0;
            }
      }
}
