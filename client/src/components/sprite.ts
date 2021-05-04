import { DisplayObject } from "pixi.js";
import { Entity } from "../entities";

interface SpriteComponent extends Entity {
	sprite: DisplayObject;
}

const hasSprite = (object: any): object is SpriteComponent => "sprite" in object;

export { SpriteComponent, hasSprite };
