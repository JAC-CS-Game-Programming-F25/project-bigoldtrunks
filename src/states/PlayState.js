import State from "../../lib/State.js";
import Region from "../objects/Region.js";
import { getRandomPositiveInteger } from "../../lib/Random.js";
import {
  sounds,
  stateMachine,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "../globals.js";
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

    if (loadSave) {
      this.loadSaveGame(isWinter);
    } else {
      this.StartNewGame(isWinter);
    }
  }

  /**
   * Starts a new game with fresh creatures.
   */
  StartNewGame(isWinter) {
    let creatures;

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
      this.region = new Region(this.summerMapDefinition, summerCreatures, isWinter);
    }
    // 1. Save game when start new game
    SaveManager.save(this.region.player, this.region);
  }

  /**
   * Loads saved game and restores player/creature state.
   */
  loadSaveGame(isWinter) {
    const saveData = SaveManager.load();
    let creatures;

    if (isWinter) {
      sounds[SoundName.Winter].play();
      creatures = [
        { type: CreatureType.BigBoss, count: saveData.aliveBigBoss || 0 },
      ];
      this.region = new Region(this.winterMapDefinition, creatures, isWinter);
    } else {
      sounds[SoundName.Summer].play();
      creatures = [
        { type: CreatureType.Spider, count: saveData.aliveSpiders || 0 },
        { type: CreatureType.Skeleton, count: saveData.aliveSkeletons || 0 },
      ];
      this.region = new Region(this.summerMapDefinition, creatures, isWinter);
    }

    // restore player status
    this.region.player.health = saveData.health || 3;
    this.region.player.lives = saveData.lives || 3;

    this.region.player.position.x = saveData.playerX;
    this.region.player.position.y = saveData.playerY;

    if (saveData.abilityUnlocked) {
      this.region.player.abilityUnlocked = saveData.abilityUnlocked;
    }

    if (saveData.playerDirection !== undefined) {
      this.region.player.setDirection(saveData.playerDirection);
    }
    // restore BigBoss health
    if (isWinter && saveData.bigBossHealth) {
      const bigBoss = this.region.creatures.find(
        (c) => c.creatureType === CreatureType.BigBoss
      );
      if (bigBoss) {
        bigBoss.health = saveData.bigBossHealth;
      }
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
