import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameObject from "./GameObject.js";
import Direction from "../enums/Direction.js";
import Easing from "../../lib/Easing.js";
import Vector from "../../lib/Vector.js";
import FireFlame from "./FireFlame.js";

export default class FrozenBlast extends GameObject {
    static WIDTH = 54.22;
    static HEIGHT = 18;
    static TRAVEL_DISTANCE = 70; // How far the flame travels in pixels
    static TRAVEL_DURATION = 1.2; // Duration of the tween in seconds

    constructor(position, direction, playerDimensions = {x: 16, y: 16}) {
        // Calculate the proper start position in front of the player
        const startPosition = FrozenBlast.calculateStartPosition(position, direction, playerDimensions);
        
        super(
            {x: FrozenBlast.WIDTH, y: FrozenBlast.HEIGHT},
            startPosition
        );
        this.direction = direction;
        this.frozenRightSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.FrozenBlastRight),
            FrozenBlast.WIDTH,
            FrozenBlast.HEIGHT        
        );
        this.frozenLeftSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.FrozenBlastLeft),
            FrozenBlast.WIDTH,
            FrozenBlast.HEIGHT        
        );
        this.sprites = (this.direction === Direction.Right) ? this.frozenRightSprites : this.frozenLeftSprites;

        this.animationRight = new Animation([0, 1, 2, 3, 4, 5, 6, 7, 8], 0.1, 1);
        this.animationLeft = new Animation([8, 7, 6, 5, 4, 3, 2, 1, 0], 0.1, 1);

        this.animation = (this.direction === Direction.Right) ? this.animationRight : this.animationLeft;
        this.currentAnimation = this.animation;
        this.currentFrame = 0;

        // Tween properties
        this.startPosition = new Vector(startPosition.x, startPosition.y);
        

        this.damage = 5; // Damage dealt by the flame
    }
    updateSpritesAndAnimation() {
        this.sprites = (this.direction === Direction.Right) ? this.frozenRightSprites : this.frozenLeftSprites;
        this.animation = (this.direction === Direction.Right) ? this.animationRight : this.animationLeft;
    }

    /**
     * Calculate the starting position for the FrozenBlast in front of the player
     * @param {Vector} playerPosition - The player's current position
     * @param {number} direction - The direction the player is facing
     * @param {Object} playerDimensions - The player's dimensions {x, y}
     * @returns {Vector} The calculated start position for the blast
     */
    static calculateStartPosition(playerPosition, direction, playerDimensions) {
        const startPos = new Vector(playerPosition.x, playerPosition.y);
        const offsetDistance = 8; // Distance in front of the player to spawn the blast
        
        switch(direction) {
            case Direction.Up:
                // Center horizontally, place above player
                startPos.x += (playerDimensions.x - FrozenBlast.WIDTH) / 2;
                startPos.y -= FrozenBlast.HEIGHT + offsetDistance;
                break;
            case Direction.Down:
                // Center horizontally, place below player
                startPos.x += (playerDimensions.x - FrozenBlast.WIDTH) / 2;
                startPos.y += playerDimensions.y + offsetDistance;
                break;
            case Direction.Left:
                // Center vertically, place to the left
                startPos.x -= FrozenBlast.WIDTH + offsetDistance;
                startPos.y += (playerDimensions.y - FrozenBlast.HEIGHT) / 2;
                break;
            case Direction.Right:
                // Center vertically, place to the right
                startPos.x += playerDimensions.x + offsetDistance;
                startPos.y += (playerDimensions.y - FrozenBlast.HEIGHT) / 2;
                break;
        }
        
        return startPos;
    }

    update(dt) {
        if(this.direction === Direction.Up || this.direction === Direction.Down ) {
            return;
        }
        this.updateSpritesAndAnimation();
        // Update the animation
        this.currentFrame = this.currentAnimation.getCurrentFrame();
        super.update(dt);

    }
    
    render(context) {
        super.render(context);
        // Additional render logic for FireFlame
    }
}