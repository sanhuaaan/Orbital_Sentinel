var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(game, x, y) {
        _super.call(this, game, x, y, 'item');
    }
    Item.prototype.update = function () {
        this.body.velocity.y = 160;
        if (this.y > 880)
            this.kill();
    };
    return Item;
})(Phaser.Sprite);
