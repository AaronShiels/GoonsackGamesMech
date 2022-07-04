import { Container, Sprite, Spritesheet, Transform } from "pixi.js";
import { MechComponent } from "../components/mech.js";
import { Edges } from "../components/body.js";
import { add, dot, hasValue, length, multiply, normalise, subtract, Vector } from "../utilities/vector.js";
import { boundAngle, toDegrees } from "../utilities/angles.js";
import { getResource, Resource } from "../assets/index.js";

const armTangentDistance = 22;
const footMoveSpeed = 200;
const footTangentDistance = 12;
const maxFootNormalDistance = 16;

class Mech extends Container implements MechComponent {
	private readonly _previousPosition: Vector = { x: 0, y: 0 };

	constructor() {
		super();

		this.torso = new MechTorso(this);
		this.leftArm = new MechArm(this, Side.Left);
		this.rightArm = new MechArm(this, Side.Right);
		this.leftFoot = new MechFoot(this, Side.Left);
		this.rightFoot = new MechFoot(this, Side.Right);

		this.transform = new ObservableTransform(() => {
			const positionDiff = subtract(this.position, this._previousPosition);

			if (!hasValue(positionDiff)) return;

			this._previousPosition.x = this.position.x;
			this._previousPosition.y = this.position.y;

			this.leftFoot.position.x -= positionDiff.x;
			this.leftFoot.position.y -= positionDiff.y;
			this.leftFoot.targetPosition.x -= positionDiff.x;
			this.leftFoot.targetPosition.y -= positionDiff.y;

			this.rightFoot.position.x -= positionDiff.x;
			this.rightFoot.position.y -= positionDiff.y;
			this.rightFoot.targetPosition.x -= positionDiff.x;
			this.rightFoot.targetPosition.y -= positionDiff.y;
		});
	}

	public readonly velocity: Vector = { x: 0, y: 0 };
	public readonly acceleration: Vector = { x: 0, y: 0 };
	public readonly friction: number = 10;
	public readonly size: Vector = { x: 32, y: 32 };
	public readonly edges: Edges = { bottom: true, left: true, right: true, top: true };
	public readonly torso: MechTorso;
	public readonly leftArm: MechArm;
	public readonly rightArm: MechArm;
	public readonly leftFoot: MechFoot;
	public readonly rightFoot: MechFoot;
	public cannonRemainingReloadSeconds: number = 0;
	public cannonRecoil: number = 0;
	public destroyed: boolean = false;

	public rotate(direction: number): void {
		const bodyDirectionNormal = { x: Math.cos(direction), y: Math.sin(direction) };
		const normalOffset = multiply({ x: bodyDirectionNormal.x, y: bodyDirectionNormal.y }, -this.cannonRecoil);
		const leftTangentOffset = multiply({ x: bodyDirectionNormal.y, y: -bodyDirectionNormal.x }, armTangentDistance);
		const rightTangentOffset = multiply({ x: -bodyDirectionNormal.y, y: bodyDirectionNormal.x }, armTangentDistance);
		const leftArmOffset = add(normalOffset, leftTangentOffset);
		const rightArmOffset = add(normalOffset, rightTangentOffset);

		this.leftArm.position.set(leftArmOffset.x, leftArmOffset.y);
		this.rightArm.position.set(rightArmOffset.x, rightArmOffset.y);
	}

	public walk(deltaSeconds: number): void {
		if (hasValue(this.velocity)) {
			const directionVector = normalise(this.velocity);
			const leftFootCentreScalarOffset = dot(this.leftFoot.targetPosition, directionVector);
			const rightFootCentreScalarOffset = dot(this.rightFoot.targetPosition, directionVector);

			const bothFeetBehind = leftFootCentreScalarOffset < 0 && rightFootCentreScalarOffset < 0;
			if ((bothFeetBehind && rightFootCentreScalarOffset > leftFootCentreScalarOffset) || Math.abs(leftFootCentreScalarOffset) > maxFootNormalDistance)
				this.leftFoot.step(directionVector);
			else if (
				(bothFeetBehind && rightFootCentreScalarOffset <= leftFootCentreScalarOffset) ||
				Math.abs(rightFootCentreScalarOffset) > maxFootNormalDistance
			)
				this.rightFoot.step(directionVector);
		}

		this.leftFoot.move(deltaSeconds);
		this.rightFoot.move(deltaSeconds);
	}
}

