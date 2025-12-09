import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import Map from "../objects/Map.js";
import Vector from "../../lib/Vector.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";
import CreatureFactory from "../services/CreatureFactory.js";
export default class Region {
  constructor(mapDefinition, creatureConfig = []) {
    this.map = new Map(mapDefinition);
    this.player = new Player();
    this.creatures = [];

    this.spawnCreatures(creatureConfig);
  }

  spawnCreatures(config) {
    config.forEach((def) => {
      for (let i = 0; i < def.count; i++) {
        const x = getRandomPositiveInteger(50, 330);
        const y = getRandomPositiveInteger(50, 150);
        const creature = CreatureFactory.createInstance(
          def.type,
          new Vector(x, y)
        );
        this.creatures.push(creature);
      }
    });
  }
  update(dt) {
    this.player.update(dt);
    this.creatures.forEach((creature) => {
      const oldX = creature.position.x;
      const oldY = creature.position.y;
      creature.update(dt);
      this.checkCreatureCollisions(creature, oldX, oldY);
    });
  }

  checkCreatureCollisions(creature, oldX, oldY) {
    let collided = false;

    const collisionObjects = this.map.getCollisionObjects();
    for (const hitbox of collisionObjects) {
      if (creature.didCollideWithEntity(hitbox)) {
        creature.position.x = oldX;
        creature.position.y = oldY;
        creature.handleWallCollision();
        collided = true;
        break;
      }
    }

    if (collided) return;

    for (const other of this.creatures) {
      if (other !== creature && creature.didCollideWithEntity(other.hitbox)) {
        creature.position.x = oldX;
        creature.position.y = oldY;
        creature.handleCreatureCollision(other);
        break;
      }
    }
  }
  render() {
    this.map.render(); // ← render map
    this.player.render(); // ← render player
    this.creatures.forEach((creature) => creature.render());
  }
}
