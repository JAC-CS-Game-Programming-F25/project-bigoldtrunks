import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameObject from "./GameObject.js";
import ItemType from "../enums/ItemType.js";

export default class Key extends GameObject {
    static WIDTH = 16;
    static HEIGHT = 16;
  

    constructor(position) {
        super(
            {x: Key.WIDTH, y: Key.HEIGHT},
            position
        );
        this.name = "Key"; // For identification purposes when debugging

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Key),
            Key.WIDTH,
            Key.HEIGHT        
        );
        this.animation = new Animation([0, 1, 2, 3, 4, 5], 0.2); // Looping animation
        this.currentAnimation = this.animation;
        this.currentFrame = 0;
        this.setHitboxPosition(6, 6, -10, -10);
        this.itemType = ItemType.Key; // Type of ability this key unlocks
    }
    
   
    update(dt) {
        this.currentFrame = this.currentAnimation.getCurrentFrame();
        super.update(dt);
    }
    
    render(context) {
        super.render(context);
    }
}