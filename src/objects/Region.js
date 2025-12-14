import Player from "../entities/Player.js";
import Map from "../objects/Map.js";
import Vector from "../../lib/Vector.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";
import CreatureFactory from "../services/CreatureFactory.js";
import Creature from "../entities/Creature/Creature.js";
import { stateMachine, CANVAS_WIDTH, CANVAS_HEIGHT } from "../globals.js";
import GameStateName from "../enums/GameStateName.js";
import UserInterface from "./UserInterface.js";
import Tile from "./Tile.js";
import Crystal from "./Crystal.js";
import ItemType from "../enums/ItemType.js";
import FireTorch from "./FireTorch.js";
import CreatureType from "../enums/CreatureType.js";
import Key from "./Key.js";
import BigBoss from "../entities/Creature/BigBoss.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import SaveManager from "../services/SaveManager.js";
export default class Region {
  constructor(mapDefinition, creatureConfig = [], isWinter = false) {
    this.isWinter = isWinter;
    this.map = new Map(mapDefinition, isWinter);
    this.creatures = this.spawnCreatures(creatureConfig);

    // Once we have the creature now we decide which one will keep the item
    this.assignItemToCreature(this.creatures, ItemType.Crystal);
    this.assignItemToCreature(this.creatures, ItemType.FireTorch);

    this.player = new Player(this); // Pass the region instance to the player
    /**
     * Items present in the region (e.g., crystals, fire torch, Key etc.)
     * @type {Array[Crystal|FireTorch|Key]}
     */
    this.items = [];

    this.items.push(new Crystal(new Vector(150, 100))); // turn on to test ability usage
    this.items.push(new FireTorch(new Vector(150, 150))); // turn on to test ability usage
    this.items.push(new Key(new Vector(150, 50))); // turn on to test ability usage

    // Assign player reference to all creatures so they can chase
    this.creatures.forEach((creature) => {
      creature.player = this.player;
    });

    // All entities in the region
    this.entities = [this.player, ...this.creatures];
    // All objects in the region
    /**
     * Objects present in the region (e.g., FireFlame added by the player during ability usage, etc.)
     * @type {Array[FireTorch|Crystal|Key|FireFlame]}
     */
    this.objects = []; // contain objects like FireFlame added by the player, etc. more later

    this.collisionLayer = this.map.collisionLayer;
    this.renderQueue = this.buildRenderQueue();
    this.isVictory = false;
    this.ui = new UserInterface(this.player, this);
  }

  update(dt) {
    if (this.isGameOver()) return;
    // Rebuild render queue each frame to account for movement
    this.renderQueue = this.buildRenderQueue();
    this.cleanUpEntities();
    this.cleanUpObjects();
    this.updateEntities(dt);
    this.updateObjects(dt);
    this.updateItems(dt);
    this.checkVictory();
    // check Victory: check if player reached goal (final boss defeated, key collected,)

    // check RegionConquered (if all creatures defeated, etc.)
    // Thoughts: later maybe add a time before transition to next region, player need to collect the item to gain ability otherwise it would be hard for next region
  }
  /**
   * Check if player reached victory conditions (e.g., final boss defeated, key collected,)
   * Update isVictory, then start processing Victory by calling processVictory()
   */
  checkVictory() {
    // Only check if victory hasn't been triggered yet
    if (this.isVictory) return;
    
    // check if player reached goal (final boss defeated, key collected,)
    const hasKey = this.player.itemCollected.some(
      (item) => item.itemType === ItemType.Key
    );
    if (hasKey) {
      console.log("Player had the key to escape the world!");
      this.isVictory = true;
      // process victory (transition to next region or game win state)
      // start the transition to next region or game win state
      this.processVictory();
    }
  }
  /**
   * Called when victory conditions are met
   * Handle transition, UI, juicy, sound effects
   */
  processVictory() {
    this.playWinningEffect();
    // Implement the logic for processing victory
  }
  /**
   * Plays winning effect: screen flash + shake, then transitions to Victory Screen
   * Written by Lin, update by Cuong
   */
  playWinningEffect() {
    const canvas = document.querySelector("canvas");
    const playState = stateMachine.states[GameStateName.Play];

    // First flash white
    canvas.style.filter = "brightness(2.5)";

    setTimeout(() => {
      // then flash dark
      canvas.style.filter = "brightness(0.3)";

      // Screen shake
      let shakes = 0;
      const interval = setInterval(() => {
        canvas.style.transform = `translate(${(Math.random() - 0.5) * 6}px, ${
          (Math.random() - 0.5) * 6
        }px)`;
        shakes++;

        if (shakes >= 12) {
          clearInterval(interval);
          canvas.style.transform = "";
          canvas.style.filter = ""; // reset filter
          this.isDead = true;

          setTimeout(() => {
            stateMachine.change(GameStateName.Transition, {
              fromState: playState,
              toState: stateMachine.states[GameStateName.Victory],
            });
          }, 7000); // delay before transitioning to Victory Screen to play the sound effect 
        }
      }, 50);
    }, 200);
  }
  render() {
    this.map.render(); // ← render map

    this.renderQueue.forEach((entity) => {
      if (entity) entity.render();
    }); // ← render all entities in the render queue
    this.objects.forEach((object) => {
      object.render();
    });
    this.map.renderTop();
    this.ui.render();

    this.items.forEach((item) => {
      if (item) item.render();
    });
  }
  /**
   * Update all objects in the region (Player's abilitys objects, items(Crystal, FireTorch, etc.) etc.)
   */
  updateObjects(dt) {
    this.objects.forEach((object) => {
      object.update(dt);
    });
  }
  /**
   * Adds an object to the region, such as FireFlame added by the player during PerformingFireFlameState
   * @param {*} object
   */
  addObject(object) {
    this.objects.push(object);
  }

