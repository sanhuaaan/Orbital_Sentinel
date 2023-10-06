class Game {
  game: Phaser.Game;

  constructor() {
    this.game = new Phaser.Game(480, 854, Phaser.CANVAS, "");

    this.game.state.add("gameplay", new GamePlay());
    this.game.state.add("gamestart", new GameStart());

    this.game.state.start("gamestart");
  }
}
