import { Rectangle as PixiRectangle, Sprite, Texture } from "pixi.js";
import { BodyComponent, Edges } from "../components";
import { Vector } from "../utilities";
import { TileData } from "../utilities";

class Tile extends Sprite implements BodyComponent {
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

		this.position.x = tileData.position.x;
		this.position.y = tileData.position.y;
		this.size = tileData.size;
		this.edges = { bottom: false, left: false, right: false, top: false };
		this.anchor.set(0.5);
	}

	public size: Vector;
	public edges: Edges;
	public destroyed: boolean = false;
}

export { Tile };
