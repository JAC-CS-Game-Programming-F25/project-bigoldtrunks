import Vector from "../../../lib/Vector.js";
import GameEntity from "../GameEntity.js";
import CreatureWalkingState from "../../states/Creature/CreatureWalkingState.js";
import Direction from "../../enums/Direction.js";
import CreatureChasingState from "../../states/Creature/CreatureWalkingState.js";

export default class Creature extends GameEntity {
  static CREATURE_WIDTH = 16;
  static CREATURE_HEIGHT = 16;

  constructor(creatureDefinition) {
    super(creatureDefinition);
    this.position = creatureDefinition.position;
    this.dimensions =
      creatureDefinition.dimensions ??
      new Vector(Creature.CREATURE_WIDTH, Creature.CREATURE_HEIGHT);
    this.damage = creatureDefinition.damage || 1;
    this.canChase = creatureDefinition.canChase ?? false;
  }

  receiveDamage(damage) {
    this.health -= damage;
    // play sound
  }
  /**
   * Handle collision wtih wall
   */
  handleWallCollision() {
    if (this.stateMachine.currentState instanceof CreatureWalkingState) {
      // reverse direction
      this.direction =
        this.direction === Direction.Left ? Direction.Right : Direction.Left;
      this.currentAnimation =
        this.stateMachine.currentState.animations[this.direction];
      this.currentAnimation.refresh();
    }
  }
  /**
   * Handle collison with other creatures
   * @param {*} other
   */
  handleCreatureCollision(other) {
    const currentState = this.stateMachine.currentState;

    if (
      this.stateMachine.currentState instanceof CreatureWalkingState ||
      currentState instanceof CreatureChasingState
    ) {
      // reverse direction
      this.direction =
        this.direction === Direction.Left ? Direction.Right : Direction.Left;
      this.currentAnimation =
        this.stateMachine.currentState.animations[this.direction];
      if (currentState.animations) {
        this.currentAnimation = currentState.animations[this.direction];
        this.currentAnimation.refresh();
      }
    }
  }

  /**
   * Handles collision with player sword, if creature is not dead, reduce health, creature become dead if health <=0
   * @param {number} damage damage received from player sword.
   */
  onTakingHit(damage) {
    if (this.isDead) return;
    if (this.health - damage <= 0) {
      this.isDead = true;
      console.log("Creature is dead");
      return;
    }
    this.health -= damage;
    console.log("Creature took damage, current health:", this.health);
    // play sound when creature receives damage
  }

  update(dt) {
    super.update(dt);
    if (this.stateMachine) {
      this.stateMachine.update(dt);
    }
  }
  getCenter() {
    const hb = this.hitbox;
    return {
      x: hb.position.x + hb.dimensions.x / 2,
      y: hb.position.y + hb.dimensions.y / 2,
    };
  }
}