class MechTorso extends Sprite {
	private _mech: Mech;
	private _spritesheet: Spritesheet;
	private _direction: number = 0;

	constructor(mech: Mech) {
		super();

		this._mech = mech;
		this._spritesheet = getResource(Resource.Mech).spritesheet!;

		this._mech.addChild(this);
		this.anchor.set(0.5);
	}

	public get direction(): number {
		return this._direction;
	}
	public set direction(value: number) {
		this._direction = value;

		const degreeAngle = boundAngle(toDegrees(value), 0, 360);
		const roundedDegreeAngle = Math.round(degreeAngle / 15) * 15;

		this.texture = this._spritesheet.textures[`mech_${roundedDegreeAngle % 90}.png`];
		this.angle = Math.floor(roundedDegreeAngle / 90) * 90;

		this._mech.rotate(this._direction);
	}
}

enum Side {
	Left = "left",
	Right = "right"
}

class MechArm extends Sprite {
	private _mech: Mech;
	private _spritesheet: Spritesheet;
	private _direction: number = 0;
	private _side: Side;

	constructor(mech: Mech, side: Side) {
		super();

		this._mech = mech;
		this._spritesheet = getResource(Resource.Mech).spritesheet!;
		this._side = side;

		this._mech.addChild(this);
		this.anchor.set(0.5);
		this.zIndex = -1;
	}

	public get direction(): number {
		return this._direction;
	}
	public set direction(value: number) {
		this._direction = value;

		const degreeAngle = boundAngle(toDegrees(value), 0, 360);
		const roundedDegreeAngle = Math.round(degreeAngle / 15) * 15;

		this.texture = this._spritesheet.textures[`arm_${this._side}_${roundedDegreeAngle % 90}.png`];
		this.angle = Math.floor(roundedDegreeAngle / 90) * 90;
	}
}

class MechFoot extends Sprite {
	private readonly _mech: Mech;
	private readonly _spritesheet: Spritesheet;
	private readonly _side: Side;
	private _direction: number = 0;

	constructor(mech: Mech, side: Side) {
		super();

		this._mech = mech;
		this._spritesheet = getResource(Resource.Mech).spritesheet!;
		this._side = side;

		this._mech.addChild(this);
		this.anchor.set(0.5);
		this.zIndex = -2;
	}

	public get direction(): number {
		return this._direction;
	}
	public set direction(value: number) {
		this._direction = value;

		const degreeAngle = boundAngle(toDegrees(value), 0, 360);
		const roundedDegreeAngle = Math.round(degreeAngle / 45) * 45;

		this.texture = this._spritesheet.textures[`foot_${roundedDegreeAngle % 90}.png`];
		this.angle = Math.floor(roundedDegreeAngle / 90) * 90;
	}
	public readonly targetPosition: Vector = { x: 0, y: 0 };

	public step(directionVector: Vector): void {
		const centredTargetFootPosition = multiply(directionVector, maxFootNormalDistance);
		const tangentDirection = this._side === Side.Left ? 1 : -1;
		const tangentOffset = multiply({ x: directionVector.y * tangentDirection, y: directionVector.x * -tangentDirection }, footTangentDistance);
		const targetForwardFootPosition = add(centredTargetFootPosition, tangentOffset);
		const direction = Math.atan2(directionVector.y, directionVector.x);

		this.targetPosition.x = targetForwardFootPosition.x;
		this.targetPosition.y = targetForwardFootPosition.y;
		this.direction = direction;
	}

	public move(deltaSeconds: number): void {
		const deltaDistance = footMoveSpeed * deltaSeconds;

		const targetPositionDiff = subtract(this.targetPosition, this.position);
		if (!hasValue(targetPositionDiff)) return;

		if (length(targetPositionDiff) > deltaDistance) {
			const positionDelta = multiply(normalise(targetPositionDiff), deltaDistance);

			this.position.x += positionDelta.x;
			this.position.y += positionDelta.y;
		} else this.position.set(this.targetPosition.x, this.targetPosition.y);
	}
}

class ObservableTransform extends Transform {
	private _callback: (scope: Transform) => void;

	constructor(callback: (scope: Transform) => void) {
		super();

		this._callback = callback;
	}

	protected onChange() {
		this._callback(this);
		super.onChange();
	}
}

export { Mech };
