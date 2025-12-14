import State from "../../lib/State.js";
import Region from "../objects/Region.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";
import { sounds, stateMachine } from "../globals.js";
import SoundName from "../enums/SoundName.js";
import GameStateName from "../enums/GameStateName.js";
import CreatureType from "../enums/CreatureType.js";
import SaveManager from "../services/SaveManager.js";

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
    const loadSave = params.loadSave || false;

    this.currentSeason = isWinter ? "winter" : "summer";

    if (isWinter) {
      sounds.play(SoundName.Winter);
      const winterCreatures = [{ type: CreatureType.BigBoss, count: 1 }];
      this.region = new Region(
        this.winterMapDefinition,
        winterCreatures,
        isWinter
      );
    } else {
      sounds.play(SoundName.Summer);
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
    // restore the player's status from save data if loadSave is true
    if (loadSave) {
      const saveData = SaveManager.load();
      if (saveData) {
        this.region.player.health = saveData.health;
        this.region.player.lives = saveData.lives;
        this.region.player.position.x = saveData.playerX;
        this.region.player.position.x = saveData.playery;
      }
    }
  }
  update(dt) {
    this.region.update(dt);

    // Check if player is dead and ready to transition to game over
    if (
      this.region.player.isDead &&
      this.region.player.canTransitionToGameOver &&
      this.region.player.lives < 0
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
    sounds.stop(
      this.currentSeason === "winter" ? SoundName.Winter : SoundName.Summer
    );
  }
}
