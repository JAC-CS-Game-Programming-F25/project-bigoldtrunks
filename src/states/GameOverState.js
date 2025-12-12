import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import Input from "../../lib/Input.js";
import SoundName from "../enums/SoundName.js";
import ImageName from "../enums/ImageName.js";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  context,
  images,
  input,
  sounds,
  stateMachine,
} from "../globals.js";
import FontName from "../enums/FontName.js";

export default class GameOverState extends State {
  constructor() {
    super();
    this.score = 0;
  }

  enter(params) {
    this.score = params?.score ?? 0;
    sounds.play(SoundName.Gameover);
  }
  update(dt) {
    if (input.isKeyPressed(Input.KEYS.ENTER)) {
      stateMachine.change(GameStateName.TitleScreen);
    }
  }
  exit() {
    sounds.stop(SoundName.Gameover);
  }
  render() {
    // background
    images.render(ImageName.Title, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    //
    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Game Over
    context.fillStyle = "#FF0000";
    context.font = `32px ${FontName.CinzelBold}`;
    context.textAlign = "center";
    context.fillText("Game Over", CANVAS_WIDTH / 2, 70);

    // Score
    context.fillStyle = "#FFFFFF";
    context.font = `16px ${FontName.MedievalSharp}`;
    context.fillText(`Score: ${this.score}`, CANVAS_WIDTH / 2, 110);

    // reminde
    context.fillStyle = "#888888";
    context.font = `12px ${FontName.MedievalSharp}`;
    context.fillText("Press Enter to continue", CANVAS_WIDTH / 2, 150);
  }
}
