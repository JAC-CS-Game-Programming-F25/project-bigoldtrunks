import Sprite from "../../lib/Sprite.js";
import Animation from "../../lib/Animation.js";
import ImageName from "../enums/ImageName.js";
import { context, images } from "../globals.js";
import GameEntity from "./GameEntity.js";
import Direction from "../enums/Direction.js";

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

      
        // initialize animations for each direction, using only one frame for idling
        this.animation = {
                    [Direction.Right]: new Animation([0], 1),
                    [Direction.Left]: new Animation([4], 1),
                    [Direction.Down]: new Animation([8], 1),
                    [Direction.Up]: new Animation([12], 1),
                };
        // start with player facing down
        this.currentAnimation = this.animation[Direction.Down];

        console.log(this.walkingSprites);
    }

    update(dt) {
        // Update the animation
        if (this.currentAnimation) {
            this.currentAnimation.update(dt);
        }
    }

    render(){
        context.save();

        super.render(); // need to pass offset

        context.restore();
    }
}