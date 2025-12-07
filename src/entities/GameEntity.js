import Hitbox from "../../lib/Hitbox.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import { context } from "../globals.js";

export default class GameEntity {
	/**
	 * The base class to be extended by all entities in the game.
	 *
	 * @param {object} entityDefinition
	 */
    constructor(entityDefinition = {}) {
        this.speed = entityDefinition.speed ?? 1;
		this.position = entityDefinition.position ?? new Vector();
		this.damage = entityDefinition.damage ?? 1;
        this.isAttacking = false;
        this.dimensions = entityDefinition.dimensions ?? new Vector();
		
		

		this.totalHealth = entityDefinition.health ?? 1;
		this.health = this.totalHealth;
		this.sprites = [];
		this.currentAnimation = null;
        this.direction = Direction.Down;


		this.stateMachine = null;
		this.isDead = false;
		this.cleanUp = false;
		this.renderPriority = 0;
	}

	update(dt) {
		// Update animation if it exists
		if (this.currentAnimation) {
			this.currentAnimation.update(dt);
		}
	}

	render(offset = { x: 0, y: 0 }) {
        const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;
        
		// Safety check: make sure both currentAnimation and sprites exist
		if (this.currentAnimation && this.sprites.length > 0) {
			// render the current frame of the animation: get current frame index from animation, then get the sprite at that index, then render it
			this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y));
		}
	}
    changeState(stateName, params) {
        // this.stateMachine.change(stateName, params);
    }

}
