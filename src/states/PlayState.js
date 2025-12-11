import State from "../../lib/State.js";
import Region from "../objects/Region.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";
import { sounds } from "../globals.js";
import SoundName from "../enums/SoundName.js";
export default class PlayState extends State {
  constructor(mapDefinition) {
    super();

    const summerCreatures = [
      {
        type: "spider",
        count: getRandomPositiveInteger(3, 5),
      },
      { type: "skeleton", count: getRandomPositiveInteger(2, 3) },
    ];

    this.region = new Region(mapDefinition, summerCreatures);
  }
  enter() {
    sounds.play(SoundName.Summer);
  }
  update(dt) {
    this.region.update(dt);
  }
  render() {
    this.region.render();
  }
  exit() {
    sounds.stop(SoundName.Summer);
  }
}
