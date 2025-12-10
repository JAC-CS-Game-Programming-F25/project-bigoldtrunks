import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";

export default class CreatureChasingState extends State {
  static CHASE_SPEED_MULTIPLIER = 1.2; // It is 20% faster when chasing.

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
      console.error(
        `Creature ${this.creature.constructor.name} has no player reference!`
      );
      return;
    }

    if (!player) return;

    // get player position
    const dx = player.position.x - this.creature.position.x;
    const dy = player.position.y - this.creature.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
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
