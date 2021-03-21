import { Rectangle as PRectangle, Texture } from "pixi.js";
import { BodyComponent, createSpriteComponent, SpriteComponent, createSprite, Edges } from "../components";
import { Rectangle, Vector } from "../shapes";

type Tile = BodyComponent & SpriteComponent;

const createTile = (textureAtlas: Texture, frame: Rectangle, bounds: Rectangle, edges: Edges, zIndex: number): Tile => {
	const pFrame = new PRectangle(frame.x, frame.y, frame.width, frame.height);
	const tileTexture: Texture = new Texture(textureAtlas.baseTexture, pFrame);

	const position: Vector = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
	const size: Vector = { x: bounds.width, y: bounds.height };
	const sprite: SpriteComponent = createSpriteComponent(createSprite(tileTexture, zIndex));

	return { position, size, edges, ...sprite };
};

export default Tile;
export { createTile };
