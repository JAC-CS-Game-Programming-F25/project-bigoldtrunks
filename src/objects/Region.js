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
    
    for (let i = 0; i < 10; i++) {
        const x = getRandomPositiveInteger(50, 330);
        const y = getRandomPositiveInteger(50, 150);
        
        this.creatures.push(new Spider(new Vector(x, y)));
    }

    this.renderQueue = this.buildRenderQueue();
  }
  
  update(dt) {
    this.player.update(dt);
    this.creatures.forEach((creature) => {
      creature.map = this.map;
      creature.region = this;
      creature.update(dt);
    });
  }
  render() {
    this.map.render(); // ← render map
    this.player.render(); // ← render player
    this.creatures.forEach((creature) => creature.render());
  }
  /**
	 * Order the entities by their renderPriority fields. If the renderPriority
	 * is the same, then sort the entities by their bottom positions. This will
	 * put them in an order such that entities higher on the screen will appear
	 * behind entities that are lower down.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	 *
	 * The spread operator (...) returns all the elements of an array separately
	 * so that you can pass them into functions or create new arrays. What we're
	 * doing below is combining both the entities and objects arrays into one.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
	 * @returns {Array} The sorted array of entities and objects
     * Source: Game Programming Assignment - Zelda
	 */
  buildRenderQueue() {
    return [...this.creatures, this.player].sort((a, b) => {
        let order = 0;
        const bottomA= a.hitbox.position.y + a.hitbox.dimensions.y;
        const bottomB= b.hitbox.position.y + b.hitbox.dimensions.y;

        if(a.renderPriority < b.renderPriority){
            order = -1;
        } else if(a.renderPriority > b.renderPriority){
            order = 1;
        } else {
            order = bottomA - bottomB;
        }

        return order;
    });
  }
}
