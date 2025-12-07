import State from "../../lib/State.js";
import Map from "../services/Map.js";

export default class PlayState extends State {
  constructor(mapDefinition) {
    super();
    this.map = new Map(mapDefinition);
  }
  render() {
    this.map.render(); // ← render map
  }
}
