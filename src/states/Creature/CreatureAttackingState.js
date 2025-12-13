import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";
import CreatureStateName from "../../enums/CreatureStateName.js";
import { sounds } from "../../globals.js";
import SoundName from "../../enums/SoundName.js";
/**
 * CreatureAttackingState - Handles creature attack behavior.
 *
 * When a creature enters this state, it faces the player and performs
 * a timed attack. Damage is dealt at the midpoint of the attack animation
 * if the creature's hitbox collides with the player.
 *
 * Flow: Enter → Face player → Attack animation → Deal damage → Return to Chasing
 */
export default class CreatureAttackingState extends State {
  static ATTACK_DURATION = 0.5;

  /**
   * Creates a new CreatureAttackingState.
   * @param {Creature} creature - The creature performing the attack.
   * @param {Object} animations - Direction-keyed animation map.
   */
  constructor(creature, animations) {
    super();
    this.creature = creature;
    this.animations = animations;
    this.attackTimer = 0;
    this.hasDealtDamage = false;
  }
  /**
   * Resets attack state, faces the player, and starts attack animation.
   */
  enter() {
    this.attackTimer = 0;
    this.hasDealtDamage = false;

    // update direction and face on player
    const player = this.creature.player;
    if (player) {
      const creatureCenter = this.creature.getCenter();
      const playerCenterX =
        player.hitbox.position.x + player.hitbox.dimensions.x / 2;
      const dx = playerCenterX - creatureCenter.x;
      this.creature.direction = dx < 0 ? Direction.Left : Direction.Right;
    }
    sounds.play(SoundName.Hit);
    this.creature.currentAnimation = this.animations[this.creature.direction];
    this.creature.currentAnimation.refresh();
  }

  /**
   * Updates attack timer and deals damage at midpoint.
   * @param {number} dt - Delta time since last frame.
   */
  update(dt) {
    this.attackTimer += dt;
    // attack center
    if (
      !this.hasDealtDamage &&
      this.attackTimer >= CreatureAttackingState.ATTACK_DURATION / 2
    ) {
      this.dealDamage();
      this.hasDealtDamage = true;
    }

    // finish attack
    if (this.attackTimer >= CreatureAttackingState.ATTACK_DURATION) {
      this.creature.changeState(CreatureStateName.Chasing);
    }
  }

  /**
   * Checks collision with player and applies damage if hit.
   */
  dealDamage() {
    const player = this.creature.player;

    console.log(
      "⚔️ dealDamage called, creature:",
      this.creature.constructor.name
    );

    // stop attack if player health is less than zero
    // if (!player || player.health <= 0) return;
    if (!player || player.isDead) return;
    console.log(
      "Creature hitbox:",
      this.creature.hitbox.position,
      this.creature.hitbox.dimensions
    );
    console.log(
      "Player hitbox:",
      player.hitbox.position,
      player.hitbox.dimensions
    );

    if (this.creature.hitbox.didCollide(player.hitbox)) {
      player.onTakingDamage(this.creature.damage);
      console.log(
        "📌 " + this.creature.constructor.name + " hit player! Player health:",
        player.health
      );
    } else {
      console.log("❌ " + this.creature.constructor.name + " missed player");
    }
  }
}
