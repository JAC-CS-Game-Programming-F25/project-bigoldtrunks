import Sprite from "../../lib/Sprite.js";
import Animation from "../../lib/Animation.js";
import ImageName from "../enums/ImageName.js";
import { context, DEBUG, images } from "../globals.js";
import GameEntity from "./GameEntity.js";
import Direction from "../enums/Direction.js";
import StateMachine from "../../lib/StateMachine.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import PlayerIdlingState from "../states/player/PlayerIdlingState.js";
import PlayerWalkingState from "../states/player/PlayerWalkingState.js";
import PlayerSwordSwingingState from "../states/player/PlayerSwordSwingingState.js";
import Hitbox from "../../lib/Hitbox.js";
import PlayerPerformingFireFlameState from "../states/player/PlayerPerformingFireFlameState.js";
import AbilityType from "../enums/AbilityType.js";

export default class Player extends GameEntity {

    // the player frame has width and height of 16 pixels, apply to all movements idle/walk
    static PLAYER_SPRITE_WIDTH = 16;
	static PLAYER_SPRITE_HEIGHT = 16;

  constructor() {
    super({
      speed: Player.PLAYER_SPEED,
      health: Player.MAX_HEALTH,
    });

    this.walkingSprites = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.Player),
      Player.PLAYER_SPRITE_WIDTH,
      Player.PLAYER_SPRITE_HEIGHT
    );
    this.swordSwingingSprites = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.PlayerSwordSwing),
      Player.PLAYER_SWORD_SPRITE_WIDTH,
      Player.PLAYER_SWORD_SPRITE_HEIGHT
    );
    this.performFirePosterSprites = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.PlayerFireFlamePoster),
      Player.PLAYER_SWORD_SPRITE_WIDTH,
      Player.PLAYER_SWORD_SPRITE_HEIGHT
    );
    this.isInVulnerable = false; // to track if player is invulnerable after taking damage,
    this.sprites = this.walkingSprites;
    // set initial player position
    this.position = { x: 100, y: 100 };

    // set player dimensions
    this.dimensions = {
      x: Player.PLAYER_SPRITE_WIDTH,
      y: Player.PLAYER_SPRITE_HEIGHT,
    };

    // initialize animations for each direction, using only one frame for idling
    this.animation = {
      [Direction.Right]: new Animation([0], 1),
      [Direction.Left]: new Animation([4], 1),
      [Direction.Down]: new Animation([8], 1),
      [Direction.Up]: new Animation([12], 1),
    };
    // start with player facing down
    this.currentAnimation = this.animation[Direction.Down];
    this.swordHitbox = new Hitbox(0, 0, 0, 0, "blue"); // this is set in the sword swinging state
    this.hitboxOffsets = new Hitbox(
      4, // x offset
      8, // y offset
      -8, // width
      -8, // height
      "red"
    );
    this.abilityUnlocked = {
      [AbilityType.FireFlame]: false,
      [AbilityType.FrozenFlame]: false,
    };
    this.stateMachine = this.initializeStateMachine();
  }

  render() {
    context.save();

    super.render(); // need to pass offset

        super.render(); // need to pass offset

        context.restore();
        if(DEBUG){
            this.swordHitbox.render(context);
        }
    }
    /**
     * Initializes the state machine for the player.
     * @returns {StateMachine} the initialized state machine
     */
    initializeStateMachine() {
        const stateMachine = new StateMachine();

    stateMachine.add(PlayerStateName.Idle, new PlayerIdlingState(this));
    stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
    stateMachine.add(
      PlayerStateName.SwordSwinging,
      new PlayerSwordSwingingState(this)
    );
    stateMachine.add(
      PlayerStateName.PerformingFireFlame,
      new PlayerPerformingFireFlameState(this)
    );

    stateMachine.change(PlayerStateName.Idle);

        return stateMachine;
    }
    /**
     *     
     * Handles the player taking damage, player loses a amount of health, if health < 0, player become dead.
     * @param {*} damage damage from the creature 
     * @returns 
     */
    onTakingDamage(damage) {
        if (this.isInVulnerable) {
            return;
        }
        if (this.health < 0) {
            this.isDead = true;
            return;
        }
        // Handle taking damage logic here (e.g., reduce health)
        console.log("Player took damage!, current health:", this.health);
        
        this.health-= damage;
    }
    /**
     *    * Handles the player unlocking a new ability, such as Fire Flame or Frozen Flame.
     * add new state to the state machine when ability is unlocked 
     * @param {AbilityType} type The type of ability the player has gained.
     */
    // unlockAbility(type){
    //     // Mark the ability as unlocked
    //     this.abilityUnlocked[type] = true;
    //     if(type === AbilityType.FireFlame){
    //         console.log("Player gained Fire Flame ability!");
    //         this.stateMachine.add(PlayerStateName.PerformingFireFlame, new PlayerPerformingFireFlameState(this, this.region));
    //     } else if (type === AbilityType.FrozenFlame){
    //         // Future implementation for Frozen Flame ability
    //         console.log("Player gained Frozen Flame ability!");
    //     }
    // }
    /**
     * Checks if the player has unlocked the Fire Flame ability.
     * @returns {boolean} true if player has unlocked Fire Flame ability
     */
    isUnlockedFireFlameAbility(){
        return this.abilityUnlocked[AbilityType.FireFlame];
    }

    
    
}