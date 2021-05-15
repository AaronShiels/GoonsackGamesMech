import { Rectangle as PixiRectangle, Sprite, Texture } from "pixi.js";
import { BodyComponent, Edges } from "../components";
import { centre, Rectangle, Vector } from "../utilities";

class Tile extends Sprite implements BodyComponent {
	constructor(textureAtlas: Texture, frame: Rectangle, bounds: Rectangle, edges: Edges, zIndex: number) {
		super(new Texture(textureAtlas.baseTexture, new PixiRectangle(frame.x, frame.y, frame.width, frame.height)));

		const position = centre(bounds);
		this.x = position.x;
		this.y = position.y;
		this.size = { x: bounds.width, y: bounds.height };
		this.edges = edges;
		this.anchor.set(0.5);
		this.zIndex = zIndex;
	}

	public size: Vector;
	public edges: Edges;
	public destroyed: boolean = false;
}

export { Tile };
