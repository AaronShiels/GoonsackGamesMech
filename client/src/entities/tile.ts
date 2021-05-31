import { Rectangle as PixiRectangle, Sprite, Texture } from "pixi.js";
import { BodyComponent, Edges } from "../components";
import { Vector } from "../utilities";
import { TileData } from "../utilities";

class Tile extends Sprite implements BodyComponent {
	private _location: Vector = { x: 0, y: 0 };

	constructor(tileData: TileData) {
		super(
			new Texture(
				tileData.textureAtlas.texture.baseTexture,
				new PixiRectangle(
					tileData.textureAtlas.frame.x,
					tileData.textureAtlas.frame.y,
					tileData.textureAtlas.frame.width,
					tileData.textureAtlas.frame.height
				)
			)
		);

		this.location = tileData.location;
		this.size = tileData.size;
		this.edges = { bottom: false, left: false, right: false, top: false };
		this.anchor.set(0.5);
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
