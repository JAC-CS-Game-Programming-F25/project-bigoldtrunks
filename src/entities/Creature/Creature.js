import Vector from "../../../lib/Vector.js";
import GameEntity from "../GameEntity.js";
import CreatureWalkingState from "../../states/Creature/CreatureWalkingState.js";
import Direction from "../../enums/Direction.js";
import CreatureChasingState from "../../states/Creature/CreatureWalkingState.js";
import { sounds } from "../../globals.js";
import SoundName from "../../enums/SoundName.js";
import ItemType from "../../enums/ItemType.js";
import Crystal from "../../objects/Crystal.js";
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
    this.isContactDamage = creatureDefinition.isContactDamage ?? false;
    this.isHurt = false;
    /**
     * Type of item this creature should drop when dead
     * @type {string|null}
     */
    this.itemTypeToKeep = null;
    /**
     * Item to be spawned when creature is dead (created at death time)
     * Item is managed by region after creature is dead, and is added to region.items during the removal process
     * @type {Crystal|FireTorch|null}
     */
    this.itemKept = null; // item to be kept when creature is dead
  }

  /**
   * Keep an item when the creature is dead, this is decided by the region through function assignItemToCreature 
   * @param {ItemType} itemType 
   */
  keepItem(itemType) {
    // Store which type of item to drop, create later upon death
    // The item will be created at death position in onTakingHit()
    this.itemTypeToKeep = itemType;
  }

  receiveDamage(damage) { 
    this.health -= damage;
    // play sound
    sounds.play(SoundName.EnemyHurt);
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

    // reduce health first
    this.health -= damage;

    if (this.health <= 0) {
      this.isDead = true; // Important: mark as dead so item can be dropped
      this.spawnItemIfKeep();

      sounds.play(SoundName.EnemyDead);
      console.log("Creature is dead, will drop item:", this.itemKept !== null);
      return;
    }
    // add glimmering after injured (Juice)

    this.isHurt = true;

    setTimeout(() => {
      this.isHurt = false;
    }, 300);
    console.log("Creature took damage, Creature current health:", this.health);
    // play sound when creature receives damage
    sounds.play(SoundName.EnemyHurt);
  }

  /**
   * Spawn the item that the creature is keeping at its death position
   */
  spawnItemIfKeep(){
    // Create the item at the creature's current death position
      if (this.itemTypeToKeep) {
        // Create a NEW Vector with current position values (not a reference)
        const deathPosition = new Vector(this.position.x, this.position.y);
        
        if (this.itemTypeToKeep === ItemType.Crystal) {
          this.itemKept = new Crystal(deathPosition);
          console.log(`Crystal created at death position: (${deathPosition.x}, ${deathPosition.y})`);
        } else if (this.itemTypeToKeep === ItemType.FireTorch) {
          // Fire torch initialize here when implemented
          // this.itemKept = new FireTorch(deathPosition);
        }
      }
  }

  update(dt) {
    super.update(dt);
    if (this.stateMachine) {
      this.stateMachine.update(dt);
    }
  }
  
  render(offset = { x: 0, y: 0 }) {
    super.render(offset);
  }

  getCenter() {
    const hb = this.hitbox;
    return {
      x: hb.position.x + hb.dimensions.x / 2,
      y: hb.position.y + hb.dimensions.y / 2,
    };
  }
}