  updateItems(dt) {
    this.items.forEach((item) => {
      if (item) item.update(dt);
    });
  }

  /**
   * Update all entities in the region,
   * If any logic needs to be applied for specific entity types, handle them here (colision, AI, dead, onHit, onConsume, etc)
   * Check collisions between creatures and objects (FireFlame, FrozenBlast, SwordHitbox etc.)
   * Check collision between creatures and environment
   * Check collisions between player and creatures
   * Check collisions between player and items
   * Check collisions between player and objects
   * @param {*} dt
   */

  updateEntities(dt) {
    this.entities.forEach((entity) => {
        if (entity.health <= 0) {
        entity.isDead = true;
        }
        if(!this.isVictory){
            // Specific logic for Creature entities
            if (entity instanceof Creature) {
                const oldX = entity.position.x;
                const oldY = entity.position.y;
                
                this.checkCreatureCollisions(entity, oldX, oldY);
                
                //Creatures deal with player's ability objects in the region (FireFlame, FrozenFlame's hitbox , etc.)
                this.checkCollisionWithObjects(entity);
                
                // Creature deal with player's sword hit or ability hit
                if (
                    !entity.isHurt &&
                    entity.didCollideWithEntity(this.player.swordHitbox)
                ) {
                    entity.onTakingHit(this.player.damage);
                }
                
                // Player deal with creatures' attack (hitbox, sword, attack)
                if (this.isEntityReadyToTakeDamage(entity)) {
                    this.player.onTakingDamage(entity.damage);
                }
                
                // Specific logic for Player entity
                
            } else if (entity instanceof Player) {
                // Player specific update logic can go here
                this.checkCollisionWithItem(entity);
            }
        }
        entity.update(dt);
    });

    // Check game over
    if (this.isGameOver()) {
        stateMachine.change(GameStateName.Transition, {
            fromState: stateMachine.currentState,
            toState: stateMachine.states[GameStateName.GameOver],
            toStateEnterParameters: { score: this.score },
        });
    }
    // Check all creatures isDead
    this.checkRegionTransition();
  }
  /**
   * Checks if conditions are met to transition from summer to winter region.
   * Triggers transition when all enemies are defeated in summer.
   */
  checkRegionTransition() {
    if (this.isWinter || this.isGameOver()) return;

    const allEnemiesDead =
      this.creatures.length > 0 && this.creatures.every((c) => c.isDead);

    if (allEnemiesDead) {
      this.isGameOver = true;

      // 2.Save game when transit region
      SaveManager.save(this.player, this);

      stateMachine.change(GameStateName.Transition, {
        fromState: stateMachine.states[GameStateName.Play],
        toState: stateMachine.states[GameStateName.Play],
        toStateEnterParameters: { isWinter: true },
      });
    }
  }
  /**
   * Check if the entity is ready to take damage from the player.
   * - Not dead
   * - Player is not invulnerable
   * - Entity has contact damage
   * - Player's hitbox collides with entity's hitbox
   * - Player is not in FallingDownToEarth state
   * @param {*} entity
   * @returns {boolean} true if entity can take damage
   */
  isEntityReadyToTakeDamage(entity) {
    return (
        !entity.isDead &&
        !this.player.isInVulnerable &&
        entity.isContactDamage &&
        this.player.hitbox &&
        entity.hitbox.didCollide(this.player.hitbox) &&
        this.player.stateMachine.currentState.name != PlayerStateName.FallingDownToEarth &&
        !this.isVictory
    );
  }
    /**
     * Check if the game is over.
     * @returns {boolean} true if game over conditions met
     */
    isGameOver() {
        return this.player.isDead && this.player.lives < 0 && !this.isVictory;
    }

