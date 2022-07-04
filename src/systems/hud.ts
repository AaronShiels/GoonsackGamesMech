import { Container, Graphics, Renderer, SCALE_MODES, Sprite } from "pixi.js";
import { boundAngle } from "../utilities/angles.js";
import { add, multiply, subtract, Vector } from "../utilities/vector.js";
import { getResource, Resource } from "../assets/index.js";
import { Mech } from "../entities/mech.js";
import { touchControlPaneModifier } from "../utilities/device.js";
import { Initialiser, System } from "./system.js";

const maximumInaccuracyAngle = Math.PI / 4;
const maximumExpansion = 30;
const joystickRadisuModifier = 0.4;

let reticle: Reticle | undefined;
let joystick: Joystick | undefined;

const hudInit: Initialiser = (game) => {
	const panelPosition = { x: game.camera.width * touchControlPaneModifier.x, y: game.camera.height * touchControlPaneModifier.y };
	const panelSize = { x: game.camera.width * touchControlPaneModifier.width, y: game.camera.height * touchControlPaneModifier.height };
	const panel = new Panel(panelPosition, panelSize);
	game.hud.addChild(panel);

	const joystickPosition = {
		x: (touchControlPaneModifier.x + touchControlPaneModifier.width / 2) * game.camera.width,
		y: (touchControlPaneModifier.y + touchControlPaneModifier.height / 2) * game.camera.height
	};
	const joystickRadius =
		Math.min(game.camera.width * touchControlPaneModifier.width, game.camera.height * touchControlPaneModifier.height) * joystickRadisuModifier;
	joystick = new Joystick(joystickPosition, joystickRadius, game.renderer);
	game.hud.addChild(joystick);

	reticle = new Reticle(game.input.cursorPosition);
	game.hud.addChild(reticle);
};

const hudSystem: System = (game) => {
	if (!reticle) throw new Error("HUD not initialised");

	reticle.position.set(game.input.cursorPosition.x, game.input.cursorPosition.y);

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	const reticleWorldPosition = subtract(reticle.position, game.world.position);

	const leftArmPosition = add(mech.leftArm.position, mech.position);
	const leftArmReticleDirectionVector = subtract(reticleWorldPosition, leftArmPosition);
	const leftArmReticleAngle = Math.atan2(leftArmReticleDirectionVector.y, leftArmReticleDirectionVector.x);
	const leftArmAngleDifference = Math.abs(boundAngle(leftArmReticleAngle - mech.leftArm.direction));

	const rightArmPosition = add(mech.rightArm.position, mech.position);
	const rightArmReticleDirectionVector = subtract(reticleWorldPosition, rightArmPosition);
	const rightArmReticleAngle = Math.atan2(rightArmReticleDirectionVector.y, rightArmReticleDirectionVector.x);
	const rightArmAngleDifference = Math.abs(boundAngle(rightArmReticleAngle - mech.rightArm.direction));

	const inaccuracyRatio = Math.min(leftArmAngleDifference + rightArmAngleDifference, maximumInaccuracyAngle) / maximumInaccuracyAngle;
	const expansion = inaccuracyRatio * maximumExpansion;
	reticle.expansion = expansion;

	if (joystick) joystick.direction = game.input.moveDirection;
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

class Panel extends Graphics {
	constructor(position: Vector, size: Vector) {
		super();

		this.beginFill(0x000000);
		this.drawRect(position.x, position.y, size.x, size.y);
		this.endFill();
	}
}

class Joystick extends Container {
	private _backgroundSprite: Sprite;
	private _stickSprite: Sprite;
	private _direction: Vector = { x: 0, y: 0 };
	private _stickDistance: number;

	constructor(position: Vector, joystickRadius: number, renderer: Renderer) {
		super();

		this._stickDistance = (joystickRadius / 8) * 7;

		const graphics = new Graphics();
		graphics.beginFill(0xff8800);
		graphics.drawCircle(0, 0, joystickRadius);
		graphics.endFill();

		const backgroundTexture = renderer.generateTexture(graphics, SCALE_MODES.NEAREST, window.devicePixelRatio);
		this._backgroundSprite = new Sprite(backgroundTexture);
		this._backgroundSprite.alpha = 0.2;
		this._backgroundSprite.anchor.set(0.5);
		this.addChild(this._backgroundSprite);

		const stickTexture = getResource(Resource.HUD).spritesheet!.textures["joystick.png"];
		this._stickSprite = new Sprite(stickTexture);
		this._stickSprite.anchor.set(0.5);
		this.addChild(this._stickSprite);

		this.position.set(position.x, position.y);
	}

	public get direction(): Vector {
		return this._direction;
	}
	public set direction(value: Vector) {
		this._direction = value;

		const stickOffset = multiply(value, this._stickDistance);
		this._stickSprite.position.set(stickOffset.x, stickOffset.y);
	}
}

export { hudInit, hudSystem };
