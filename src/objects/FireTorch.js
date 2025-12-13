import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameObject from "./GameObject.js";
import Vector from "../../lib/Vector.js";
import ItemType from "../enums/ItemType.js";

export default class FireTorch extends GameObject {
    static WIDTH = 16;
    static HEIGHT = 16;
  

    constructor(position) {
        super(
            {x: FireTorch.WIDTH, y: FireTorch.HEIGHT},
            position
        );
        this.name="FireTorch"; // For identification purposes when debugging
        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.FireTorch),
            FireTorch.WIDTH,
            FireTorch.HEIGHT        
        );
        this.animation = new Animation([0, 1, 2, 3, 4], 0.2); // Looping animation
        this.currentAnimation = this.animation;
        this.currentFrame = 0;
        this.setHitboxPosition(6, 6, -10, -10);
        this.itemType = ItemType.FireTorch; // Type of ability this fire torch unlocks
    }
    
   
    update(dt) {
        this.currentFrame = this.currentAnimation.getCurrentFrame();
        super.update(dt);
    }
    
    render(context) {
        super.render(context);
    }
}