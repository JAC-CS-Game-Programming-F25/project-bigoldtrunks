import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import Map from "../objects/Map.js";
import Vector from "../../lib/Vector.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";
import CreatureFactory from "../services/CreatureFactory.js";
import Creature from "../entities/Creature/Creature.js";
import Hitbox from "../../lib/Hitbox.js";
import AbilityType from "../enums/AbilityType.js";
import FireFlame from "./FireFlame.js";
export default class Region {
    constructor(mapDefinition, creatureConfig = []) {
        
        this.map = new Map(mapDefinition);
        this.creatures = this.spawnCreatures(creatureConfig);
        this.player = new Player(this); // Pass the region instance to the player

        // All entities in the region
        this.entities = [this.player, ...this.creatures];
        // All objects in the region
        this.objects = []; // contain objects like FireFlame added by the player, etc. more later
        this.renderQueue = this.buildRenderQueue();
    }

    update(dt) {
        // Rebuild render queue each frame to account for movement
        this.renderQueue = this.buildRenderQueue();
        this.cleanUpEntities();
        this.cleanUpObjects();  
        this.updateEntities(dt);

        this.updateObjects(dt);

    }

    /**
     * Update all objects in the region (Player's abilitys objects, etc.)
     */
    updateObjects(dt){
        this.objects.forEach((object) => {
                object.update(dt);    
        });
    }
    /**
     * Adds an object to the region, such as FireFlame added by the player during PerformingFireFlameState
     * @param {*} object 
     */
    addObject(object){
        this.objects.push(object);
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
                // check collision with all objects in the region (FireFlame, FrozenFlame, etc.)
                this.checkCollisionWithObjects(entity);

                // check if creature is collided with player's sword -> creature takes the damae
                if(entity.didCollideWithEntity(this.player.swordHitbox)){
                    entity.onTakingHit(this.player.damage);
                }
            }
            entity.update(dt);
        });
    }
    checkCollisionWithObjects(entity){
        this.objects.forEach((object) => {
            if(entity.didCollideWithEntity(object.hitbox)){
                entity.onTakingHit(object.damage);
            }
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
        let position;
        let attempts = 0;
        const maxAttempts = 50;
        do {
            const x = getRandomPositiveInteger(50, 330);
            const y = getRandomPositiveInteger(50, 150);
            position = new Vector(x, y);
            attempts++;
        } while (
            (this.isPositionOccupied(position, entities) ||
            this.isPositionOnCollision(position)) &&
            attempts < maxAttempts
        );

        if (attempts < maxAttempts) {
            const creature = CreatureFactory.createInstance(def.type, position);
            entities.push(creature);
        }
        }
    });
    return entities;
    }

    isPositionOnCollision(position) {
    const collisionObjects = this.map.getCollisionObjects();
    const tempHitbox = new Hitbox(position.x, position.y, 64, 64);

    for (const hitbox of collisionObjects) {
        if (tempHitbox.didCollide(hitbox)) {
        return true;
        }
    }
    return false;
    }

    isPositionOccupied(position, existingCreatures) {
    const minDistance = 32; // Minimum spacing 2 tile
    for (const creature of existingCreatures) {
        const dx = creature.position.x - position.x;
        const dy = creature.position.y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
        return true;
        }
    }
    return false;
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
        
        this.renderQueue.forEach((entity) => entity.render()); // ← render all entities in the render queue
        this.objects.forEach((object) => {
            object.render();
        });  
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
    
    cleanUpObjects(){  
        this.objects = this.objects.filter(object => !object.cleanUp);  
   }
}
