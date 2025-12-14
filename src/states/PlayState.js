import State from "../../lib/State.js";
import Region from "../objects/Region.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";
import { sounds, stateMachine } from "../globals.js";
import SoundName from "../enums/SoundName.js";
import GameStateName from "../enums/GameStateName.js";
import CreatureType from "../enums/CreatureType.js";

export default class PlayState extends State {
  constructor(summerMapDefinition, winterMapDefinition) {
    super();
    // this.mapDefinition = mapDefinition;
    this.summerMapDefinition = summerMapDefinition;
    this.winterMapDefinition = winterMapDefinition;
    this.currentSeason = "summer";
  }
  enter(params = {}) {
    const isWinter = params.isWinter || false;
    this.currentSeason = isWinter ? "winter" : "summer";

    if (isWinter) {
      sounds[SoundName.Winter].play();
      const winterCreatures = [{ type: CreatureType.BigBoss, count: 1 }];
      this.region = new Region(
        this.winterMapDefinition,
        winterCreatures,
        isWinter
      );
    } else {
      sounds[SoundName.Summer].play();
      const summerCreatures = [
        { type: CreatureType.Spider, count: getRandomPositiveInteger(3, 5) },
        { type: CreatureType.Skeleton, count: getRandomPositiveInteger(2, 3) },
      ];
      this.region = new Region(
        this.summerMapDefinition,
        summerCreatures,
        isWinter
      );
    }
  }
  update(dt) {
    this.region.update(dt);

    // Check if player is dead and ready to transition to game over
    if (
      this.region.player.isDead &&
      this.region.player.canTransitionToGameOver &&
      this.region.player.lives <= 0
    ) {
      stateMachine.change(GameStateName.Transition, {
        fromState: this,
        toState: stateMachine.states[GameStateName.GameOver],
      });
    }
  }
  render() {
    this.region.render();
  }
  exit() {
    const soundName = this.currentSeason === "winter" ? SoundName.Winter : SoundName.Summer;
    sounds[soundName].stop();
  }
}
