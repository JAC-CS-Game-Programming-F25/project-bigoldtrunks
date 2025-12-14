import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import Input from "../../../lib/Input.js";
import { input } from "../../globals.js";
import AbilityType from "../../enums/AbilityType.js";


export default class PlayerIdlingState extends State {
    constructor(player){
        super()
        this.player = player;

        this.animation = {
			[Direction.Right]: new Animation([0], 1),
			[Direction.Left]: new Animation([4], 1),
			[Direction.Down]: new Animation([8], 1),
            [Direction.Up]: new Animation([12], 1),
		};
    }

    enter(params){

        this.player.sprites=this.player.walkingSprites;
        this.player.currentAnimation = this.animation[this.player.direction];

    }
    
    update(dt){
        this.checkForMovement();
        this.handleSwordSwing();
        this.handlePerformingFireFlame();
        this.handlePerformingFrozenBlast();
        this.handleDead();
    }

    checkForMovement(){

        if(input.isKeyHeld(Input.KEYS.S)){
                this.player.direction = Direction.Down;
                this.player.changeState(PlayerStateName.Walking);
            } else if(input.isKeyHeld(Input.KEYS.W)){
                this.player.direction = Direction.Up;
                this.player.changeState(PlayerStateName.Walking);
            } else if(input.isKeyHeld(Input.KEYS.A)){
                this.player.direction = Direction.Left;
                this.player.changeState(PlayerStateName.Walking);
            } else if(input.isKeyHeld(Input.KEYS.D)){
                this.player.direction = Direction.Right;
                this.player.changeState(PlayerStateName.Walking);
            } 
    }

    handleSwordSwing() {
        if (input.isKeyHeld(Input.KEYS.SPACE)) {
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
     * 
     * @returns {boolean} whether the player can perform FireFlame
     */
    isCouldPerformFireFlame() {
        return this.player.abilityUnlocked[AbilityType.FireFlame] && (this.player.direction === Direction.Left || this.player.direction === Direction.Right);
    }
    
    handlePerformingFrozenBlast() {
        if (input.isKeyHeld(Input.KEYS.K)) {
            if (this.isCouldPerformFrozenBlast()) {
                console.log("K pressed - FrozenFlame allowed");
                this.player.changeState(PlayerStateName.PerformingFrozenBlast);
            }
            console.log("FrozenFlame ability is not unlocked");
            return;
        }
    }
    /**
     * Checks if the player can perform the FrozenBlast ability:
     * - The ability must be unlocked
     * - The player must be facing Left or Right
     * - The FrozenBlast must not be on cooldown
     * 
     * @returns {boolean} whether the player can perform FrozenBlast
     */
    isCouldPerformFrozenBlast() {
        return this.player.abilityUnlocked[AbilityType.FrozenFlame] && 
        (this.player.direction === Direction.Left || this.player.direction === Direction.Right) &&
        this.player.frozenBlast && !this.player.frozenBlast.isOnCooldown;
    }
    /**
     * Handles transition to Dead state if the player is dead
     */
    handleDead() {
        if (this.player.isDead) {
            this.player.changeState(PlayerStateName.Dead);
        }
    }
}