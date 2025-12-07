import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import Map from "../services/Map.js";

export default class PlayState extends State {
  constructor(mapDefinition) {
    super();
    this.map = new Map(mapDefinition);
    this.player = new Player()
  }
  render() {
    this.map.render(); // ← render map
    this.player.render(); // ← render player
  }
}
