class Item extends Phaser.Sprite {

    constructor(game: Phaser.Game, x: number, y: number){
      super(game, x, y, 'item');

    }

    update(){
      this.body.velocity.y = 160;
      if (this.y > 880)
        this.kill();
    }
}
