import { Container, Sprite } from "pixi.js";
import { Entity } from ".";
import { getResource, Resource } from "../assets";
import { Vector } from "../utilities";

class Reticle extends Container implements Entity {
	private _expansion: number = 0;
	private _centreSprite: Sprite;
	private _topLeftQuadrantSprite: Sprite;
	private _topRightQuadrantSprite: Sprite;
	private _bottomRightQuadrantSprite: Sprite;
	private _bottomLeftQuadrantSprite: Sprite;

	constructor(position: Vector) {
		super();

		this.zIndex = 10;
		this.position.set(position.x, position.y);

		const reticleCentreTexture = getResource(Resource.HUD).spritesheet!.textures["reticle_pointer.png"];
		this._centreSprite = new Sprite(reticleCentreTexture);
		this._centreSprite.anchor.set(0.5);
		this.addChild(this._centreSprite);

		const reticleQuadrantTexture = getResource(Resource.HUD).spritesheet!.textures["reticle_quadrant.png"];
		this._topLeftQuadrantSprite = new Sprite(reticleQuadrantTexture);
		this._topLeftQuadrantSprite.anchor.set(1, 1);
		this.addChild(this._topLeftQuadrantSprite);

		this._topRightQuadrantSprite = new Sprite(reticleQuadrantTexture);
		this._topRightQuadrantSprite.anchor.set(1, 1);
		this._topRightQuadrantSprite.rotation = Math.PI / 2;
		this.addChild(this._topRightQuadrantSprite);

		this._bottomRightQuadrantSprite = new Sprite(reticleQuadrantTexture);
		this._bottomRightQuadrantSprite.anchor.set(1, 1);
		this._bottomRightQuadrantSprite.rotation = Math.PI;
		this.addChild(this._bottomRightQuadrantSprite);

		this._bottomLeftQuadrantSprite = new Sprite(reticleQuadrantTexture);
		this._bottomLeftQuadrantSprite.anchor.set(1, 1);
		this._bottomLeftQuadrantSprite.rotation = (Math.PI * 3) / 2;
		this.addChild(this._bottomLeftQuadrantSprite);
	}

	public get expansion(): number {
		return this._expansion;
	}
	public set expansion(value: number) {
		this._expansion = value;

		this._topLeftQuadrantSprite.position.set(-value, -value);
		this._topRightQuadrantSprite.position.set(value, -value);
		this._bottomRightQuadrantSprite.position.set(value, value);
		this._bottomLeftQuadrantSprite.position.set(-value, value);
	}
	public destroyed: boolean = false;
}

export { Reticle };
