export default class SaveManager {
  static save(player, region) {
    /**
     * Saves current game state to localStorage.
     */
    const saveData = {
      health: player.health,
      lives: player.lives,
      isWinter: region.isWinter,
      playerX: player.position.x,
      playerY: player.position.y,
    };
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
    console.log("Game saved:", saveData);
  }
  /**
   * Loads game state from localStorage.
   * @returns {Object|null} Save data or null if no save exists.
   */
  static load() {
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
