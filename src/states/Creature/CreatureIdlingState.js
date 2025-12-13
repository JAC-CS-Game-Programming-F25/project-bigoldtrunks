import State from "../../../lib/State.js";
import CreatureStateName from "../../enums/CreatureStateName.js";
import { getRandomPositiveInteger } from "../../../lib/Random.js";
import { timer } from "../../globals.js";
/**
 * CreatureIdlingState - Creature stands still for a random duration.
 *
 * After a random wait (2-5 seconds), the creature transitions to Walking.
 * If a player enters detection range, the creature may switch to Chasing
 * (handled by parent class or creature logic).
 *
 * Flow: Enter → Wait random time → Walking
 */
export default class CreatureIdlingState extends State {
  static IDLE_DURATION_MIN = 2;
  static IDLE_DURATION_MAX = 5;
  /**
   * Creates a new CreatureIdlingState.
   * @param {Creature} creature - The creature that is idling.
   * @param {Object} animations - Direction-keyed animation map.
   */
  constructor(creature, animations) {
    super();
    this.creature = creature;
    this.animations = animations;
  }
  /**
   * Sets idle animation and starts the random wait timer.
   */
  enter() {
    this.creature.currentAnimation = this.animations[this.creature.direction];

    this.idleDuration = getRandomPositiveInteger(
      CreatureIdlingState.IDLE_DURATION_MIN,
      CreatureIdlingState.IDLE_DURATION_MAX
    );

    this.startTimer();
  }

  /**
   * Waits for idle duration then transitions to Walking state.
   */
  async startTimer() {
    await timer.wait(this.idleDuration);
    this.creature.changeState(CreatureStateName.Walking);
  }
}
