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
import PlayerPerformingFrozenBlastState from "../states/player/PlayerPerformingFrozenBlast.js";

export default class Player extends GameEntity {
  // the player frame has width and height of 16 pixels, apply to all movements idle/walk
  static PLAYER_SPRITE_WIDTH = 16;
  static PLAYER_SPRITE_HEIGHT = 16;

  // the player sword swinging frame has width and height of 32 pixels
  static PLAYER_SWORD_SPRITE_HEIGHT = 32;
  static PLAYER_SWORD_SPRITE_WIDTH = 32;
  static PLAYER_SPEED = 60;
  static MAX_HEALTH = 6;

    // the player sword swinging frame has width and height of 32 pixels
    static PLAYER_SWORD_SPRITE_HEIGHT = 32;
    static PLAYER_SWORD_SPRITE_WIDTH = 32;
    static PLAYER_SPEED= 90;
    

    constructor(region){
        super({
            speed: Player.PLAYER_SPEED,
            health: 2
        })
        this.region = region;   
        console.log("Player entity created in region:", region);
        this.walkingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Player),
            Player.PLAYER_SPRITE_WIDTH,
            Player.PLAYER_SPRITE_HEIGHT,
        )
        this.swordSwingingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.PlayerSwordSwing),
            Player.PLAYER_SWORD_SPRITE_WIDTH,
            Player.PLAYER_SWORD_SPRITE_HEIGHT,
        )
        this.performFirePosterSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.PlayerFireFlamePoster),
            Player.PLAYER_SWORD_SPRITE_WIDTH,
            Player.PLAYER_SWORD_SPRITE_HEIGHT,
        )
        this.performFrozenPosterSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.PlayerFrozenFlamePoster),
            Player.PLAYER_SWORD_SPRITE_WIDTH,
            Player.PLAYER_SWORD_SPRITE_HEIGHT,
        )
        this.isInVulnerable = false; // to track if player is invulnerable after taking damage,
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
        this.swordHitbox = new Hitbox(0, 0, 0, 0, 'blue'); // this is set in the sword swinging state
        this.hitboxOffsets = new Hitbox(
            4,  // x offset
            8,  // y offset
            -8, // width
            -8,  // height
            'red'
        )
        this.abilityUnlocked = {
            [AbilityType.FireFlame]: false,
            [AbilityType.FrozenFlame]: false
        }
        this.fireFlame = null;
        this.stateMachine = this.initializeStateMachine();
    }

    render(){
        context.save();
        
        super.render();
        
        context.restore();
        if (DEBUG) {
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
        stateMachine.add(PlayerStateName.SwordSwinging, new PlayerSwordSwingingState(this));
        stateMachine.add(PlayerStateName.PerformingFireFlame, new PlayerPerformingFireFlameState(this, this.region)); // Pass region to the state that needs it to add the fire to the
        stateMachine.add(PlayerStateName.PerformingFrozenBlast, new PlayerPerformingFrozenBlastState(this, this.region)); // Pass region to the state that needs it to add the frozen blast to the
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
    this.health -= damage;

    if (this.health < 0) {
      this.isDead = true;
      this.cleanUp = true;
      return;
    }
    // Handle taking damage logic here (e.g., reduce health)
    console.log("Player took damage!, current health:", this.health);
    this.isInVulnerable = true;
    setTimeout(() => {
      this.isInVulnerable = false;
    }, 1000);
  }
}
