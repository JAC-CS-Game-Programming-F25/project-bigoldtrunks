import State from "../../../lib/State.js";
import CreatureStateName from "../../enums/CreatureStateName.js";
import { getRandomPositiveInteger } from "../../../lib/Random.js";
import Direction from "../../enums/Direction.js";
import { timer } from "../../globals.js";

export default class CreatureWalkingState extends State {
  static WALK_DURATION_MIN = 3;
  static WALK_DURATION_MAX = 6;

  constructor(creature, animations) {
    super();
    this.creature = creature;
    this.animations = animations;
  }

  enter(params) {
    if (params && params.direction !== undefined) {
      this.creature.direction = params.direction;
    } else {
      this.creature.direction =
        Math.random() < 0.5 ? Direction.Left : Direction.Right;
    }
    this.creature.currentAnimation = this.animations[this.creature.direction];

    this.walkDuration = getRandomPositiveInteger(
      CreatureWalkingState.WALK_DURATION_MIN,
      CreatureWalkingState.WALK_DURATION_MAX
    );

    this.startTimer();
  }

  update(dt) {
    const oldX = this.creature.position.x;
    const oldY = this.creature.position.y;

    // Move
    if (this.creature.direction === Direction.Left) {
      this.creature.position.x -= this.creature.speed * dt;
    } else {
      this.creature.position.x += this.creature.speed * dt;
    }

    // Update hitbox
    this.creature.hitbox.set(
      this.creature.position.x + this.creature.hitboxOffsets.position.x,
      this.creature.position.y + this.creature.hitboxOffsets.position.y,
      this.creature.dimensions.x + this.creature.hitboxOffsets.dimensions.x,
      this.creature.dimensions.y + this.creature.hitboxOffsets.dimensions.y
    );

    // Check map bound collision
    if (this.creature.map) {
      const collisionObjects = this.creature.map.getCollisionObjects();

      for (const hitbox of collisionObjects) {
        if (this.creature.didCollideWithEntity(hitbox)) {
          // Revert position
          this.creature.position.x = oldX;
          this.creature.position.y = oldY;

          // Reverse direction
          this.creature.direction =
            this.creature.direction === Direction.Left
              ? Direction.Right
              : Direction.Left;

          this.creature.currentAnimation =
            this.animations[this.creature.direction];
          this.creature.currentAnimation.refresh();

          // Update hitbox to reverted position
          this.creature.hitbox.set(
            this.creature.position.x + this.creature.hitboxOffsets.position.x,
            this.creature.position.y + this.creature.hitboxOffsets.position.y,
            this.creature.dimensions.x +
              this.creature.hitboxOffsets.dimensions.x,
            this.creature.dimensions.y +
              this.creature.hitboxOffsets.dimensions.y
          );

          break;
        }
      }
    }

    // 🆕 Check creature vs creature collision
    if (this.creature.region) {
      for (const other of this.creature.region.creatures) {
        if (
          other !== this.creature &&
          this.creature.didCollideWithEntity(other.hitbox)
        ) {
          // Revert
          this.creature.position.x = oldX;
          this.creature.position.y = oldY;

          // Reverse
          this.creature.direction =
            this.creature.direction === Direction.Left
              ? Direction.Right
              : Direction.Left;
          this.creature.currentAnimation =
            this.animations[this.creature.direction];
          this.creature.currentAnimation.refresh();

          // Update hitbox to reverted position
          this.creature.hitbox.set(
            this.creature.position.x + this.creature.hitboxOffsets.position.x,
            this.creature.position.y + this.creature.hitboxOffsets.position.y,
            this.creature.dimensions.x +
              this.creature.hitboxOffsets.dimensions.x,
            this.creature.dimensions.y +
              this.creature.hitboxOffsets.dimensions.y
          );
          break;
        }
      }
    }
  }

  async startTimer() {
    await timer.wait(this.walkDuration);
    this.creature.changeState(CreatureStateName.Idle);
  }
}
