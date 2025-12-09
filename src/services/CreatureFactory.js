import Spider from "../entities/Spider.js";
import Vector from "../../lib/Vector.js";

export default class CreatureFactory {
  /**
   * Creates a creature instance based on type
   * @param {string} type - creature type ("spider", "slime", etc)
   * @param {Vector} position - spawn position
   * @returns {Creature} creature instance
   */
  static createInstance(type, position) {
    switch (type) {
      case "spider":
        return new Spider(position);
      default:
        throw new Error(`Unknown creature type: ${type}`);
    }
  }
}
