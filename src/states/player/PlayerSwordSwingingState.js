import Animation from "../../../lib/Animation.js";
import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { input, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js";


export default class PlayerSwordSwingingState extends State {
    constructor(player){
        super()
        this.player = player;

        console.log("PlayerSwordSwingingState constructor");
        this.animation = {
            [Direction.Right]: new Animation([0, 1, 2, 3, 4, 5, 6, 7], 0.1, 1),
            [Direction.Left]: new Animation([8, 9, 10, 11, 12, 13, 14, 15], 0.1, 1),
            [Direction.Down]: new Animation([16, 17, 18, 19, 20, 21, 22, 23], 0.1, 1),
            [Direction.Up]: new Animation([24, 25, 26, 27, 28, 29, 30, 31], 0.1, 1),
        };
        
        // Store the original position for later restoration
        this.originalDimensions = {
            x: this.player.dimensions.x,
            y: this.player.dimensions.y
        };
    }

    enter(){
        // // Calculate offset to center the 32x32 sprite on the player's original 16x16 position

        const offsetX = (Player.PLAYER_SWORD_SPRITE_WIDTH - Player.PLAYER_SPRITE_WIDTH) / 2;
        const offsetY = (Player.PLAYER_SWORD_SPRITE_HEIGHT - Player.PLAYER_SPRITE_HEIGHT) / 2;
        
        // // Adjust position so the sprite centers on the original position
        this.player.position.x -= offsetX;
        this.player.position.y -= offsetY;
        
        // // Update dimensions for the sword swing sprite
        this.player.dimensions.x = Player.PLAYER_SWORD_SPRITE_WIDTH;
        this.player.dimensions.y = Player.PLAYER_SWORD_SPRITE_HEIGHT;
        
        this.player.sprites = this.player.swordSwingingSprites;
        this.player.currentAnimation = this.animation[this.player.direction];
    }
    
    update(dt){
       
    }

    exit(){
       
    }

}