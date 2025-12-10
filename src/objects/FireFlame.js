import Animation from "../../lib/Animation";
import Sprite from "../../lib/Sprite";
import ImageName from "../enums/ImageName";
import { images } from "../globals";
import GameObject from "./GameObject";

export default class FireFlame extends GameObject {
    static WIDTH = 32;
    static HEIGHT = 32;

    constructor(position) {
        super({
            position,
            dimensions: { x: 32, y: 32 },
            });

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.FireExplosion),
            FireFlame.WIDTH,
            FireFlame.HEIGHT        
        );
        this.animation = new Animation([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 0.4, 1);
        this.currentAnimation = this.animation.getCurrentFrame();
        this.currentFrame = 0;
    }

    update(dt) {
        super.update(dt);
        // Additional update logic for FireFlame
    }

    render(context) {
        super.render(context);
        // Additional render logic for FireFlame
    }
}