export default class UserInterface {
  constructor(player, region) {
    this.player = player;
    this.region = region;
  }
  render() {
    this.renderHealth();
    this.renderScore();
  }
  renderHealth() {
    context.fillStyle = "#FF0000";
    context.font = `12px ${FontName.MedievalSharp}`;
    context.textAlign = "left";

    // use heart to represent health
    let hearts = "";
    for (let i = 0; i < this.player.health; i++) {
      hearts += "❤️";
    }
    context.fillText(hearts, 10, 15);
  }
}
