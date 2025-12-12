import State from "../../lib/State.js";
import Region from "../objects/Region.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";
import { sounds, stateMachine } from "../globals.js";
import SoundName from "../enums/SoundName.js";
import GameStateName from "../enums/GameStateName.js";

export default class PlayState extends State {
  constructor(mapDefinition) {
    super();
    this.mapDefinition = mapDefinition;
  }
  enter() {
    sounds.play(SoundName.Summer);
    const summerCreatures = [
      {
        type: "spider",
        count: getRandomPositiveInteger(3, 5),
      },
      { type: "skeleton", count: getRandomPositiveInteger(2, 3) },
    ];

    this.region = new Region(this.mapDefinition, summerCreatures);
  }
  update(dt) {
    this.region.update(dt);
    
    // Check if player is dead and transition to game over
    if (this.region.player.isDead) {
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
    sounds.stop(SoundName.Summer);
  }
}
