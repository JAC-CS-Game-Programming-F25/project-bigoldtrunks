import State from "../../lib/State.js";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  context,
  images,
  input,
  sounds,
  stateMachine,
} from "../globals.js";
import GameStateName from "../enums/GameStateName.js";
import Input from "../../lib/Input.js";
import SoundName from "../enums/SoundName.js";
import ImageName from "../enums/ImageName.js";
import FontName from "../enums/FontName.js";
import SaveManager from "../services/SaveManager.js";
/**
 * TitleScreenState - Main menu screen for MystiaJungle.
 *
 * Displays the game title, menu options (Start Game / Instructions),
 * and an optional instructions overlay. Plays title music while active.
 *
 * Controls:
 *   - W/↑, S/↓ - Navigate menu
 *   - Enter - Confirm selection
 *   - Enter/Escape - Close instructions panel
 */
export default class TitleScreenState extends State {
  /**
   * Creates a new TitleScreenState instance.
   * Initializes menu options and selection state.
   */
  constructor() {
    super();
    this.menuOptions = ["Start Game", "Instructions"];
    this.selectedIndex = 0;
    this.showInstructions = false;
    this.updateMenuOption();
  }

  enter() {
    sounds[SoundName.Title].play();
    this.updateMenuOption();
  }

  exit() {
    sounds[SoundName.Title].stop();
  }
  /**
   * Handles menu navigation and selection.
   * @param {number} dt - Delta time since last frame.
   */
  update(dt) {
    // if Instructions，any key close
    if (this.showInstructions) {
      if (
        input.isKeyPressed(Input.KEYS.ENTER) ||
        input.isKeyPressed(Input.KEYS.ESCAPE)
      ) {
        this.showInstructions = false;
      }
      return;
    }

    // ↑ or W
    if (
      input.isKeyPressed(Input.KEYS.ARROW_UP) ||
      input.isKeyPressed(Input.KEYS.W)
    ) {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.menuOptions.length) %
        this.menuOptions.length;
      sounds[SoundName.Select].play();
    }

    // ↓ or S
    if (
      input.isKeyPressed(Input.KEYS.ARROW_DOWN) ||
      input.isKeyPressed(Input.KEYS.S)
    ) {
      this.selectedIndex = (this.selectedIndex + 1) % this.menuOptions.length;
      sounds[SoundName.Select].play();
    }

    // Enter confirm
    if (input.isKeyPressed(Input.KEYS.ENTER)) {
      sounds[SoundName.Select].play();
      // decide action based on selected menu option
      const option = this.menuOptions[this.selectedIndex];
      if (option === "Continue") {
        const saveData = SaveManager.load();
        stateMachine.change(GameStateName.Transition, {
          fromState: this,
          toState: stateMachine.states[GameStateName.Play],
          toStateEnterParameters: {
            isWinter: saveData.isWinter,
            loadSave: true,
          },
        });
      } else if (option === "New Game") {
        SaveManager.deleteSave();
        stateMachine.change(GameStateName.Transition, {
          fromState: this,
          toState: stateMachine.states[GameStateName.Play],
          toStateEnterParameters: { isWinter: false },
        });
      } else if (option === "Instructions") {
        this.showInstructions = true;
      }
    }
  }
  /**
   * Renders the title screen with background, title, and menu.
   */
  render() {
    // background
    images.render(ImageName.Title, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.fillStyle = "rgba(0, 0, 0, 0.3)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // title
    context.fillStyle = "#4ECDC4";
    context.font = `50px ${FontName.Zelda}`;
    context.textAlign = "center";
    context.fillText("MystiaJungle", CANVAS_WIDTH / 2, 60);

    // subheading
    context.fillStyle = "#FFFFFF";
    context.font = `12px ${FontName.MedievalSharp}`;
    context.fillText("A Fantasy Real Escape", CANVAS_WIDTH / 2, 72);

    // Menu options
    this.menuOptions.forEach((option, index) => {
      const y = 100 + index * 28;

      if (index === this.selectedIndex) {
        context.fillStyle = "rgba(255, 255, 255, 0.2)";
        context.fillRect(CANVAS_WIDTH / 2 - 60, y - 14, 120, 24);

        context.fillStyle = "#FFD700";
        context.font = `14px ${FontName.MedievalSharp}`;
        context.fillText("▶ " + option, CANVAS_WIDTH / 2, y);
      } else {
        context.fillStyle = "#CCCCCC";
        context.font = `14px ${FontName.MedievalSharp}`;
        context.fillText(option, CANVAS_WIDTH / 2, y);
      }
    });

    // bottom
    context.fillStyle = "#888888";
    context.font = `10px ${FontName.MedievalSharp}`;
    context.fillText(
      "Use ↑↓ to select, Enter to confirm",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 15
    );

    if (this.showInstructions) {
      this.renderInstructions();
    }
  }
  /**
   * Renders the instructions overlay panel.
   */
  renderInstructions() {
    // Translucent background
    context.fillStyle = "#000000";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Title
    context.fillStyle = "#FFD700";
    context.font = `16px ${FontName.OpenSans}`;
    context.textAlign = "center";
    context.fillText("How to Play", CANVAS_WIDTH / 2, 30);

    // Controls
    context.fillStyle = "#FFFFFF";
    context.font = `12px ${FontName.OpenSans}`;
    context.fillText("Move:  W↑  S↓  A←  D→", CANVAS_WIDTH / 2, 50);
    context.fillText("Space-Sword   J-Fire   K-Frozen", CANVAS_WIDTH / 2, 64);

    // Description
    context.fillStyle = "#FFD700";
    context.font = `14px ${FontName.OpenSans}`;
    context.fillText("Goal", CANVAS_WIDTH / 2, 86);

    context.fillStyle = "#FFFFFF";
    context.font = `10px ${FontName.OpenSans}`;
    const description = [
      "Find the key to escape!",
      "Crystal → Frozen | Torch → Fire",
      "Abilities: 2s cooldown",
      "5 health | 3 lives",
      "Kill creatures for items",
    ];
    description.forEach((line, index) => {
      context.fillText(line, CANVAS_WIDTH / 2, 102 + index * 13);
    });

    context.fillStyle = "#888888";
    context.font = `8px ${FontName.OpenSans}`;
    context.fillText("Enter / Esc to close", CANVAS_WIDTH / 2, 195);
  }

  updateMenuOption() {
    if (SaveManager.hasSave()) {
      this.menuOptions = ["Continue", "New Game", "Instructions"];
    } else {
      this.menuOptions = ["New Game", "Instructions"];
    }
    this.selectedIndex = 0;
  }
}
