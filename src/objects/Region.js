import Player from "../entities/Player.js";
import Map from "../objects/Map.js";
import Vector from "../../lib/Vector.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";
import CreatureFactory from "../services/CreatureFactory.js";
import Creature from "../entities/Creature/Creature.js";
import Hitbox from "../../lib/Hitbox.js";
import AbilityType from "../enums/AbilityType.js";
import FireFlame from "./FireFlame.js";
import { stateMachine, CANVAS_WIDTH, CANVAS_HEIGHT } from "../globals.js";
import GameStateName from "../enums/GameStateName.js";
import UserInterface from "./UserInterface.js";
import Tile from "./Tile.js";
import Crystal from "./Crystal.js";
import ItemType from "../enums/ItemType.js";
export default class Region {
    constructor(mapDefinition, creatureConfig = []) {        
        this.map = new Map(mapDefinition);
        this.creatures = this.spawnCreatures(creatureConfig);

        // Once we have the creature now we decide which one will keep the item
        this.assignWhichCreatureKeepItem(this.creatures, ItemType.Crystal);

        this.player = new Player(this); // Pass the region instance to the player
        /**
         * Items present in the region (e.g., crystals, fire torch, etc.)
         */
        this.items = [];
        this.items.push(new Crystal(new Vector(100, 100)));
        // Assign player reference to all creatures so they can chase
        this.creatures.forEach(creature => {
            creature.player = this.player;
        });

        // All entities in the region
        this.entities = [this.player, ...this.creatures];
        // All objects in the region
        this.objects = []; // contain objects like FireFlame added by the player, etc. more later

        this.collisionLayer = this.map.collisionLayer;
        this.renderQueue = this.buildRenderQueue();
        this.isGameOver = false;
        this.ui = new UserInterface(this.player, this);
    }

    update(dt) {
       if (this.isGameOver) return;
        // Rebuild render queue each frame to account for movement
        this.renderQueue = this.buildRenderQueue();
        this.cleanUpEntities();
        this.cleanUpObjects();  
        this.updateEntities(dt);
        this.updateObjects(dt);
        this.items.forEach((item) => {
            item.update(dt);
        });

    }
    
