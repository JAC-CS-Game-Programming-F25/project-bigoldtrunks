import Animation from "../../../lib/Animation.js";
import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { input, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js";
import FireFlame from "../../objects/FireFlame.js";


export default class PlayerPerformingFireFlameState extends State {
    constructor(player,region){
        super()
        this.player = player;
        this.region = region;
        this.animation = {
            [Direction.Right]: new Animation([0, 1, 2, 3 ], 0.2 , 1),
            [Direction.Left]: new Animation([4, 5, 6, 7], 0.2, 1),
            [Direction.Down]: new Animation([8, 9, 10, 11], 0.2, 1),
            [Direction.Up]: new Animation([12, 13, 14, 15], 0.2, 1),
        };
        
        
        // Store the original position for later restoration
        this.originalDimensions = {
            x: this.player.dimensions.x,
            y: this.player.dimensions.y
        };
        this.fireFlame = null;

    }
    /**
     * Adds a FireFlame object to the current region.
     */
    addFireFlameToRegion() {
        // Pass player position, direction, and dimensions to properly position the flame
        this.fireFlame = new FireFlame(
            this.player.position, 
            this.player.direction,
            {x: Player.PLAYER_SPRITE_WIDTH, y: Player.PLAYER_SPRITE_HEIGHT}
        );
        this.region.addObject(this.fireFlame);
    }
    /**
     * Processes the player's position and dimensions for the FireFlame state.
     * Adjusts the player's position and dimensions to accommodate the FireFlame animation.
     */
    processPositionAndDimensions() {
        // // Calculate offset to center the 32x32 sprite on the player's original 16x16 position        
        const offsetX = (Player.PLAYER_SWORD_SPRITE_WIDTH - Player.PLAYER_SPRITE_WIDTH) / 2;
        const offsetY = (Player.PLAYER_SWORD_SPRITE_HEIGHT - Player.PLAYER_SPRITE_HEIGHT) / 2;
        // Adjust position so the sprite centers on the original position
        this.player.position.x -= offsetX;
        this.player.position.y -= offsetY;
        
        // // Update dimensions for the sword swing sprite
        this.player.dimensions.x = Player.PLAYER_SWORD_SPRITE_WIDTH;
        this.player.dimensions.y = Player.PLAYER_SWORD_SPRITE_HEIGHT;
    }
    enter(){
        
        // add flame object to the region

        this.addFireFlameToRegion();
        
        this.processPositionAndDimensions();

        this.player.isUsingFireFlame = true; // Set the flag to indicate FireFlame is being used

        this.player.sprites = this.player.performFirePosterSprites;
        this.player.currentAnimation = this.animation[this.player.direction];
    }
    
    update(dt){
        if(this.player.currentAnimation.isDone()){
            this.player.currentAnimation.refresh();
            this.player.changeState(PlayerStateName.Idle);
        }
        /**
		 * Only set the sword's hitbox halfway through the animation.
		 * Otherwise, it will look like the enemy died as soon as the
		 * animation started which visually doesn't really make sense.
		 */
		if (this.player.currentAnimation.isHalfwayDone()) {
			this.setSwordHitbox();
		}
    }
    
    exit(){
        this.restorePlayerPositionAndDimensions();
        this.player.swordHitbox.set(0, 0, 0, 0); // Clear the sword hitbox
        this.player.isUsingFireFlame = false; // Reset the flag after using FireFlame
        
        // Only mark for cleanup if fireFlame was actually created
        if (this.fireFlame) {
            this.fireFlame.cleanUp = true;
        }
    }

    /**
     * Restores the player's original position and dimensions.
     */
    restorePlayerPositionAndDimensions() {
        const offsetX = (Player.PLAYER_SWORD_SPRITE_WIDTH - Player.PLAYER_SPRITE_WIDTH) / 2;
        const offsetY = (Player.PLAYER_SWORD_SPRITE_HEIGHT - Player.PLAYER_SPRITE_HEIGHT) / 2;

        this.player.position.x += offsetX;
        this.player.position.y += offsetY;

        // Restore original dimensions
        this.player.dimensions.x = this.originalDimensions.x;
        this.player.dimensions.y = this.originalDimensions.y;
    }
    /**
	 * Creates a hitbox based the player's position and direction.
	 */
	setSwordHitbox() {
		let hitboxX, hitboxY, hitboxWidth, hitboxHeight;
        hitboxHeight = this.player.dimensions.y/2;
        hitboxWidth = this.player.dimensions.x/2 ;

		// The magic numbers here are to adjust the hitbox offsets to make it line up with the sword animation.
		if (this.player.direction === Direction.Left) {
			hitboxX = this.player.position.x - hitboxWidth/2 + 3;
			hitboxY = this.player.position.y + this.player.dimensions.y / 4;
		}
		else if (this.player.direction === Direction.Right) {
			hitboxX = this.player.position.x + this.player.dimensions.x/2 + 4;
			hitboxY = this.player.position.y + this.player.dimensions.y / 4;
		}
		else if (this.player.direction === Direction.Up) {
			hitboxX = this.player.position.x + this.player.dimensions.x / 4;
			hitboxY = this.player.position.y - hitboxHeight/2 + 5;
		}
		else {

			hitboxX = this.player.position.x + this.player.dimensions.x / 4;
			hitboxY = this.player.position.y + this.player.dimensions.y/2 + 3;
		}

		this.player.swordHitbox.set(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
	}
}