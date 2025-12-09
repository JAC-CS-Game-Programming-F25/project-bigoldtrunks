import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import Map from "../objects/Map.js";
import Vector from "../../lib/Vector.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";
import CreatureFactory from "../services/CreatureFactory.js";
import Creature from "../entities/Creature/Creature.js";
export default class Region {
  constructor(mapDefinition, creatureConfig = []) {
    this.map = new Map(mapDefinition);
    this.player = new Player();

    this.creatures = this.spawnCreatures(creatureConfig);

    // All entities in the region
    this.entities = [this.player, ...this.creatures];

    this.renderQueue = this.buildRenderQueue();
  }
 
  update(dt) {
    // Rebuild render queue each frame to account for movement
    this.renderQueue = this.buildRenderQueue();
    this.cleanUpEntities();
    this.updateEntities(dt);

  }

  /**
   * Update all entities in the region,
   * If any logic needs to be applied for specific entity types, handle them here (colision, AI, dead, onHit, onConsume, etc)
   * @param {*} dt 
   */
  updateEntities(dt) {
    this.entities.forEach((entity) => {
        if (entity.health <= 0) {
				entity.isDead = true;
			}
        if(entity instanceof Creature){
            const oldX = entity.position.x;
            const oldY = entity.position.y;
            
            // update all entities (player, creatures, etc.)
            
            this.checkCreatureCollisions(entity, oldX, oldY);
            
            // check if creature is collided with player's sword -> creature takes the damae
            if(entity.didCollideWithEntity(this.player.swordHitbox)){
                entity.onTakingHit(this.player.damage);
            }
        }

       
       

        // // Check collision with creatures
        // if(
        //     !entity.isDead && 
        //     !this.player.isInVulnerable &&
        //     this.player.didCollideWithEntity(entity.hitbox) &&
        //     !(entity instanceof Player) // exclude player itself otherwise player immediate take damage and dead
        // ){
        //     this.player.onTakingDamage(entity.damage);
        // }   
        entity.update(dt);

    });
  }

   /**
   * Create initial creatures: Spiders with a random amount, at random positions
   * More creatures can be added later
   * @returns {void}
   */
  spawnCreatures(config) {
    const entities = new Array();

    config.forEach((def) => {
      for (let i = 0; i < def.count; i++) {
        const x = getRandomPositiveInteger(50, 330);
        const y = getRandomPositiveInteger(50, 150);
        const creature = CreatureFactory.createInstance(
          def.type,
          new Vector(x, y)
        );
        entities.push(creature);
      }
    });
    return entities;
  }

  /**
   * Check for collisions between a creature and the environment
   * @param {*} creature 
   * @param {*} oldX 
   * @param {*} oldY 
   * @returns 
   */
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
    // this.player.render(); // ← render player
    // this.creatures.forEach((creature) => creature.render());
    this.renderQueue.forEach((entity) => entity.render());
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
        return [...this.entities, this.player].sort((a, b) => {
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
        })
    }
    
    cleanUpEntities(){  
        this.entities = this.entities.filter(entity => !entity.isDead);
    }   
}
