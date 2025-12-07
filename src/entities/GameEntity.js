import Hitbox from "../../lib/Hitbox.js";
import Vector from "../../lib/Vector.js";
// import Direction from "../enums/Direction.js";
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

		this.stateMachine = null;
		this.currentAnimation = null;
		this.direction;;
		this.isDead = false;
		this.cleanUp = false;
		this.renderPriority = 0;
	}

	update(dt) {

	}

	render(offset = { x: 0, y: 0 }) {


	}

}
