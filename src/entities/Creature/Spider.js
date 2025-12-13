import Creature from "./Creature.js";
import Sprite from "../../../lib/Sprite.js";
import Animation from "../../../lib/Animation.js";
import { images } from "../../globals.js";
import CreatureStateName from "../../enums/CreatureStateName.js";
import Direction from "../../enums/Direction.js";
import StateMachine from "../../../lib/StateMachine.js";
import CreatureIdlingState from "../../states/Creature/CreatureIdlingState.js";
import CreatureWalkingState from "../../states/Creature/CreatureWalkingState.js";
import ImageName from "../../enums/ImageName.js";
import CreatureType from "../../enums/CreatureType.js";

export default class Spider extends Creature {
  static WIDTH = 16;
  static HEIGHT = 16;
  static SPEED = 15;
  static HEALTH = 100;
  /**
   * Creates a new Spider at the specified position.
   * @param {Vector} position - Initial spawn position.
   */
  constructor(position) {
    super({
      position,
      speed: Spider.SPEED,
      health: Spider.HEALTH,
      isContactDamage: true,
    });
    this.hitboxOffsets.set(0, 6, -2, -8); // shrink hitbox
    this.loadSprites();
    const animations = this.createAnimations();
    this.stateMachine = this.initializeStateMachine(animations);
    this.creatureType = CreatureType.Spider;
  }

  /**
   * Loads sprite sheet for the spider.
   */
  loadSprites() {
    this.sprites = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.Spider),
      Spider.WIDTH,
      Spider.HEIGHT
    );
  }

  /**
   * Creates animation sets for each state and direction.
   * @returns {Object} State-keyed animation map.
   */
  createAnimations() {
    const animations = {
      [CreatureStateName.Idle]: {
        [Direction.Down]: new Animation([0], 1),
        [Direction.Left]: new Animation([0], 1),
        [Direction.Right]: new Animation([0], 1),
        [Direction.Up]: new Animation([0], 1),
      },
      [CreatureStateName.Walking]: {
        [Direction.Left]: new Animation([17, 16, 15, 14], 0.2),
        [Direction.Right]: new Animation([14, 15, 16, 17], 0.2),
      },
    };

    return animations;
  }

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

    stateMachine.change(CreatureStateName.Idle);

    return stateMachine;
  }
}
