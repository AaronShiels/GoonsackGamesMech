import { Container, Sprite } from "pixi.js";
import { Initialiser, System } from ".";
import { getResource, Resource } from "../assets";
import { Mech } from "../entities";
import { add, subtract, boundAngle, Vector } from "../utilities";

const maximumInaccuracyAngle = Math.PI / 8;
const maximumExpansion = 30;

let reticle: Reticle | undefined;

const hudInit: Initialiser = (game) => {
	reticle = new Reticle(game.input.cursorPosition);
	game.stage.addChild(reticle);
};

const hudSystem: System = (game) => {
	if (!reticle) throw new Error("HUD not initialised");

	reticle.position.set(game.input.cursorPosition.x, game.input.cursorPosition.y);

	if (!game.state.active()) return;

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	const leftArmPosition = add(mech.leftArm.position, mech.position);
	const leftArmReticleDirectionVector = subtract(reticle.position, leftArmPosition);
	const leftArmReticleAngle = Math.atan2(leftArmReticleDirectionVector.y, leftArmReticleDirectionVector.x);
	const leftArmAngleDifference = Math.abs(boundAngle(leftArmReticleAngle - mech.leftArm.direction));

	const rightArmPosition = add(mech.rightArm.position, mech.position);
	const rightArmReticleDirectionVector = subtract(reticle.position, rightArmPosition);
	const rightArmReticleAngle = Math.atan2(rightArmReticleDirectionVector.y, rightArmReticleDirectionVector.x);
	const rightArmAngleDifference = Math.abs(boundAngle(rightArmReticleAngle - mech.rightArm.direction));

	const inaccuracyRatio = Math.min(leftArmAngleDifference + rightArmAngleDifference, maximumInaccuracyAngle) / maximumInaccuracyAngle;
	const expansion = inaccuracyRatio * maximumExpansion;
	reticle.expansion = expansion;
};

class Reticle extends Container {
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
}

export { hudInit, hudSystem };
