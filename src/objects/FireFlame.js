import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameObject from "./GameObject.js";

export default class FireFlame extends GameObject {
    static WIDTH = 32;
    static HEIGHT = 32;

    constructor(position, direction) {
        super(
            position,
            {x: FireFlame.WIDTH, y: FireFlame.HEIGHT}
        );
        this.direction = direction;
        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.FireExplosion),
            FireFlame.WIDTH,
            FireFlame.HEIGHT        
        );
        this.animation = new Animation([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 0.4, 1);
        this.currentAnimation = this.animation;  // Store the Animation object, not the frame number

        console.log("FireFlame created at position:", position, "with direction:", direction);
    }

    update(dt) {
        // Update the animation
        super.update(dt);
    }

    render(context) {
        super.render(context);
        // Additional render logic for FireFlame
    }
}