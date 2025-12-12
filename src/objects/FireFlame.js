import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameObject from "./GameObject.js";
import Direction from "../enums/Direction.js";
import Easing from "../../lib/Easing.js";
import Vector from "../../lib/Vector.js";

export default class FireFlame extends GameObject {
    static WIDTH = 28;
    static HEIGHT = 28;
    static TRAVEL_DISTANCE = 70; // How far the flame travels in pixels
    static TRAVEL_DURATION = 1.2; // Duration of the tween in seconds

    constructor(position, direction, playerDimensions = {x: 16, y: 16}) {
        // Calculate the proper start position in front of the player
        const startPosition = FireFlame.calculateStartPosition(position, direction, playerDimensions);
        
        super(
            {x: FireFlame.WIDTH, y: FireFlame.HEIGHT},
            startPosition,
        );
        this.direction = direction;
        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.FireExplosion),
            FireFlame.WIDTH,
            FireFlame.HEIGHT        
        );
        this.animation = new Animation([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 0.1, 1);
        this.currentAnimation = this.animation;
        this.currentFrame = 0;

        // Tween properties
        this.startPosition = new Vector(startPosition.x, startPosition.y);
        this.endPosition = this.calculateEndPosition(direction);
        this.tweenTime = 0;
        this.tweenDuration = FireFlame.TRAVEL_DURATION;

        this.damage = 2; // Damage dealt by the flame
        
        // Reduce hitbox size to make it more accurate (smaller than the visual sprite)
    
        this.hitboxOffsets.position.x = 6; 
        this.hitboxOffsets.position.y = 6; 
        this.hitboxOffsets.dimensions.x = -15;
        this.hitboxOffsets.dimensions.y = -15; 
    }

    /**
     * Calculate the starting position for the FireFlame in front of the player
     * @param {Vector} playerPosition - The player's current position
     * @param {number} direction - The direction the player is facing
     * @param {Object} playerDimensions - The player's dimensions {x, y}
     * @returns {Vector} The calculated start position for the flame
     */
    static calculateStartPosition(playerPosition, direction, playerDimensions) {
        const startPos = new Vector(playerPosition.x, playerPosition.y);
        const offsetDistance =1; // Distance in front of the player to spawn the flame
        
        switch(direction) {
            case Direction.Up:
                // Center horizontally, place above player
                startPos.x += (playerDimensions.x - FireFlame.WIDTH) / 2;
                startPos.y -= FireFlame.HEIGHT + offsetDistance;
                break;
            case Direction.Down:
                // Center horizontally, place below player
                startPos.x += (playerDimensions.x - FireFlame.WIDTH) / 2;
                startPos.y += playerDimensions.y + offsetDistance;
                break;
            case Direction.Left:
                // Center vertically, place to the left
                startPos.x -= FireFlame.WIDTH + offsetDistance;
                startPos.y += (playerDimensions.y - FireFlame.HEIGHT) / 2;
                break;
            case Direction.Right:
                // Center vertically, place to the right
                startPos.x += playerDimensions.x + offsetDistance;
                startPos.y += (playerDimensions.y - FireFlame.HEIGHT) / 2;
                break;
        }
        
        return startPos;
    }

    /**
     * Calculate where the flame should end up based on direction
     */
    calculateEndPosition(direction) {
        const endPos = new Vector(this.startPosition.x, this.startPosition.y);
        
        switch(direction) {
            case Direction.Up:
                endPos.y -= FireFlame.TRAVEL_DISTANCE;
                break;
            case Direction.Down:
                endPos.y += FireFlame.TRAVEL_DISTANCE;
                break;
            case Direction.Left:
                endPos.x -= FireFlame.TRAVEL_DISTANCE;
                break;
            case Direction.Right:
                endPos.x += FireFlame.TRAVEL_DISTANCE;
                break;
        }
        
        return endPos;
    }

    update(dt) {
        // Update the animation
        this.currentFrame = this.currentAnimation.getCurrentFrame();
        super.update(dt);

        this.startTweeningFlame(dt);
    }
    
    /**
     * Starts the tweening animation for the flame.
     * @param {*} dt - The delta time since the last update.
     */
    startTweeningFlame(dt){

        // Update tween
        if (this.tweenTime < this.tweenDuration) {
            this.tweenTime += dt;
            
            // Use easing function to smoothly move from start to end position
            this.position.x = Easing.easeInQuad(
                this.tweenTime,
                this.startPosition.x,
                this.endPosition.x - this.startPosition.x,
                this.tweenDuration
            );
            
            this.position.y = Easing.easeInQuad(
                this.tweenTime,
                this.startPosition.y,
                this.endPosition.y - this.startPosition.y,
                this.tweenDuration
            );
        }
        
        // Mark for cleanup when animation is done
        if (this.currentAnimation.isDone()) {
            this.cleanUp = true;
        }
    }
    render(context) {
        super.render(context);
        // Additional render logic for FireFlame
    }
}