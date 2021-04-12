import { Sprite, filters, WRAP_MODES, Point, Container, ObservablePoint } from "pixi.js";
import { AnimatedFilter } from ".";
import { getResource, Resource } from "../framework/resources";

const movementCoefficient: number = 20;
const scaleCoefficient: number = 20;

class WaterFilter extends filters.DisplacementFilter implements AnimatedFilter {
	constructor(waterSprite: Sprite, scale: ObservablePoint) {
		super(waterSprite);

		super.scale = new Point(scale.x * scaleCoefficient, scale.y * scaleCoefficient);

		this.sprite = waterSprite;
		this.sprite.texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
	}

	public sprite: Sprite;
	private _elapsedSeconds: number = 0;

	update(deltaSeconds: number): void {
		this._elapsedSeconds += deltaSeconds;

		this.sprite.x = this._elapsedSeconds * movementCoefficient;
		this.sprite.y = this._elapsedSeconds * movementCoefficient;
	}
}

const applyWaterFilter = (target: Container): void => {
	const waterNoiseTexture = getResource(Resource.WaterNoise).texture;
	const waterNoiseSprite = new Sprite(waterNoiseTexture);
	const waterFilter = new WaterFilter(waterNoiseSprite, target.scale);

	target.addChild(waterNoiseSprite);

	target.filters = target.filters || [];
	target.filters.push(waterFilter);
};

export { applyWaterFilter };
