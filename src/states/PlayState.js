import State from "../../lib/State.js";
import Region from "../objects/Region.js";

export default class PlayState extends State {
  constructor(mapDefinition) {
    super();
    this.region = new Region(mapDefinition);
  }
  update(dt) {
    this.region.update(dt);
  }
  render() {
    this.region.render();
  }
}
