import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";
import CreatureStateName from "../../enums/CreatureStateName.js";
import { sounds } from "../../globals.js";
import SoundName from "../../enums/SoundName.js";

export default class CreatureAttackingState extends State {
  static ATTACK_DURATION = 0.5;

  constructor(creature, animations) {
    super();
    this.creature = creature;
    this.animations = animations;
    this.attackTimer = 0;
    this.hasDealtDamage = false;
  }

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

  dealDamage() {
    const player = this.creature.player;
    console.log("⚔️ dealDamage called, player:", player);

    // stop attack if player health is less than zero
    // if (!player || player.health <= 0) return;
    if (!player) return;

    if (this.creature.hitbox.didCollide(player.hitbox)) {
      player.onTakingDamage(this.creature.damage);
      console.log("📌 Skeleton hit player! Player health:", player.health);
    }
  }
}
