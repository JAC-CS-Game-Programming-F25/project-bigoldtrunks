import Creature from "./Creature.js";
import Sprite from "../../../lib/Sprite.js";
import Animation from "../../../lib/Animation.js";
import { images } from "../../globals.js";
import CreatureStateName from "../../enums/CreatureStateName.js";
import Direction from "../../enums/Direction.js";
import StateMachine from "../../../lib/StateMachine.js";
import CreatureIdlingState from "../../states/Creature/CreatureIdlingState.js";
import CreatureWalkingState from "../../states/Creature/CreatureWalkingState.js";
import { DEBUG, context } from "../../globals.js";
import CreatureChasingState from "../../states/Creature/CreatureChasingState.js";
import Vector from "../../../lib/Vector.js";
import CreatureAttackingState from "../../states/Creature/CreatureAttackingState.js";
import Hitbox from "../../../lib/Hitbox.js";
import ImageName from "../../enums/ImageName.js";

export default class Skeleton extends Creature {
  static SPEED = 20;
  static HEALTH = 2;

  constructor(position) {
    super({
      position,
      speed: Skeleton.SPEED,
      health: Skeleton.HEALTH,
      canChase: true, // only Skeleton can chase
      dimensions: new Vector(64, 64),
    });
    this.hitboxOffsets.set(24, 48, -48, -55); // Position hitbox at feet

    // game entity default function is down, add left to fix issue
    this.direction = Direction.Left;

    this.loadSprites();
    this.stateMachine = this.initializeStateMachine();
  }

  loadSprites() {
    const leftImage = images.get(ImageName.Skeleton_Left);
    const rightImage = images.get(ImageName.Skeleton_Right);

    this.spritesLeft = [];
    this.spritesRight = [];

    const idleFrames = [{ x: 0, y: 0 }];

    const walkFrames = [
      { x: 0, y: 64 },
      { x: 64, y: 64 },
      { x: 128, y: 64 },
      { x: 192, y: 64 },
      { x: 256, y: 64 },
      { x: 320, y: 64 },
    ];

    const attackFrames = [
      { x: 64, y: 128 },
      { x: 128, y: 128 },
      { x: 192, y: 128 },
      { x: 256, y: 128 },
    ];

    const allFrames = [...idleFrames, ...walkFrames, ...attackFrames];

    allFrames.forEach((frame) => {
      this.spritesLeft.push(new Sprite(leftImage, frame.x, frame.y, 64, 64));
      this.spritesRight.push(new Sprite(rightImage, frame.x, frame.y, 64, 64));
    });
  }
  setupAnimations() {
    const animations = {
      [CreatureStateName.Idle]: {
        [Direction.Left]: new Animation([0], 0.15),
        [Direction.Right]: new Animation([0], 0.15),
      },
      [CreatureStateName.Walking]: {
        [Direction.Left]: new Animation([1, 2, 3, 4, 5, 6], 0.1),
        [Direction.Right]: new Animation([1, 2, 3, 4, 5, 6], 0.1),
      },
      [CreatureStateName.Chasing]: {
        [Direction.Left]: new Animation([1, 2, 3, 4, 5, 6], 0.08), // <- add Chasing animation
        [Direction.Right]: new Animation([1, 2, 3, 4, 5, 6], 0.08),
      },
      [CreatureStateName.Attacking]: {
        [Direction.Left]: new Animation([7, 8, 9, 10], 0.12), // <- add Attacking animation
        [Direction.Right]: new Animation([7, 8, 9, 10], 0.12),
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
    stateMachine.add(
      // ← add Chasing state
      CreatureStateName.Chasing,
      new CreatureChasingState(this, animations[CreatureStateName.Chasing])
    );

    stateMachine.add(
      // ← add Attacking state
      CreatureStateName.Attacking,
      new CreatureAttackingState(this, animations[CreatureStateName.Attacking])
    );

    stateMachine.change(CreatureStateName.Idle);

    return stateMachine;
  }
  render(offset = { x: 0, y: 0 }) {
    // glimmering after injured
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
    // Debug render hitbox
    if (DEBUG) {
      this.hitbox.render(context);
    }
  }
}
