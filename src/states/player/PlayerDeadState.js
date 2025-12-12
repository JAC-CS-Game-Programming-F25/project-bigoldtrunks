import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { timer } from "../../globals.js";
import PlayerPerformingFrozenBlastState from "./PlayerPerformingFrozenBlast.js";

export default class PlayerDeadState extends State {
    static WAIT_DURATION = 2; // Wait 2 seconds after death animation before allowing GameOver transition
    
    constructor(player){
        super(player)
        this.player = player;
        this.animation = {
			[Direction.Right]: new Animation([96,97,98,99],0.4, 1),
			[Direction.Left]: new Animation([100,101,102,103], 0.4, 1),
			[Direction.Down]: new Animation([104,105,106,107], 0.4, 1),
            [Direction.Up]: new Animation([108,109,110,111], 0.4, 1),
		};
    }

    enter(){
        this.player.sprites = this.player.deadSprites;
        this.player.currentAnimation = this.animation[this.player.direction];
        this.player.canTransitionToGameOver = false; // Flag to control GameOver transition
        
    }
    
    update(dt){
        // Update the death animation so it progresses through frames
        this.player.currentAnimation.update(dt);
        
        // Once animation is done, start the wait timer
        if (this.player.currentAnimation.isDone()) {
            
            this.startWaitTimer();
        }
    }
    /**
     * Starts a timer to wait for a specified duration before deciding next action:
     * - If lives > 0: Respawn (FallingDownToEarth state)
     * - If lives <= 0: Game Over
     */
    async startWaitTimer() {
        console.log(`Death animation complete, waiting ${PlayerDeadState.WAIT_DURATION} seconds...`);
        await timer.wait(PlayerDeadState.WAIT_DURATION);
        
        // Decrease a life after death animation
        this.player.lives -= 1;
        if(this.player.lives < 0) {
            this.player.lives = -1; // Prevent negative lives display
            console.log(`No Lives remain -> Game OVer ${this.player.lives}`);
        }
        
        if (this.player.lives > 0) {
            // Player has lives remaining - respawn from sky
            console.log("Player has lives remaining - respawning from sky");
            this.player.resetPlayer(); // Reset health and flags
            this.player.changeState(PlayerStateName.FallingDownToEarth);
        } else {
            // No lives remaining - transition to Game Over
            console.log("No lives remaining - transitioning to GameOver");
            this.player.canTransitionToGameOver = true;
        }
    }
    
    exit(){
        console.log("Exiting dead state - transitioning to GameOver");
    }
}