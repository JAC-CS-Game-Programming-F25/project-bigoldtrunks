import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";


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
        // since we use only one spritesheet for all frames of player from idling to walking, means we use this.player.sprites the entire process
        this.player.currentAnimation = this.animation[this.player.direction];
    }
    
    update(dt){
       
    }
}