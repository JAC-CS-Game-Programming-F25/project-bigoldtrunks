import { CANVAS_WIDTH, context } from "../globals.js";
import FontName from "../enums/FontName.js";
import AbilityType from "../enums/AbilityType.js";
import ItemType from "../enums/ItemType.js";

export default class UserInterface {
  constructor(player, region) {
    this.player = player;
    this.region = region;
  }

  render() {
    this.renderHealth();
    this.renderAbilities();
    this.renderEnemyInfo();
  }
  /**
   * Renders player health and lives in top-left corner.
   */
  renderHealth() {
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(5, 5, 70, 35);

    context.font = `10px ${FontName.MedievalSharp}`;
    context.textAlign = "left";

    // use heart to represent health
    context.fillStyle = "#FF0000";
    context.fillText(`❤️ ${this.player.health}`, 10, 18);

    // Lives
    context.fillStyle = "#FFD700";
    context.fillText(`🧍 x ${this.player.lives}`, 10, 32);
  }
  /**
   * Renders unlocked abilities and collected items in top-right corner.
   */
  renderAbilities() {
    // Render Frozen Blast icon if ability is unlocked
    if (this.player.abilityUnlocked[AbilityType.FrozenFlame]) {
      context.textAlign = "right";
      context.font = `15px ${FontName.MedievalSharp}`;

      context.fillText("❄️", CANVAS_WIDTH - 10, 17);
    }
    if (this.player.abilityUnlocked[AbilityType.FireFlame]) {
      context.textAlign = "right";
      context.font = `15px ${FontName.MedievalSharp}`;

      context.fillText("🔥", CANVAS_WIDTH - 10, 40);
    }

    // Check if player has collected a Key
    const hasKey = this.player.itemCollected.some(
      (item) => item.itemType === ItemType.Key
    );
    if (hasKey) {
      context.textAlign = "right";
      context.font = `15px ${FontName.MedievalSharp}`;

      context.fillText("🔑", CANVAS_WIDTH - 10, 63);
    }
  }

  /**
   * Renders remaining enemy count for summer region.
   */
  renderEnemyCount() {
    // creature counts
    const aliveCount = this.region.creatures.filter((c) => !c.isDead).length;
    context.fillStyle = "#FFFFFF";
    context.font = `12px ${FontName.MedievalSharp}`;
    context.textAlign = "center";
    context.fillText(`Enemies: ${aliveCount}`, CANVAS_WIDTH / 2, 15);
  }
  /**
   * Renders enemy count (summer) or boss health bar (winter).
   */
  renderEnemyInfo() {
    if (this.region.isWinter) {
      this.renderBossHealth();
    } else {
      this.renderEnemyCount();
    }
  }

  /**
   * Renders boss health bar for winter region.
   */
  renderBossHealth() {
    const boss = this.region.creatures.find((c) => !c.isDead);
    if (!boss) return;

    const barWidth = 100;
    const barHeight = 25;
    const x = CANVAS_WIDTH / 2 - barWidth / 2;
    const y = 5;

    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(x, y, barWidth + 10, barHeight);

    // health background
    context.fillStyle = "#333";
    context.fillRect(x + 5, y + 5, barWidth, 8);

    // bigBoss health
    const maxHealth = 500;
    const healthPercent = boss.health / maxHealth;
    context.fillStyle = "#FF0000";
    context.fillRect(x + 5, y + 5, barWidth * healthPercent, 8);

    context.fillStyle = "#FFFFFF";
    context.font = `10px ${FontName.MedievalSharp}`;
    context.textAlign = "center";
    context.fillText(
      `BOSS: ${boss.health}/${maxHealth}`,
      CANVAS_WIDTH / 2,
      y + 22
    );
  }
}
