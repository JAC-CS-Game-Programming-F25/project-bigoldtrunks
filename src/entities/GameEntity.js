import { DEBUG, context } from "../globals.js";
import Hitbox from "../../lib/Hitbox.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";

export default class GameEntity {
  /**
   * The base class to be extended by all entities in the game.
   *
   * @param {object} entityDefinition
   */
  constructor(entityDefinition = {}) {
    //What is implementing
    this.dimensions = entityDefinition.dimensions ?? new Vector();
    this.sprites = [];
    this.currentAnimation = null;
    this.direction = Direction.Down;
    this.position = entityDefinition.position ?? new Vector();
    this.stateMachine = null;

    //What's haven't been implemented yet
    this.speed = entityDefinition.speed ?? 1;
    this.damage = entityDefinition.damage ?? 1;
    this.isAttacking = false;

    this.totalHealth = entityDefinition.health ?? 1;
    this.health = this.totalHealth;

    // Add hitbox
    this.hitboxOffsets = entityDefinition.hitboxOffsets ?? new Hitbox();
    this.hitbox = new Hitbox(
      this.position.x + this.hitboxOffsets.position.x,
      this.position.y + this.hitboxOffsets.position.y,
      this.dimensions.x + this.hitboxOffsets.dimensions.x,
      this.dimensions.y + this.hitboxOffsets.dimensions.y
    );

    this.isDead = false;
    this.cleanUp = false;
    this.renderPriority = 0;
  }

  update(dt) {
    // Update state machine if it exists
    if (this.stateMachine) {
      this.stateMachine.update(dt);
    }

    // Update animation if it exists
    if (this.currentAnimation) {
      this.currentAnimation.update(dt);
    }

    // Update hitbox position
    this.hitbox.set(
      this.position.x + this.hitboxOffsets.position.x,
      this.position.y + this.hitboxOffsets.position.y,
      this.dimensions.x + this.hitboxOffsets.dimensions.x,
      this.dimensions.y + this.hitboxOffsets.dimensions.y
    );
  }

  render(offset = { x: 0, y: 0 }) {
    const x = this.position.x + offset.x;
    const y = this.position.y + offset.y;

    // Render state machine if it exists
    if (this.stateMachine) {
      this.stateMachine.render();
    }

    // Safety check: make sure both currentAnimation and sprites exist
    if (this.currentAnimation && this.sprites.length > 0) {
      // render the current frame of the animation: get current frame index from animation, then get the sprite at that index, then render it
      this.sprites[this.currentAnimation.getCurrentFrame()].render(
        Math.floor(x),
        Math.floor(y)
      );
    }
    // Debug render hitbox
    if (DEBUG) {
      this.hitbox.render(context);
    }
  }
  /**
   * Checks for collision with another entity's hitbox.
   * @param {*} hitbox 
   * @returns {boolean}
   */
  didCollideWithEntity(hitbox) {
    return this.hitbox.didCollide(hitbox);
  }

  changeState(stateName, params) {
    if (this.stateMachine) {
      this.stateMachine.change(stateName, params);
    }
  }
}
