import State from "../../../lib/State.js";
import CreatureStateName from "../../enums/CreatureStateName.js";
import { getRandomPositiveInteger } from "../../../lib/Random.js";
import Direction from "../../enums/Direction.js";
import { timer } from "../../globals.js";
/**
 * CreatureWalkingState - Creature patrols horizontally for a random duration.
 *
 * Moves left or right at base speed. If a player enters detection range,
 * transitions to Chasing. Otherwise, returns to Idle after walk duration.
 *
 * Flow: Enter → Walk (detect player?) → Chasing or Idle
 */
export default class CreatureWalkingState extends State {
  static WALK_DURATION_MIN = 3;
  static WALK_DURATION_MAX = 6;
  static DETECTION_RADIUS = 80; // Distance to start chasing player
  /**
   * Creates a new CreatureWalkingState.
   * @param {Creature} creature - The creature that is walking.
   * @param {Object} animations - Direction-keyed animation map.
   */
  constructor(creature, animations) {
    super();
    this.creature = creature;
    this.animations = animations;
  }
  /**
   * Sets walk direction (from params or random) and starts walk timer.
   * @param {Object} [params] - Optional parameters.
   * @param {Direction} [params.direction] - Forced walk direction.
   */
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

  /**
   * Moves creature horizontally, checks for player detection.
   * @param {number} dt - Delta time since last frame.
   */
  update(dt) {
    // check player distance
    if (this.shouldChasePlayer()) {
      this.creature.changeState(CreatureStateName.Chasing);
      return;
    }
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

  /**
   * Checks if player is within detection range and creature can chase.
   * @returns {boolean} True if creature should start chasing.
   */
  shouldChasePlayer() {
    if (!this.creature.canChase) return false;

    const player = this.creature.player;
    if (!player) return false;

    const dx = player.position.x - this.creature.position.x;
    const dy = player.position.y - this.creature.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const detectionRadius =
      this.creature.detectionRadius || CreatureWalkingState.DETECTION_RADIUS;
    return distance < detectionRadius; // start chaseing less than 80
  }

  /**
   * Waits for walk duration then transitions to Idle state.
   */
  async startTimer() {
    await timer.wait(this.walkDuration);
    this.creature.changeState(CreatureStateName.Idle);
  }
}
