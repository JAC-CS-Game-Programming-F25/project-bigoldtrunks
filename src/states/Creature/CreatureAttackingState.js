import State from "../../../lib/State.js";
export default class CreatureAttackingState extends State {
  static ATTACK_RANGE = 20;
  static ATTACK_DURATION = 0.5;
  static ATTACK_COOLDOWN = 1;

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
    this.creature.currentAnimation = this.animations[this.creature.direction];
    this.setAttackHitbox();
  }

  setAttackHitbox() {
    const hitbox = this.creature.hitbox;
    const attackWidth = 20;
    const attackHeight = 16;

    if (this.creature.direction === Direction.Left) {
      this.creature.attackHitbox.set(
        hitbox.position.x - attackWidth,
        hitbox.position.y,
        attackWidth,
        attackHeight
      );
    } else {
      this.creature.attackHitbox.set(
        hitbox.position.x + hitbox.dimensions.x,
        hitbox.position.y,
        attackWidth,
        attackHeight
      );
    }
  }

  update(dt) {
    this.attackTimer += dt;

    // attack center
    if (
      !this.hasDealtDamage &&
      this.attackTimer >= CreatureAttackingState.ATTACK_DURATION / 2
    ) {
      this.checkHitPlayer();
      this.hasDealtDamage = true;
    }

    // finish attack
    if (this.attackTimer >= CreatureAttackingState.ATTACK_DURATION) {
      this.creature.attackHitbox.set(0, 0, 0, 0); // clear hitbox
      this.creature.changeState(CreatureStateName.Chasing);
    }
  }

  checkHitPlayer() {
    const player = this.creature.player;
    if (player && this.creature.attackHitbox.didCollide(player.hitbox)) {
      player.onTakingDamage(this.creature.damage);
    }
  }
}
