import { Rectangle as PixiRectangle, Sprite, Texture } from "pixi.js";
import { BodyComponent, Edges } from "../../common/components/body.js";
import { Vector } from "../../common/utilities/vector.js";
import { TileData } from "../utilities/map.js";

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
