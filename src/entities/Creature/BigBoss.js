import Direction from "../../enums/Direction.js";
import Vector from "../../../lib/Vector.js";
export default class BigBoss extends Creature {
  static WIDTH = 128;
  static HEIGHT = 128;
  static SPEED = 25;
  static HEALTH = 500;
  constructor(position) {
    super({
      position,
      speed: BigBoss.SPEED,
      health: BigBoss.HEALTH,
      damage: 2,
      canChase: true,
      dimensions: new Vector(BigBoss.WIDTH, BigBoss.HEIGHT),
    });
    this.direction = Direction.Left;
    this.loadSprites();
    this.setupAnimations();
    this.stateMachine = this.initializeStateMachine();
  }

  loadSprites() {}
  update() {}
  setupAnimations() {}
  initializeStateMachine() {}
  render() {}
}
