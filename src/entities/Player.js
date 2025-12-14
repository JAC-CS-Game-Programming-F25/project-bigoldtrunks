import Sprite from "../../lib/Sprite.js";
import Animation from "../../lib/Animation.js";
import ImageName from "../enums/ImageName.js";
import { context, DEBUG, images, sounds, timer } from "../globals.js";
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
import PlayerDeadState from "../states/player/PlayerDeadState.js";
import PlayerFallingDownToEarth from "../states/player/PlayerFallingDownToEarth.js";
import ItemType from "../enums/ItemType.js";
import Crystal from "../objects/Crystal.js";
import SoundName from "../enums/SoundName.js";

export default class Player extends GameEntity {
  // the player frame has width and height of 16 pixels, apply to all movements idle/walk
  static PLAYER_SPRITE_WIDTH = 16;
  static PLAYER_SPRITE_HEIGHT = 16;

  // the player sword swinging frame has width and height of 32 pixels
  static PLAYER_SWORD_SPRITE_HEIGHT = 32;
  static PLAYER_SWORD_SPRITE_WIDTH = 32;
  static PLAYER_SPEED = 60;
  static MAX_HEALTH = 1;
  static MAX_LIVES = 1;

    // the player sword swinging frame has width and height of 32 pixels
    static PLAYER_SWORD_SPRITE_HEIGHT = 32;
    static PLAYER_SWORD_SPRITE_WIDTH = 32;
    static PLAYER_SPEED= 90;
    

    constructor(region){
        super({
            speed: Player.PLAYER_SPEED,
            health: Player.MAX_HEALTH
        })
        this.lives= Player.MAX_LIVES;
        this.region = region;   
        console.log("Player entity created in region:", region);
        this.walkingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Player),
            Player.PLAYER_SPRITE_WIDTH,
            Player.PLAYER_SPRITE_HEIGHT,
        )
        this.deadSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Player),
            Player.PLAYER_SPRITE_WIDTH,
            Player.PLAYER_SPRITE_HEIGHT,
        ); // use same sprites sheet.
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
        /**
         * Tracks which abilities have been unlocked by the player.
         */
        this.abilityUnlocked = {
            [AbilityType.FireFlame]: false,
            [AbilityType.FrozenFlame]: false
        }
        
        /**
         * Tracks cooldown status for each ability
         */
        this.abilityCooldowns = {
            [AbilityType.FireFlame]: false,
            [AbilityType.FrozenFlame]: false
        }

        this.itemCollected = []
        this.fireFlame = null;
        this.frozenBlast = null;
        this.stateMachine = this.initializeStateMachine();
    }
    /**
     * Tracks which abilities have been unlocked by the player.
     */
    onCollectItem(item) {

      if(item.itemType == ItemType.Crystal)
      {
        this.abilityUnlocked[AbilityType.FrozenFlame] = true;
        console.log("Player unlocked ability Crystal:", AbilityType.FrozenFlame);
      } else if (item.itemType == ItemType.FireTorch){
        this.abilityUnlocked[AbilityType.FireFlame] = true;
        console.log("Player unlocked ability FireTorch:", AbilityType.FireFlame);
      } else if (item.itemType == ItemType.Key){ 
          sounds[SoundName.KeyPickup].play();
          sounds[SoundName.OnEscapeSuccessful].play();
          console.log("Player collected Key:", ItemType.Key);
      }

      // Add item to the player's collected items list
      this.itemCollected.push(item);
    }

    // Add item to the player's collected items list
    this.itemCollected.push(item);
  }
  render() {
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
    stateMachine.add(
      PlayerStateName.Walking,
      new PlayerWalkingState(this, this.region)
    );
    stateMachine.add(
      PlayerStateName.SwordSwinging,
      new PlayerSwordSwingingState(this)
    );
    stateMachine.add(
      PlayerStateName.PerformingFireFlame,
      new PlayerPerformingFireFlameState(this, this.region)
    ); // Pass region to the state that needs it to add the fire to the
    stateMachine.add(
      PlayerStateName.PerformingFrozenBlast,
      new PlayerPerformingFrozenBlastState(this, this.region)
    ); // Pass region to the state that needs it to add the frozen blast to the
    stateMachine.add(PlayerStateName.Dead, new PlayerDeadState(this));
    stateMachine.add(
      PlayerStateName.FallingDownToEarth,
      new PlayerFallingDownToEarth(this)
    );
    stateMachine.change(PlayerStateName.Idle);

    return stateMachine;
  }
  /**
   * Handles the player taking damage
   * - If health reaches 0: player dies, plays death animation
   * - If player has lives remaining: respawns (FallingDownToEarth state)
   * - If no lives remaining: Game Over
   * @param {number} damage damage from the creature
   * @returns
   */
  onTakingDamage(damage) {
    // Don't take damage if invulnerable or already dead
    if (this.isInVulnerable || this.isDead) {
      return;
    }
    sounds[SoundName.Hurt].play();
    this.health -= damage;

    // Check if player's health reached 0
    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      this.lives -= 1;
      console.log(`Player died! Lives remaining: ${this.lives}`);

      // Transition to Dead state ( play death animation)
      // Dead state will check lives and either respawn or go to GameOver
      sounds[SoundName.Scream].play();
      this.changeState(PlayerStateName.Dead);

      // Estimate time for death animation + wait duration before landing sound
      if(this.lives >= 0) {
          timer.wait(2.3).then(() => {
          sounds[SoundName.Landed].play();
          });
        return;
      }
    }

    // Player is hurt but not dead - set invulnerability frames
    this.isInVulnerable = true;
    setTimeout(() => {
      this.isInVulnerable = false;
    }, 1000);
  }
  isOutOfLives() {
    return this.lives < 0;
  }
  /**
   * Resets player for respawn (after death when lives remain)
   */
  resetPlayer() {
    this.health = Player.MAX_HEALTH;
    this.isDead = false;
    this.canTransitionToGameOver = false;
    this.isInVulnerable = false;
  }
  /**
   * Sets the player's facing direction and updates the animation.
   * @param {Direction} direction - The direction to face (Left, Right, Up, Down).
   */
  setDirection(direction) {
    this.direction = direction;
    this.currentAnimation = this.animation[direction];
  }
}
