import Direction from "../../enums/Direction.js";
import Vector from "../../../lib/Vector.js";
import ImageName from "../../enums/ImageName.js";
import { images, DEBUG, context } from "../../globals.js";
import StateMachine from "../../../lib/StateMachine.js";
import Animation from "../../../lib/Animation.js";
import Sprite from "../../../lib/Sprite.js";
import Creature from "./Creature.js";
import CreatureStateName from "../../enums/CreatureStateName.js";
import CreatureAttackingState from "../../states/Creature/CreatureAttackingState.js";
import CreatureChasingState from "../../states/Creature/CreatureChasingState.js";
import CreatureWalkingState from "../../states/Creature/CreatureWalkingState.js";
import CreatureIdlingState from "../../states/Creature/CreatureIdlingState.js";
export default class BigBoss extends Creature {
  static WIDTH = 128;
  static HEIGHT = 128;
  static SPEED = 25;
  static HEALTH = 500;
  constructor(position) {
    super({
      position,
      speed: BigBoss.SPEED,
      health: BigBoss.HEALTH,
      damage: 2,
      canChase: true,
      dimensions: new Vector(BigBoss.WIDTH, BigBoss.HEIGHT),
    });

    this.hitboxOffsets.set(90, 100, -110, -100);
    this.direction = Direction.Left;
    this.loadSprites();
    const animations = this.createAnimations();
    this.stateMachine = this.initializeStateMachine(animations);
  }

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
}
