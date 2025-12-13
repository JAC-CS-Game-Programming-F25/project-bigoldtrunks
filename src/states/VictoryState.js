import State from "../../lib/State.js";
import { input } from "../globals.js";
import Input from "../../lib/Input.js";


export default class VictoryState extends State {
  constructor() {
    super();
  }

  update(dt) {
    // Press Enter to go back to title
    if (input.isKeyPressed(Input.KEYS.ENTER)) {
      keys.Enter = false;
      stateMachine.change(GameStateName.Transition, {
        fromState: this,
        toState: stateMachine.states[GameStateName.TitleScreen],
      });
    }
  }
}
