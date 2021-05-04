import { Rectangle as PixiRectangle, Sprite, Texture } from "pixi.js";
import { BodyComponent, SpriteComponent, Edges } from "../components";
import { centre, Rectangle } from "../utilities";

type Tile = BodyComponent & SpriteComponent;

const createTile = (textureAtlas: Texture, frame: Rectangle, bounds: Rectangle, edges: Edges, zIndex: number): Tile => {
	const position = centre(bounds);
	const size = { x: bounds.width, y: bounds.height };
	const pFrame = new PixiRectangle(frame.x, frame.y, frame.width, frame.height);
	const tileTexture = new Texture(textureAtlas.baseTexture, pFrame);
	const sprite = new Sprite(tileTexture);
	sprite.anchor.set(0.5);
	sprite.zIndex = zIndex;

	return { destroyed: false, position, size, edges, sprite };
};

export { createTile };
