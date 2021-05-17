import { Rectangle as PixiRectangle, Sprite, Texture } from "pixi.js";
import { BodyComponent, Edges } from "../components";
import { centre, Rectangle, Vector } from "../utilities";

class Tile extends Sprite implements BodyComponent {
	private _location: Vector = { x: 0, y: 0 };

	constructor(textureAtlas: Texture, frame: Rectangle, bounds: Rectangle, edges: Edges, zIndex: number) {
		super(new Texture(textureAtlas.baseTexture, new PixiRectangle(frame.x, frame.y, frame.width, frame.height)));

		this.location = centre(bounds);
		this.size = { x: bounds.width, y: bounds.height };
		this.edges = edges;
		this.anchor.set(0.5);
		this.zIndex = zIndex;
	}

	public get location(): Vector {
		return this._location;
	}
	public set location(value: Vector) {
		this._location = value;

		this.position.x = Math.round(value.x);
		this.position.y = Math.round(value.y);
	}
	public size: Vector;
	public edges: Edges;
	public destroyed: boolean = false;
}

export { Tile };
