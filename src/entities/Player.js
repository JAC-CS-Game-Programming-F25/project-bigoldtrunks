import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { context, images } from "../globals.js";
import GameEntity from "./GameEntity.js";

export default class Player extends GameEntity {

    // the player frame has width and height of 16 pixels, apply to all movements idle/walk
    static PLAYER_SPRITE_WIDTH = 16;
	static PLAYER_SPRITE_HEIGHT = 16;
    static SWORD_WIDTH = 16;

    constructor(){
        super()

        this.walkingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Player),
            Player.PLAYER_SPRITE_WIDTH,
            Player.PLAYER_SPRITE_HEIGHT,
        )

        this.sprites = this.walkingSprites;
        // set initial player position
        this.position = {x: 100, y: 100};
        // set player dimensions
        this.dimensions = {x: Player.PLAYER_SPRITE_WIDTH, y: Player.PLAYER_SPRITE_HEIGHT};

        console.log(this.walkingSprites);
    }
    render(){
        context.save();

        super.render(); // need to pass offset

        context.restore();
    }
}