    render() {
        this.map.render(); // ← render map

        this.renderQueue.forEach((entity) => {
            if(entity)
                entity.render();
        }); // ← render all entities in the render queue
        this.objects.forEach((object) => {
            object.render();
        });  
       this.map.renderTop();
       this.ui.render();
       this.items.forEach((item) => {
            item.render();
        });
    }
    /**
     * Update all objects in the region (Player's abilitys objects, items(Crystal, FireTorch, etc.) etc.)
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
            if (entity instanceof Creature) {
                const oldX = entity.position.x;
                const oldY = entity.position.y;

                this.checkCreatureCollisions(entity, oldX, oldY);

                // check collision with all objects in the region (FireFlame, FrozenFlame, etc.)
                this.checkCollisionWithObjects(entity);

                // check entity hurt
                if (
                    !entity.isHurt &&
                    entity.didCollideWithEntity(this.player.swordHitbox)
                ) {
                    entity.onTakingHit(this.player.damage);
                }

                // contact damage
                if (
                    !entity.isDead &&
                    !this.player.isInVulnerable &&
                    entity.isContactDamage &&
                    this.player.hitbox &&
                    entity.hitbox.didCollide(this.player.hitbox)
                ) {
                    this.player.onTakingDamage(entity.damage);
                }
            }
            entity.update(dt);
        })
        // Check game over
        if ((this.player.isDead || this.player.health <= 0) && !this.player.lives < 0) {
            this.isGameOver = true;
            stateMachine.change(GameStateName.Transition, {
                fromState: stateMachine.currentState,
                toState: stateMachine.states[GameStateName.GameOver],
                toStateEnterParameters: { score: this.score },
            });
        }
    }
    isGameOver() {
        return this.player.isDead && this.player.lives < 0;
    }
    
	/**
	 * Checks if the player can move to a given position without colliding with collision tiles
	 * @param {number} x - Pixel X position
	 * @param {number} y - Pixel Y position
	 * @param {number} width - Player width
	 * @param {number} height - Player height
	 * @returns {boolean} Whether the player can move to this position
	 */
	isValidMove(x, y, width, height) {
		// Convert pixel position to tile coordinates
		const tileX = Math.floor(x / Tile.SIZE);
		const tileY = Math.floor(y / Tile.SIZE);
		
		// Check the tile coordinates for all corners of the player's hitbox
		const topLeftTile = this.map.collisionLayer.getTile(tileX, tileY);
		const topRightTile = this.map.collisionLayer.getTile(
			Math.floor((x + width) / Tile.SIZE),
			tileY
		);
		const bottomLeftTile = this.map.collisionLayer.getTile(
			tileX,
			Math.floor((y + height) / Tile.SIZE)
		);
		const bottomRightTile = this.map.collisionLayer.getTile(
			Math.floor((x + width) / Tile.SIZE),
			Math.floor((y + height) / Tile.SIZE)
		);
		
		// If any of the corners are on a collision tile, the move is invalid
		return topLeftTile === null && 
		       topRightTile === null && 
		       bottomLeftTile === null && 
		       bottomRightTile === null;
	}
    /**
     * Check for collisions between an entity and all objects in the region such as FireFlame, etc.
     * @param {*} entity 
     */
    checkCollisionWithObjects(entity) {
        this.objects.forEach((object) => {
            if (entity.didCollideWithEntity(object.hitbox)) {
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
        // array to hold all spawned creatures
        const creatures = new Array();

        // spawn creatures based on the config
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
                this.isPositionOccupied(position, creatures) &&
                attempts < maxAttempts
                );

                if (attempts < maxAttempts) {
                    const creature = CreatureFactory.createInstance(def.type, position);
                    creatures.push(creature);
                }
            }
        });
        return creatures;
    }
    /**
     * Decide which creature will keep the item by randomly selecting one from the list
     * if we decide specific item to be kept, pass specificCreatureIndex or leave null for random,
     * Probably Modify later for Warden to keep the key item
     * @param {[Creature]} creatures list of all creature 
     * @param {ItemType} itemType type of item to be kept
     * @param {number|null} specificCreatureIndex 
     */
    assignWhichCreatureKeepItem(creatures, itemType, specificCreatureIndex = null) {
        const randomIndex = specificCreatureIndex !== null ? specificCreatureIndex : getRandomPositiveInteger(0, creatures.length - 1);

        creatures[randomIndex].keepItem(itemType);
        console.log(`Creature at index ${randomIndex} will keep item of type ${itemType}`);
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
    // use hitbox as boundary checking
    const hitboxX = creature.position.x + creature.hitboxOffsets.position.x;
    const hitboxY = creature.position.y + creature.hitboxOffsets.position.y;
    const hitboxW = creature.dimensions.x + creature.hitboxOffsets.dimensions.x;
    const hitboxH = creature.dimensions.y + creature.hitboxOffsets.dimensions.y;
    if (
      hitboxX < 0 ||
      hitboxX + hitboxW > CANVAS_WIDTH ||
      hitboxY < 0 ||
      hitboxY + hitboxH > CANVAS_HEIGHT
    ) {
      creature.position.x = Math.round(oldX);
      creature.position.y = Math.round(oldY);
      creature.handleWallCollision();
      return;
    }
    // check object collision
    const collisionObjects = this.map.getCollisionObjects();
    for (const object of collisionObjects) {
      if (creature.didCollideWithEntity(object)) {
        creature.position.x = Math.round(oldX);
        creature.position.y = Math.round(oldY);
        creature.handleWallCollision();
        break;
      }
    }
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
        // this.entities already contains the player, don't add it twice
        return [...this.entities].sort((a, b) => {
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
    /**
     * Cleans up dead entities from the region, except the player
     */
    cleanUpEntities(){
        // Only remove dead creatures, NOT the player
        // We need to keep the player in the entities array to show death animation
        this.entities = this.entities.filter(entity => {
            if (entity instanceof Player) {
                return true; // Always keep player
            }
            
            // If creature is dead and has an item, spawn it into the world
            if (entity.isDead && entity instanceof Creature && entity.itemKept) {
                console.log(`Creature died and dropped item at position:`, entity.itemKept.position);
                this.objects.push(entity.itemKept);
                
                entity.itemKept = null; // Clear the reference so it doesn't get added multiple times
            }
            
            return !entity.isDead; // Remove dead creatures
        });
    } 
    /*  * Cleans up objects that are marked for cleanup from the region */
    cleanUpObjects(){  
        this.objects = this.objects.filter(object => !object.cleanUp);  
   }
}
