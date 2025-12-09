import Vector from "../../../lib/Vector.js";
import GameEntity from "../GameEntity.js";
import CreatureWalkingState from "../../states/Creature/CreatureWalkingState.js";
import Direction from "../../enums/Direction.js";

export default class Creature extends GameEntity {
  static CREATURE_WIDTH = 16;
  static CREATURE_HEIGHT = 16;

  constructor(creatureDefinition) {
    super(creatureDefinition);
    this.position = creatureDefinition.position;
    this.dimensions = new Vector(
      Creature.CREATURE_WIDTH,
      Creature.CREATURE_HEIGHT
    );
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
    if (this.stateMachine.currentState instanceof CreatureWalkingState) {
      // reverse direction
      this.direction =
        this.direction === Direction.Left ? Direction.Right : Direction.Left;
      this.currentAnimation =
        this.stateMachine.currentState.animations[this.direction];
      this.currentAnimation.refresh();
    }
  }
  update(dt) {
    super.update(dt);
    if (this.stateMachine) {
      this.stateMachine.update(dt);
    }
  }
}
