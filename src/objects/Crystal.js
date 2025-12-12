import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameObject from "./GameObject.js";
import Vector from "../../lib/Vector.js";

export default class Crystal extends GameObject {
    static WIDTH = 16;
    static HEIGHT = 16;
  

    constructor(position) {
        super(
            {x: Crystal.WIDTH, y: Crystal.HEIGHT},
            position
        );
       
        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Crystal),
            Crystal.WIDTH,
            Crystal.HEIGHT        
        );
        this.animation = new Animation([0, 1, 2, 3, 4, 5], 0.2); // Looping animation
        this.currentAnimation = this.animation;
        this.currentFrame = 0;
        this.setHitboxPosition(6, 6, -10, -10);
    }
    
   
    update(dt) {
        this.currentFrame = this.currentAnimation.getCurrentFrame();
        super.update(dt);
    }
    
    render(context) {
        super.render(context);
    }
}