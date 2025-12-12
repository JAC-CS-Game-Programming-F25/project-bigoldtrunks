import { CANVAS_WIDTH, context } from "../globals.js";
import FontName from "../enums/FontName.js";
import AbilityType from "../enums/AbilityType.js";


export default class UserInterface {

  constructor(player, region) {
    this.player = player;
    this.region = region;
  
  }
  
  render() {
    this.renderHealth();
    this.renderAbilities();
  }
  renderHealth() {
    context.fillStyle = "#FF0000";
    context.font = `15px ${FontName.MedievalSharp}`;
    context.textAlign = "left";

    // use heart to represent health
    let hearts = "";
    for (let i = 0; i < this.player.health; i++) {
      hearts += "❤️";
    }
    context.fillText(hearts, 10, 15);
  }
  renderAbilities() {
    // Render Frozen Blast icon if ability is unlocked
    if (this.player.abilityUnlocked[AbilityType.FrozenFlame]) {
          context.textAlign = "right";
          context.font = `15px ${FontName.MedievalSharp}`;

          context.fillText("❄️", CANVAS_WIDTH - 10, 15);

    }
  }
}
