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

    context.font = `8px ${FontName.MedievalSharp}`;
    context.textAlign = "left";

    // use heart to represent health
    let hearts = "";
    for (let i = 0; i < this.player.health; i++) {
      hearts += "❤️";
    }
    context.fillText(hearts, 10, 18);

    // lives
    let lives = "";
    for (let i = 0; i < this.player.lives; i++) {
      lives += "🧍";
    }
    context.fillText(lives, 10, 32);
  }
  /**
   * Renders unlocked abilities and collected items in top-right corner.
   */
  renderAbilities() {
    // Render Frozen Blast icon if ability is unlocked
    if (this.player.abilityUnlocked[AbilityType.FrozenFlame]) {
      const iconX = CANVAS_WIDTH - 20;
      const iconY = 10;
      
      // Draw cooldown indicator circle
      this.renderAbilityCooldown(iconX, iconY, AbilityType.FrozenFlame);
      
      context.textAlign = "right";
      context.font = `15px ${FontName.MedievalSharp}`;
      context.fillText("❄️", CANVAS_WIDTH - 10, 17);
    }
    if (this.player.abilityUnlocked[AbilityType.FireFlame]) {
      const iconX = CANVAS_WIDTH - 20;
      const iconY = 33;
      
      // Draw cooldown indicator circle
      this.renderAbilityCooldown(iconX, iconY, AbilityType.FireFlame);
      
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
   * Renders a circular cooldown indicator around an ability icon.
   * @param {number} x - Center X position of the circle
   * @param {number} y - Center Y position of the circle
   * @param {string} abilityType - The ability type to check cooldown for
   */
  renderAbilityCooldown(x, y, abilityType) {
    const radius = 12;
    const lineWidth = 2;
    
    // If ability is on cooldown, draw the progress arc
    if (this.player.abilityCooldowns[abilityType]) {
      const cooldownStartTime = this.player.abilityCooldowns[abilityType];
      const elapsed = Date.now() - cooldownStartTime;
      const cooldownDuration = 2000; // 2 seconds in milliseconds
      const progress = Math.min(elapsed / cooldownDuration, 1);
      
      // Draw background circle (darker)
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.strokeStyle = "rgba(0, 0, 0, 0.3)";
      context.lineWidth = lineWidth;
      context.stroke();
      
      // Draw progress arc (starts from top, goes clockwise)
      if (progress < 1) {
        context.beginPath();
        context.arc(
          x, 
          y, 
          radius, 
          -Math.PI / 2, // Start at top
          -Math.PI / 2 + (Math.PI * 2 * progress), // Progress clockwise
          false
        );
        context.strokeStyle = abilityType === AbilityType.FrozenFlame 
          ? "rgba(100, 200, 255, 0.8)"  // Ice blue for frozen
          : "rgba(255, 100, 50, 0.8)";   // Fire orange for fire
        context.lineWidth = lineWidth;
        context.stroke();
      } else {
        // Cooldown complete - draw full bright circle
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.strokeStyle = abilityType === AbilityType.FrozenFlame 
          ? "rgba(100, 200, 255, 1)"  // Ice blue
          : "rgba(255, 150, 50, 1)";   // Fire orange
        context.lineWidth = lineWidth;
        context.stroke();
      }
    } else {
      // No cooldown - draw ready indicator (full bright circle)
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.strokeStyle = abilityType === AbilityType.FrozenFlame 
        ? "rgba(100, 200, 255, 1)"  // Ice blue
        : "rgba(255, 150, 50, 1)";   // Fire orange
      context.lineWidth = lineWidth;
      context.stroke();
    }
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
