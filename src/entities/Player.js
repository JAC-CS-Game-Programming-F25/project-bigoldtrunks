import Sprite from "../../lib/Sprite.js";
import Animation from "../../lib/Animation.js";
import ImageName from "../enums/ImageName.js";
import { context, DEBUG, images } from "../globals.js";
import GameEntity from "./GameEntity.js";
import Direction from "../enums/Direction.js";
import StateMachine from "../../lib/StateMachine.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import PlayerIdlingState from "../states/player/PlayerIdlingState.js";
import PlayerWalkingState from "../states/player/PlayerWalkingState.js";
import PlayerSwordSwingingState from "../states/player/PlayerSwordSwingingState.js";
import Hitbox from "../../lib/Hitbox.js";

export default class Player extends GameEntity {

    // the player frame has width and height of 16 pixels, apply to all movements idle/walk
    static PLAYER_SPRITE_WIDTH = 16;
	static PLAYER_SPRITE_HEIGHT = 16;

    // the player sword swinging frame has width and height of 32 pixels
    static PLAYER_SWORD_SPRITE_HEIGHT = 32;
    static PLAYER_SWORD_SPRITE_WIDTH = 32;
    static PLAYER_SPEED= 60;
    

    constructor(){
        super({
            speed: Player.PLAYER_SPEED,})

        this.walkingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Player),
            Player.PLAYER_SPRITE_WIDTH,
            Player.PLAYER_SPRITE_HEIGHT,
        )
        this.swordSwingingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.PlayerSwordSwing),
            Player.PLAYER_SWORD_SPRITE_WIDTH,
            Player.PLAYER_SWORD_SPRITE_HEIGHT,
        )

        this.sprites = this.walkingSprites;
        // set initial player position
                this.position = {x: 100, y: 100};

        // set player dimensions
                this.dimensions = {x: Player.PLAYER_SPRITE_WIDTH, y: Player.PLAYER_SPRITE_HEIGHT};


      
        // initialize animations for each direction, using only one frame for idling
        this.animation = {
                    [Direction.Right]: new Animation([0], 1),
                    [Direction.Left]: new Animation([4], 1),
                    [Direction.Down]: new Animation([8], 1),
                    [Direction.Up]: new Animation([12], 1),
                };
        // start with player facing down
        this.currentAnimation = this.animation[Direction.Down];
        this.swordHitbox = new Hitbox(0, 0, 0, 0, 'blue'); // this is set in the sword swinging state
        
        this.stateMachine = this.initializeStateMachine();
        console.log("Sword Hitbox initialized", this.swordHitbox);
    }

    render(){
        context.save();

        super.render(); // need to pass offset

        context.restore();
        if(DEBUG){
            this.swordHitbox.render(context);
        }
    }
    /**
     * Initializes the state machine for the player.
     * @returns {StateMachine} the initialized state machine
     */
    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(PlayerStateName.Idle, new PlayerIdlingState(this));
        stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
        stateMachine.add(PlayerStateName.SwordSwinging, new PlayerSwordSwingingState(this));

        stateMachine.change(PlayerStateName.Idle);

        return stateMachine;
    }
}