import Animation from "../../../lib/Animation.js";
import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { input, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js";
import FireFlame from "../../objects/FireFlame.js";
import FrozenBlast from "../../objects/FrozenBlast.js";


export default class PlayerPerformingFrozenBlastState extends State {
    constructor(player,region){
        super()
        this.player = player;
        this.region = region;
        this.animation = {
            [Direction.Right]: new Animation([0, 1, 2, 3, 4, 5, 6, 7], 0.06, 1),
            [Direction.Left]: new Animation([8, 9, 10, 11, 12, 13, 14, 15], 0.06, 1),
        };
        
        
        // Store the original position for later restoration
        this.originalDimensions = {
            x: this.player.dimensions.x,
            y: this.player.dimensions.y
        };
        this.frozenBlast = null;
        
    }
    /**
     * Initialize a FrozenBlast and link to the current region and associates it with the player.
     */
    addFrozenBlastToRegionAndPlayer() {
        // Pass player position, direction, and dimensions to properly position the flame
        this.frozenBlast = new FrozenBlast(
            this.player.position,
            this.player.direction,
            {x: Player.PLAYER_SPRITE_WIDTH, y: Player.PLAYER_SPRITE_HEIGHT}
        );

        this.player.frozenBlast = this.frozenBlast;

        this.region.addObject(this.frozenBlast);
    }
    /**
     * Processes the player's position and dimensions for the FrozenBlast state.
     * Adjusts the player's position and dimensions to accommodate the FrozenBlast animation.
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
    /**
     * Called when entering the FrozenBlast state.
     * Adds the FrozenBlast object to the region and sets up the player's animation and position.
     * Start activating cooldown for the FrozenBlast ability.
     */
    enter(){
        console.log("Entering Frozen Blast State");
        // add flame object to the region

        this.addFrozenBlastToRegionAndPlayer();
        this.frozenBlast.startCooldown();
        this.processPositionAndDimensions();

        this.player.isUsingFireFlame = true; // Set the flag to indicate FireFlame is being used

        this.player.sprites = this.player.performFrozenPosterSprites;
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
        if (this.frozenBlast) {
            this.frozenBlast.cleanUp = true;
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