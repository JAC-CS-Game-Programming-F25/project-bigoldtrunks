import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import Map from "../objects/Map.js";
import Spider from "../entities/Creature/Spider.js";
import Vector from "../../lib/Vector.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";
export default class Region {
  constructor(mapDefinition) {
    this.map = new Map(mapDefinition);
    this.player = new Player();
    this.creatures = [];
    // Spawn 3-5 random spiders
    const spiderCount = getRandomPositiveInteger(3, 5);

    for (let i = 0; i < spiderCount; i++) {
      const x = getRandomPositiveInteger(50, 330);
      const y = getRandomPositiveInteger(50, 150);

      this.creatures.push(new Spider(new Vector(x, y)));
    }
  }

  update(dt) {
    this.creatures.forEach((creature) => {
      creature.map = this.map;
      creature.update(dt);
    });
  }
  render() {
    this.map.render(); // ← render map
    this.player.render(); // ← render player
    this.creatures.forEach((creature) => creature.render());
  }
}
