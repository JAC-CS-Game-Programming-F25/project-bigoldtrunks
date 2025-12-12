import Layer from "./Layer.js";
import Sprite from "../../lib/Sprite.js";
import Tile from "./Tile.js";
import Hitbox from "../../lib/Hitbox.js";

import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images } from "../globals.js";
import ImageName from "../enums/ImageName.js";
export default class Map {
  constructor(mapDefinition) {
    // Generate sprites from tileset
    this.width = mapDefinition.width;
    this.height = mapDefinition.height;
    const sprites = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.Summer),
      Tile.SIZE,
      Tile.SIZE
    );
    const spritesDecoration = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.Tree),
      Tile.SIZE,
      Tile.SIZE
    );
    /**
     * The bottom layer of the map
     * @type {Layer}
     */
    this.bottomLayer = new Layer(mapDefinition.layers[0], sprites);
    /**
     * The layer that contains all collision tiles
     * @type {Layer}
     */
    this.collisionLayer = new Layer(
      mapDefinition.layers[1],
      spritesDecoration,
      651
    );
    this.topLayer = new Layer(mapDefinition.layers[2], spritesDecoration, 651);
    // Generate collision hitboxes
    this.collisionObjects = this.generateCollisionObjects();
  }

  render() {
    this.bottomLayer.render();
    this.collisionLayer.render();
  }

  renderTop() {
    this.topLayer.render();
  }
  // Generate hitboxes from collision tiles
  generateCollisionObjects() {
    const collisionObjects = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.collisionLayer.getTile(x, y);

        if (tile) {
          collisionObjects.push(
            new Hitbox(x * Tile.SIZE, y * Tile.SIZE, Tile.SIZE, Tile.SIZE)
          );
        }
      }
    }

    return collisionObjects;
  }
  getCollisionObjects() {
    return this.collisionObjects;
  }
}
