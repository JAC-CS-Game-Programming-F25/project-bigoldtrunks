import State from "../../../lib/State.js";
import CreatureStateName from "../../enums/CreatureStateName.js";
import { getRandomPositiveInteger } from "../../../lib/Random.js";
import { timer } from "../../globals.js";

export default class CreatureIdlingState extends State {
  static IDLE_DURATION_MIN = 2;
  static IDLE_DURATION_MAX = 5;

  constructor(creature, animations) {
    super();
    this.creature = creature;
    this.animations = animations;
  }

  enter() {
    this.creature.currentAnimation = this.animations[this.creature.direction];

    this.idleDuration = getRandomPositiveInteger(
      CreatureIdlingState.IDLE_DURATION_MIN,
      CreatureIdlingState.IDLE_DURATION_MAX
    );

    this.startTimer();
  }

  async startTimer() {
    await timer.wait(this.idleDuration);
    this.creature.changeState(CreatureStateName.Walking);
  }
}
