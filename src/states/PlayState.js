import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import Map from "../objects/Map.js";
import Region from "../objects/Region.js";

export default class PlayState extends State {
  constructor(mapDefinition) {
    super();
    this.region = new Region(mapDefinition);
  }
  render() {
    this.region.render(); 
  }
}
