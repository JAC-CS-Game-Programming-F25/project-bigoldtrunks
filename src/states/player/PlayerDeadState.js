import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";

export default class PlayerDeadState extends State {
    constructor(player){
        super(player)
        this.player = player;
        this.animation = {
			[Direction.Right]: new Animation([96,97,98,99],0.3, 1),
			[Direction.Left]: new Animation([100,101,102,103], 0.3, 1),
			[Direction.Down]: new Animation([104,105,106,107], 0.3, 1),
            [Direction.Up]: new Animation([108,109,110,111], 0.3, 1),
		};
    }

    enter(){
        this.player.sprites = this.player.deadSprites;
        this.player.currentAnimation = this.animation[this.player.direction];
        
        console.log("Player has died - entering dead state");
        console.log(`Dead sprites array length: ${this.player.sprites.length}`);
        console.log(`Current direction: ${this.player.direction}`);
        console.log(`Animation frames for this direction:`, this.player.currentAnimation.frames);
        console.log(`First frame index: ${this.player.currentAnimation.getCurrentFrame()}`);
    }
    
    update(dt){
        // Update the death animation so it progresses through frames
        this.player.currentAnimation.update(dt);

    }
    
    exit(){
        if(this.player.currentAnimation.isDone()){
            console.log("Exiting dead state - transitioning to GameOver");
        }
    }
}