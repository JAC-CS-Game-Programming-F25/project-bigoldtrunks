import Animation from "../../../lib/Animation.js";
import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import AbilityType from "../../enums/AbilityType.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { input, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js";


export default class PlayerWalkingState extends State {
    constructor(player, region) {
        super();
        this.player = player;
        this.region = region;

        console.log("PlayerWalkingState constructor");
        this.animation = {
            [Direction.Right]: new Animation([16, 17, 18, 19], 0.2),
            [Direction.Left]: new Animation([20, 21, 22, 23], 0.2),
            [Direction.Down]: new Animation([24, 25, 26, 27], 0.2),
            [Direction.Up]: new Animation([28, 29, 30, 31], 0.2),
        };
    }

    enter(){

        this.sprites=this.player.walkingSprites;
        this.player.currentAnimation = this.animation[this.player.direction];
    }
    
    update(dt){
        this.handleMovement(dt);
        this.handleSwordSwing();
        this.handlePerformingFireFlame();
        this.handlePerformingFrozenBlast();
    }

    handleMovement(dt) {
		this.player.currentAnimation = this.animation[this.player.direction];
        
        // Calculate movement delta
        const movementSpeed = this.player.speed * dt;
        let newX = this.player.position.x;
        let newY = this.player.position.y;
        
		if (input.isKeyHeld(Input.KEYS.S)) {
			this.player.direction = Direction.Down;
			newY = this.player.position.y + movementSpeed;
			
			// Check if the new position is valid before moving
			if (this.region.isValidMove(newX, newY, this.player.dimensions.x, this.player.dimensions.y)) {
				this.player.position.y = newY;
			}
			
		} else if (input.isKeyHeld(Input.KEYS.D)) {
			this.player.direction = Direction.Right;
			newX = this.player.position.x + movementSpeed;
			
			if (this.region.isValidMove(newX, newY, this.player.dimensions.x, this.player.dimensions.y)) {
				this.player.position.x = newX;
			}
		
		} else if (input.isKeyHeld(Input.KEYS.W)) {
			this.player.direction = Direction.Up;
			newY = this.player.position.y - movementSpeed;
			
			if (this.region.isValidMove(newX, newY, this.player.dimensions.x, this.player.dimensions.y)) {
				this.player.position.y = newY;
			}
			
		} else if (input.isKeyHeld(Input.KEYS.A)) {
			this.player.direction = Direction.Left;
			newX = this.player.position.x - movementSpeed;
			
			if (this.region.isValidMove(newX, newY, this.player.dimensions.x, this.player.dimensions.y)) {
				this.player.position.x = newX;
			}
			
		} else {
			this.player.changeState(PlayerStateName.Idle);
		}
	}
    handleSwordSwing() {
        if (input.isKeyHeld(Input.KEYS.SPACE)) {
            console.log("Checking for sword swing input");
            this.player.changeState(PlayerStateName.SwordSwinging);
        }
    }

    handlePerformingFireFlame() {
        // Only allow FireFlame when facing Left or Right (no sprites for Up/Down)
        if (input.isKeyHeld(Input.KEYS.J)) {
            if (this.isCouldPerformFireFlame()) {
                console.log("J pressed - FireFlame allowed");
                this.player.changeState(PlayerStateName.PerformingFireFlame);
            }
            console.log("FireFlame ability is not unlocked");
            return;
        }
    }

     /**
     * Checks if the player can perform the FireFlame ability:
     * - The ability must be unlocked
     * - The player must be facing Left or Right
     * - Not on cooldown
     * 
     * @returns {boolean} whether the player can perform FireFlame
     */
    isCouldPerformFireFlame() {
        return this.player.abilityUnlocked[AbilityType.FireFlame] && 
                (this.player.direction === Direction.Left || this.player.direction === Direction.Right) &&
                !this.player.abilityCooldowns[AbilityType.FireFlame];
    }
    
    handlePerformingFrozenBlast() {
        // Only allow FrozenBlast when facing Left or Right (no sprites for Up/Down)
         if (input.isKeyHeld(Input.KEYS.K)) {
            if (this.isCouldPerformFrozenBlast()) {
                console.log("K pressed - FrozenBlast allowed");
                this.player.changeState(PlayerStateName.PerformingFrozenBlast);
            }
            console.log("FrozenBlast ability is not unlocked");
            return;
        }
    }
     /**
     * Checks if the player can perform the FrozenBlast ability:
     * - The ability must be unlocked
     * - The player must be facing Left or Right
     * - Not on cooldown
     * 
     * @returns {boolean} whether the player can perform FrozenBlast
     */
    isCouldPerformFrozenBlast() {
        return this.player.abilityUnlocked[AbilityType.FrozenFlame] && 
        (this.player.direction === Direction.Left || this.player.direction === Direction.Right) &&
        !this.player.abilityCooldowns[AbilityType.FrozenFlame];
    }

    
}