import State from "../../../lib/State.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import Animation from "../../../lib/Animation.js";
import Direction from "../../enums/Direction.js";
import { CANVAS_HEIGHT, sounds, timer } from "../../globals.js";
import Player from "../../entities/Player.js";
import SoundName from "../../enums/SoundName.js";

/**
 * This state is used when player dead and still have lives remaining, this state will handle the tween from the top of the screen to the ground
 * to simulate falling down to earth.
 */
export default class PlayerFallingDownToEarth extends State {
    static FALL_SPEED = 150; // Speed at which the player falls down (pixels per second)
    static GROUND_OFFSET = 20; // Offset from bottom of canvas
    
    constructor(player) {
        super();
        this.player = player;
        this.animation = {
            [Direction.Right]: new Animation([0], 1), // Use idle frame while falling
            [Direction.Left]: new Animation([4], 1),
            [Direction.Down]: new Animation([8], 1),
            [Direction.Up]: new Animation([12], 1),
        };
    }

    enter() {
        // Set initial position above the visible screen, on the top of canvas
        this.player.position.y = -this.player.dimensions.y;
        this.player.isFalling = true; // Flag to indicate the player is falling
        
        // Use walking sprites for falling animation
        this.player.sprites = this.player.walkingSprites;
        this.player.health = Player.MAX_HEALTH // Restore health upon landing
        this.player.currentAnimation = this.animation[this.player.direction];
        
        console.log("Player falling from sky...");


    }

    update(dt) {
        // Calculate ground level (bottom of canvas minus offset)
        const groundLevelY = CANVAS_HEIGHT - this.player.dimensions.y - PlayerFallingDownToEarth.GROUND_OFFSET;
        
        // Move the player downwards if they haven't reached the ground level
        if (this.player.position.y < groundLevelY) {
            this.player.position.y += PlayerFallingDownToEarth.FALL_SPEED * dt;
        } else {
            // Player has landed on the ground
            this.player.position.y = groundLevelY;
            this.player.isFalling = false;
            
            // Play earthquake effect when landing
            this.playLandingEffect();
                        
            // Transition back to Idle state (after a brief delay for effect)
            setTimeout(() => {
                this.player.changeState(PlayerStateName.Idle);
            }, 200); // Small delay to let the shake complete
        }
    }
    
    /**
     * Plays a screen shake effect when the player lands
     * Simulates an earthquake/impact effect
     */
    playLandingEffect() {
        const canvas = document.querySelector("canvas");
        
        // Flash effect - brief brightness increase
        canvas.style.filter = "brightness(1.3)";
        
        setTimeout(() => {
            canvas.style.filter = "brightness(1)";
        }, 100);
        
        // Screen shake effect
        let shakes = 0;
        const maxShakes = 20; // Number of shake iterations
        const shakeIntensity = 6; // Pixels to shake
        
        const shakeInterval = setInterval(() => {
            // Random shake in both X and Y directions
            const offsetX = (Math.random() - 0.5) * shakeIntensity;
            const offsetY = (Math.random() - 0.5) * shakeIntensity;
            
            canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            shakes++;
            
            // Stop shaking after max shakes
            if (shakes >= maxShakes) {
                clearInterval(shakeInterval);
                canvas.style.transform = ""; // Reset position
                canvas.style.filter = ""; // Reset filter
            }
        }, 30); // Shake every 30ms for quick, intense effect
        
    }
    
    exit() {
        console.log("Exiting falling state");
    }
}