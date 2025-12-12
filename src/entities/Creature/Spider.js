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

export default class Spider extends Creature {
  static SPEED = 15;
  static HEALTH = 100;

  constructor(position) {
    super({
      position,
      speed: Spider.SPEED,
      health: Spider.HEALTH,
      isContactDamage: true,
    });
    this.hitboxOffsets.set(0, 6, -2, -8); // shrink hitbox
    this.loadSprites();
    this.setupAnimations();
    this.stateMachine = this.initializeStateMachine();
  }

  loadSprites() {
    this.sprites = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.Spider),
      16,
      16
    );
  }

  setupAnimations() {
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

  initializeStateMachine() {
    const animations = this.setupAnimations();
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
