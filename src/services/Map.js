import Layer from "./Layer.js";
import Sprite from "../../lib/Sprite.js";
import Tile from "./Tile.js";

import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images } from "../globals.js";
export default class Map {
  constructor(mapDefinition) {
    // Generate sprites from tileset

    const sprites = Sprite.generateSpritesFromSpriteSheet(
      images.get("Floors_Tiles"),
      Tile.SIZE,
      Tile.SIZE
    );
    // Create layers
    this.bottomLayer = new Layer(mapDefinition.layers[0], sprites);
    this.collisionLayer = new Layer(mapDefinition.layers[1], sprites);
  }

  render() {
    this.bottomLayer.render();
  }
  getCollisionObjects() {
    return [];
  }
}
