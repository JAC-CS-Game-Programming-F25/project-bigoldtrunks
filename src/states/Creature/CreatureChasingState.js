import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js";
import CreatureStateName from "../../enums/CreatureStateName.js";
/**
 * CreatureChasingState - Pursues the player when in range.
 *
 * The creature moves toward the player at increased speed. Transitions to
 * Attacking when close enough, or returns to Idle if the player escapes.
 *
 * Flow: Idle (player detected) → Chasing → Attacking (in range) or Idle (too far)
 */
export default class CreatureChasingState extends State {
  static CHASE_SPEED_MULTIPLIER = 1.2; // It is 20% faster when chasing.
  static LOSE_INTEREST_RADIUS = 120; // Stop chasing beyond this distance.
  static ATTACK_RANGE = 10; // Distance to start chasing player (in pixels)

  /**
   * Creates a new CreatureChasingState.
   * @param {Creature} creature - The creature that is chasing.
   * @param {Object} animations - Direction-keyed animation map.
   */
  constructor(creature, animations) {
    super();
    this.creature = creature;
    this.animations = animations;
  }

  /**
   * Sets the chase animation based on current direction.
   */
  enter() {
    this.creature.currentAnimation = this.animations[this.creature.direction];
  }

  /**
   * Moves creature toward player, handles state transitions and bounds.
   * @param {number} dt - Delta time since last frame.
   */
  update(dt) {
    // No valid player target
    const player = this.creature.player;
    if (!player || !player.position || player.isDead) {
      this.creature.changeState(CreatureStateName.Idle);
      return;
    }
    // use hitbox center calculate distance
    const creatureCenter = this.creature.getCenter();
    const playerCenterX =
      player.hitbox.position.x + player.hitbox.dimensions.x / 2;
    const playerCenterY =
      player.hitbox.position.y + player.hitbox.dimensions.y / 2;

    const dx = playerCenterX - creatureCenter.x;
    const dy = playerCenterY - creatureCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // The player has run too far. Stop chasing.
    if (distance > CreatureChasingState.LOSE_INTEREST_RADIUS) {
      this.creature.changeState(CreatureStateName.Idle);
      return;
    }

    // change to attack
    if (distance <= CreatureChasingState.ATTACK_RANGE) {
      this.creature.changeState(CreatureStateName.Attacking);
      return;
    }

    // Calculate velocity toward player
    const velocityX =
      (dx / distance) *
      this.creature.speed *
      CreatureChasingState.CHASE_SPEED_MULTIPLIER;
    const velocityY =
      (dy / distance) *
      this.creature.speed *
      CreatureChasingState.CHASE_SPEED_MULTIPLIER;

    // Apply movement
    this.creature.position.x += velocityX * dt;
    this.creature.position.y += velocityY * dt;

    const maxX = CANVAS_WIDTH - this.creature.dimensions.x;
    const maxY = CANVAS_HEIGHT - this.creature.dimensions.y;

    this.creature.position.x = Math.max(
      0,
      Math.min(this.creature.position.x, maxX)
    );
    this.creature.position.y = Math.max(
      0,
      Math.min(this.creature.position.y, maxY)
    );

    // update direction
    this.creature.direction = dx < 0 ? Direction.Left : Direction.Right;

    // update animation
    this.creature.currentAnimation = this.animations[this.creature.direction];

    // update hitbox
    this.creature.hitbox.set(
      this.creature.position.x + this.creature.hitboxOffsets.position.x,
      this.creature.position.y + this.creature.hitboxOffsets.position.y,
      this.creature.dimensions.x + this.creature.hitboxOffsets.dimensions.x,
      this.creature.dimensions.y + this.creature.hitboxOffsets.dimensions.y
    );
  }
}