    /**
     * Check if player collides with any item in the region (e.g., Crystal, FireTorch, Key), but not during FallingDownToEarth state
     * Performs onConsume on the item, and onCollectItem on the player
     * @param {Player} player
     */
    checkCollisionWithItem(player) {
        if(this.player.stateMachine.currentState.name != PlayerStateName.FallingDownToEarth) {
            // Player is not falling, check for item collection
            this.items.forEach((item, index) => {
                
                // Player is not falling, check for item collection
                
                if (player.didCollideWithEntity(item.hitbox)) {
                    if (item instanceof Crystal || item instanceof FireTorch) {
                        item.onConsume();
                        player.onCollectItem(item);
                        // Remove item from region after consumption
                        this.items.splice(index, 1);
                    } else if (item instanceof Key) {
                        // Victory condition will be checked in checkVictory() method
                        item.onConsume();
                        player.onCollectItem(item);
                        this.items.splice(index, 1);
                    }
                }
            });
        }
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
    return (
        topLeftTile === null &&
        topRightTile === null &&
        bottomLeftTile === null &&
        bottomRightTile === null
    );
    }
    /**
     * Check for collisions between an Creature and all objects in the region such as FireFlame, etc.
     * Call Creature's onTakingHit method to process if collision detected
     * @param {Creature} entity
     */
    checkCollisionWithObjects(entity) {
        this.objects.forEach((object) => {
            if (entity.didCollideWithEntity(object.hitbox)) {
                entity.onTakingHit(object.damage);
            }
        });
    }

    /**
     * Spawns creatures based on the provided configuration.
     * Each creature type can have different spawn position ranges.
     * Uses collision checking to avoid overlapping creatures.
     *
     * @param {Array} config - Array of creature definitions with type and count
     * @returns {Array} Array of spawned creature instances
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
        // Try to find a valid spawn position
        do {
          // BigBoss spawns in upper area (smaller range due to large size)
          if (def.type === CreatureType.BigBoss) {
            const x = getRandomPositiveInteger(50, 200);
            const y = getRandomPositiveInteger(10, 50);
            position = new Vector(x, y);
          } else {
            // Other creatures spawn in wider area
            const x = getRandomPositiveInteger(50, 330);
            const y = getRandomPositiveInteger(50, 150);
            position = new Vector(x, y);
          }
          attempts++;
        } while (
          this.isPositionOccupied(position, creatures) &&
          attempts < maxAttempts
        );
        // Only spawn if valid position found within max attempts
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
   * If the creature is BigBoss, assign the Key to it, otherwise assign the provided item to a random creature
   * @param {[Creature]} creatures list of all creature
   * @param {ItemType} itemType type of item to be kept
   * @param {number|null} specificCreatureIndex
   */
  assignItemToCreature(creatures, itemType, specificCreatureIndex = null) {
    if (creatures.length === 0) return;
    creatures.forEach((creature) => {
      if (creature instanceof BigBoss) {
        creature.keepItem(ItemType.Key);
        console.log(`BigBoss will keep item of type Key ${ItemType.Key}`);

      } else{
            // Randomly select a creature to keep the item
          const randomIndex =
          specificCreatureIndex !== null
          ? specificCreatureIndex
          : getRandomPositiveInteger(0, creatures.length - 1);

        creatures[randomIndex].keepItem(itemType);
        console.log(
          `Creature at index ${randomIndex} will keep item of type ${itemType}`
        );
      }
    }); 
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
    return [...this.entities, ...this.items].sort((a, b) => {
      let order = 0;
      const bottomA = a.hitbox.position.y + a.hitbox.dimensions.y;
      const bottomB = b.hitbox.position.y + b.hitbox.dimensions.y;

      if (a.renderPriority < b.renderPriority) {
        order = -1;
      } else if (a.renderPriority > b.renderPriority) {
        order = 1;
      } else {
        order = bottomA - bottomB;
      }
      return order;
    });
  }
  /**
   * Update the render queue to ensure the correct drawing order
   */
  updateRenderQueue() {
    this.renderQueue = this.buildRenderQueue();
  }
  /**
   * Cleans up dead entities from the region, except the player
   */
  cleanUpEntities() {
    // Only remove dead creatures, NOT the player
    // We need to keep the player in the entities array to show death animation
    this.entities = this.entities.filter((entity) => {
      if (entity instanceof Player) {
        return true; // Always keep player
      }

      // If creature is dead and has an item, spawn it into the world
      if (entity.isDead && entity instanceof Creature && entity.itemKept) {
        console.log(
          `Creature died and dropped item at position:`,
          entity.itemKept.position
        );
        this.items.push(entity.itemKept); // Add to items array for collectables
        this.updateRenderQueue(); // Ensure it's rendered in order
        entity.itemKept = null; // Clear the reference so it doesn't get added multiple times
      }

      // 3.Save game when crature dies
      if (entity.isDead && entity instanceof Creature) {
        SaveManager.save(this.player, this);
      }
      return !entity.isDead; // Remove dead creatures
    });
  }
  /*  * Cleans up objects that are marked for cleanup from the region */
  cleanUpObjects() {
    this.objects = this.objects.filter((object) => !object.cleanUp);
  }
}
