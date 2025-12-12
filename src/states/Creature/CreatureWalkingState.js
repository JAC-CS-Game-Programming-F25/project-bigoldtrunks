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
  }

  async startTimer() {
    await timer.wait(this.walkDuration);
    this.creature.changeState(CreatureStateName.Idle);
  }
}
