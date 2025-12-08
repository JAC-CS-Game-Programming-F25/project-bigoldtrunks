import Vector from "../../../lib/Vector.js";
import GameEntity from "../GameEntity.js";

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

  update(dt) {
    super.update(dt);
    if (this.stateMachine) {
      this.stateMachine.update(dt);
    }
  }
}
