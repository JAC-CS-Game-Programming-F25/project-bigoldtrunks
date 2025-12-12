import Animation from "../../../lib/Animation.js";
import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { input, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js";


export default class PlayerWalkingState extends State {
    constructor(player){
        super()
        this.player = player;

        console.log("PlayerWalkingState constructor");
        this.animation = {
            [Direction.Right]: new Animation([16, 17, 18, 19], 0.2),
            [Direction.Left]: new Animation([20, 21, 22, 23], 0.2),
            [Direction.Down]: new Animation([24, 25, 26, 27], 0.2),
            [Direction.Up]: new Animation([28, 29, 30, 31], 0.2),
        };
    }

    enter(){

        this.sprites=this.player.walkingSprites;
        this.player.currentAnimation = this.animation[this.player.direction];
    }
    
    update(dt){
        this.handleMovement(dt);
        this.handleSwordSwing();
        this.handlePerformingFireFlame();
        this.handlePerformingFrozenBlast();
    }

    handleMovement(dt) {
		this.player.currentAnimation = this.animation[this.player.direction];

		if (input.isKeyHeld(Input.KEYS.S)) {
			this.player.direction = Direction.Down;
			this.player.position.y += this.player.speed * dt;
			
		} else if (input.isKeyHeld(Input.KEYS.D)) {
			this.player.direction = Direction.Right;
			this.player.position.x += this.player.speed * dt;

		
		} else if (input.isKeyHeld(Input.KEYS.W)) {
			this.player.direction = Direction.Up;
			this.player.position.y -= this.player.speed * dt;

			
		} else if (input.isKeyHeld(Input.KEYS.A)) {
			this.player.direction = Direction.Left;
			this.player.position.x -= this.player.speed * dt;

			
		} else {
			this.player.changeState(PlayerStateName.Idle);
		}
	}
    handleSwordSwing() {
        if (input.isKeyHeld(Input.KEYS.SPACE)) {
            console.log("Checking for sword swing input");
            this.player.changeState(PlayerStateName.SwordSwinging);
        }
    }

    handlePerformingFireFlame() {
        if (input.isKeyHeld(Input.KEYS.J)) {
            this.player.changeState(PlayerStateName.PerformingFireFlame);
        }
    }
  
    handlePerformingFrozenBlast() {
        if (input.isKeyHeld(Input.KEYS.K)) {
            console.log("K pressed");
            this.player.changeState(PlayerStateName.PerformingFrozenBlast);
        }
    }
}