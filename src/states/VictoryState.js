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
import Input from "../../lib/Input.js";
import FontName from "../enums/FontName.js";
import ImageName from "../enums/ImageName.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
/**
 * VictoryState - Displayed when the player wins the game.
 *
 * Shows a victory screen with gold "VICTORY!" text over a darkened
 * title background. Plays victory music until the player continues.
 *
 * Controls: Enter - Return to title screen
 */
export default class VictoryState extends State {
  constructor() {
    super();
  }
  enter() {
    sounds.play(SoundName.Victory);
  }
  exit() {
    sounds.stop(SoundName.Victory);
  }

  update(dt) {
    // Press Enter to go back to title
    if (input.isKeyPressed(Input.KEYS.ENTER)) {
      stateMachine.change(GameStateName.Transition, {
        fromState: this,
        toState: stateMachine.states[GameStateName.TitleScreen],
      });
    }
  }
  render() {
    // Background
    images.get(ImageName.Title).render(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Dark overlay
    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Victory text
    context.font = `32px ${FontName.CinzelBold}`;
    context.fillStyle = "#FFD700"; // Gold color
    context.textAlign = "center";
    context.fillText("VICTORY!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

    // Continue prompt
    context.font = `12px ${FontName.MedievalSharp}`;
    context.fillText(
      "Press Enter to continue",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 50
    );
  }
}
