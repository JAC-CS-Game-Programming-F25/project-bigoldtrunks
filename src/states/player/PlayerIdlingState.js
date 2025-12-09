import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import Input from "../../../lib/Input.js";
import { input } from "../../globals.js";


export default class PlayerIdlingState extends State {
    constructor(player){
        super()
        this.player = player;

        this.animation = {
			[Direction.Right]: new Animation([0], 1),
			[Direction.Left]: new Animation([4], 1),
			[Direction.Down]: new Animation([8], 1),
            [Direction.Up]: new Animation([12], 1),
		};
    }

    enter(params){

        this.player.sprites=this.player.walkingSprites;
        this.player.currentAnimation = this.animation[this.player.direction];

    }
    
    update(dt){
        this.checkForMovement();
        this.handleSwordSwing();

    }

    checkForMovement(){

        if(input.isKeyHeld(Input.KEYS.S)){
                this.player.direction = Direction.Down;
                this.player.changeState(PlayerStateName.Walking);
            } else if(input.isKeyHeld(Input.KEYS.W)){
                this.player.direction = Direction.Up;
                this.player.changeState(PlayerStateName.Walking);
            } else if(input.isKeyHeld(Input.KEYS.A)){
                this.player.direction = Direction.Left;
                this.player.changeState(PlayerStateName.Walking);
            } else if(input.isKeyHeld(Input.KEYS.D)){
                this.player.direction = Direction.Right;
                this.player.changeState(PlayerStateName.Walking);
            } 
    }
    handleSwordSwing() {
        if (input.isKeyHeld(Input.KEYS.SPACE)) {
            this.player.changeState(PlayerStateName.SwordSwinging);
        }
    }
}