import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js";
export default class CreatureChasingState extends State {
  static CHASE_SPEED_MULTIPLIER = 1.2; // It is 20% faster when chasing.
  static LOSE_INTEREST_RADIUS = 120; // Stop chasing beyond this distance.
  constructor(creature, animations) {
    super();
    this.creature = creature;
    this.animations = animations;
  }

  enter() {
    this.creature.currentAnimation = this.animations[this.creature.direction];
  }

  update(dt) {
    // get player
    const player = this.creature.player;
    if (!player || !player.position) {
      this.creature.changeState(CreatureStateName.Idle);
      return;
    }

    // get player position
    const dx = player.position.x - this.creature.position.x;
    const dy = player.position.y - this.creature.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // The player has run too far. Stop chasing.
    if (distance > CreatureChasingState.LOSE_INTEREST_RADIUS) {
      this.creature.changeState(CreatureStateName.Idle);
      return;
    }
    if (distance > 5) {
      const velocityX =
        (dx / distance) *
        this.creature.speed *
        CreatureChasingState.CHASE_SPEED_MULTIPLIER;
      const velocityY =
        (dy / distance) *
        this.creature.speed *
        CreatureChasingState.CHASE_SPEED_MULTIPLIER;

      // move
      this.creature.position.x += velocityX * dt;
      this.creature.position.y += velocityY * dt;

      const minX = 0;
      const minY = 0;
      const maxX = CANVAS_WIDTH - this.creature.dimensions.x;
      const maxY = CANVAS_HEIGHT - this.creature.dimensions.y;

      this.creature.position.x = Math.max(
        minX,
        Math.min(this.creature.position.x, maxX)
      );
      this.creature.position.y = Math.max(
        minY,
        Math.min(this.creature.position.y, maxY)
      );

      // update direction
      if (dx < 0) {
        this.creature.direction = Direction.Left;
      } else if (dx > 0) {
        this.creature.direction = Direction.Right;
      }

      // update animation
      this.creature.currentAnimation = this.animations[this.creature.direction];
    }

    // update hitbox
    this.creature.hitbox.set(
      this.creature.position.x + this.creature.hitboxOffsets.position.x,
      this.creature.position.y + this.creature.hitboxOffsets.position.y,
      this.creature.dimensions.x + this.creature.hitboxOffsets.dimensions.x,
      this.creature.dimensions.y + this.creature.hitboxOffsets.dimensions.y
    );
  }
}
