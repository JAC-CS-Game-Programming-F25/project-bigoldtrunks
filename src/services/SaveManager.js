import CreatureType from "../enums/CreatureType.js";
export default class SaveManager {
  // localStorage key
  static SAVE_KEY = "mystiaJungle_save";

  static save(player, region) {
    /**
     * Saves current game state to localStorage.
     */

    // Bigboss health
    const bigBoss = region.creatures.find(
      (c) => c.creatureType === CreatureType.BigBoss && !c.isDead
    );
    const saveData = {
      // player status
      health: player.health,
      lives: player.lives,
      playerX: player.position.x,
      playerY: player.position.y,
      playerDirection: player.direction,
      abilityUnlocked: player.abilityUnlocked,

      // region status
      isWinter: region.isWinter,

      // enemy status
      aliveSpiders: region.creatures.filter(
        (c) => c.creatureType === CreatureType.Spider && !c.isDead
      ).length,
      aliveSkeletons: region.creatures.filter(
        (c) => c.creatureType === CreatureType.Skeleton && !c.isDead
      ).length,
      aliveBigBoss: region.creatures.filter(
        (c) => c.creatureType === CreatureType.BigBoss && !c.isDead
      ).length,
      bigBossHealth:
        region.creatures.find(
          (c) => c.creatureType === CreatureType.BigBoss && !c.isDead
        )?.health ?? 0,
    };
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
    console.log("Game saved:", saveData);
  }
  /**
   * Loads game state from localStorage.
   * @returns {Object|null} Save data or null if no save exists.
   */
  static load() {
    const data = localStorage.getItem(this.SAVE_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Checks if a save file exists.
   */
  static hasSave() {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }

  /**
   * Checks if a save file exists.
   */
  static deleteSave() {
    localStorage.removeItem(this.SAVE_KEY);
    console.log("save deleted");
  }
}
