import Direction from "../../enums/Direction.js";
import Vector from "../../../lib/Vector.js";
import ImageName from "../../enums/ImageName.js";
import {
  images,
  DEBUG,
  context,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "../../globals.js";
import StateMachine from "../../../lib/StateMachine.js";
import Animation from "../../../lib/Animation.js";
import Sprite from "../../../lib/Sprite.js";
import Creature from "./Creature.js";
import CreatureStateName from "../../enums/CreatureStateName.js";
import CreatureType from "../../enums/CreatureType.js";
import CreatureAttackingState from "../../states/Creature/CreatureAttackingState.js";
import CreatureChasingState from "../../states/Creature/CreatureChasingState.js";
import CreatureWalkingState from "../../states/Creature/CreatureWalkingState.js";
import CreatureIdlingState from "../../states/Creature/CreatureIdlingState.js";

export default class BigBoss extends Creature {
  static WIDTH = 128;
  static HEIGHT = 128;
  static SPEED = 25;
  static HEALTH = 500;
  /**
   * Creates a new BigBoss at the specified position.
   * @param {Vector} position - Initial spawn position.
   */
  constructor(position) {
    super({
      position,
      speed: BigBoss.SPEED,
      health: BigBoss.HEALTH,
      damage: 2,
      canChase: true,
      dimensions: new Vector(BigBoss.WIDTH, BigBoss.HEIGHT),
    });

    // this.hitboxOffsets.set(90, 100, -110, -100);
    this.direction = Direction.Left;
    this.loadSprites();
    const animations = this.createAnimations();
    this.stateMachine = this.initializeStateMachine(animations);
    this.creatureType = CreatureType.BigBoss;
    this.detectionRadius = 200;
    this.loseInterestRadius = 300;
    this.attackRange = 40;
  }

    /**
   * Creates a new BigBoss at the specified position.
   * @param {Vector} position - Initial spawn position.
   */
  loadSprites() {
    this.spritesLeft = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.BigBoss_Left),
      BigBoss.WIDTH,
      BigBoss.HEIGHT
    );
    this.spritesRight = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.BigBoss_Right),
      BigBoss.WIDTH,
      BigBoss.HEIGHT
    );
  }

  /**
   * Creates animation sets for each state and direction.
   * @returns {Object} State-keyed animation map.
   */
  createAnimations() {
    return {
      [CreatureStateName.Idle]: {
        [Direction.Left]: new Animation([59], 0.2),
        [Direction.Right]: new Animation([59], 0.2),
      },
      [CreatureStateName.Walking]: {
        [Direction.Left]: new Animation([59, 60, 61, 62, 63, 64, 65], 0.15),
        [Direction.Right]: new Animation([63, 62, 61, 60, 59, 58, 57], 0.15),
      },
      [CreatureStateName.Chasing]: {
        [Direction.Left]: new Animation([3, 4, 5, 6, 7, 8, 9, 10], 0.1),
        [Direction.Right]: new Animation([7, 6, 5, 4, 3, 2, 1, 0], 0.1),
      },
      [CreatureStateName.Attacking]: {
        [Direction.Left]: new Animation([37, 38, 39, 40, 41, 42, 43, 44], 0.1),
        [Direction.Right]: new Animation([44, 43, 42, 41, 40, 39, 38, 37], 0.1),
      },
    };
  }

  /**
   * Initializes state machine with all creature states.
   * @param {Object} animations - Animation sets for each state.
   * @returns {StateMachine} Configured state machine.
   */
  initializeStateMachine(animations) {
    const stateMachine = new StateMachine();

    stateMachine.add(
      CreatureStateName.Idle,
      new CreatureIdlingState(this, animations[CreatureStateName.Idle])
    );
    stateMachine.add(
      CreatureStateName.Walking,
      new CreatureWalkingState(this, animations[CreatureStateName.Walking])
    );
    stateMachine.add(
      CreatureStateName.Chasing,
      new CreatureChasingState(this, animations[CreatureStateName.Chasing])
    );
    stateMachine.add(
      CreatureStateName.Attacking,
      new CreatureAttackingState(this, animations[CreatureStateName.Attacking])
    );
    stateMachine.change(CreatureStateName.Idle);

    return stateMachine;
  }

  /**
   * Updates boss state, hitbox, and clamps position to canvas bounds.
   * @param {number} dt - Delta time since last frame.
   */
  update(dt) {
    console.log(
      "BigBoss state:",
      this.stateMachine.currentState.constructor.name
    );

    super.update(dt);

    this.hitbox.set(this.position.x + 50, this.position.y + 80, 30, 30);

    if (this.position.x < 0) this.position.x = 0;
    if (this.position.y < 0) this.position.y = 0;
    if (this.position.x > CANVAS_WIDTH - this.dimensions.x) {
      this.position.x = CANVAS_WIDTH - this.dimensions.x;
    }
    if (this.position.y > CANVAS_HEIGHT - this.dimensions.y) {
      this.position.y = CANVAS_HEIGHT - this.dimensions.y;
    }
  }

  /**
   * Renders the boss sprite with hurt flash effect.
   * @param {Object} [offset={x: 0, y: 0}] - Camera offset for rendering.
   */
  render(offset = { x: 0, y: 0 }) {
    if (this.isHurt && Math.floor(Date.now() / 50) % 2 === 0) {
      return;
    }

    const x = this.position.x + offset.x;
    const y = this.position.y + offset.y;

    if (this.currentAnimation) {
      const spriteSet =
        this.direction === Direction.Left
          ? this.spritesLeft
          : this.spritesRight;

      const frameIndex = this.currentAnimation.getCurrentFrame();
      spriteSet[frameIndex].render(Math.floor(x), Math.floor(y));
    }

    if (DEBUG) {
      this.hitbox.render(context);
    }
  }

  /**
   * Returns the center point of the boss's hitbox.
   * @returns {{x: number, y: number}} Center coordinates.
   */
  getCenter() {
    return {
      x: this.hitbox.position.x + this.hitbox.dimensions.x / 2,
      y: this.hitbox.position.y + this.hitbox.dimensions.y / 2,
    };
  }
}
