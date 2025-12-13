import Spider from "../entities/Creature/Spider.js";
import Vector from "../../lib/Vector.js";
import Skeleton from "../entities/Creature/Skeleton.js";
import BigBoss from "../entities/Creature/BigBoss.js";

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
      case "skeleton":
        return new Skeleton(position);
      case "bigboss":
        return new BigBoss(position);
      default:
        throw new Error(`Unknown creature type: ${type}`);
    }
  }
}
