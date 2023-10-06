declare module Phaser {

    module Plugin {

       export class ScreenShake extends Phaser.Plugin {

	     constructor(game:Phaser.Game, parent:Phaser.PluginManager);
	     setup(obj:Object):void;
	     shake(count:number):void;
  	}
  }
}
