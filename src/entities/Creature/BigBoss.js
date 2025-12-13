import Direction from "../../enums/Direction.js";
import Vector from "../../../lib/Vector.js";
import ImageName from "../../enums/ImageName";
import { images } from "../../globals.js";
import StateMachine from "../../../lib/StateMachine.js";
import Animation from "../../../lib/Animation.js";
import Sprite from "../../../lib/Sprite.js";
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
        [Direction.Left]: new Animation([15], 0.2),
        [Direction.Right]: new Animation([15], 0.2),
      },
      [CreatureStateName.Walking]: {
        [Direction.Left]: new Animation([58, 59, 60, 61, 62, 63], 0.15),
        [Direction.Right]: new Animation([58, 59, 60, 61, 62, 63], 0.15),
      },
      [CreatureStateName.Chasing]: {
        [Direction.Left]: new Animation([3, 4, 5, 6, 7, 8], 0.1),
        [Direction.Right]: new Animation([3, 4, 5, 6, 7, 8], 0.1),
      },
      [CreatureStateName.Attacking]: {
        [Direction.Left]: new Animation([47, 48, 49, 50, 51, 52], 0.1),
        [Direction.Right]: new Animation([47, 48, 49, 50, 51, 52], 0.1),
      },
    };
  }
  initializeStateMachine(animations) {
    const stateMachine = new StateMachine();

    stateMachine.add(
      CreatureStateName.Idle,
      new CreatureIdleState(this, animations[CreatureStateName.Idle])
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
  render() {}
}
