import { Edges, PhysicsComponent } from "../components";
import { getResource, Resource } from "../assets";
import { add, boundAngle, dot, hasValue, length, multiply, normalise, Side, subtract, toDegrees, Vector } from "../utilities";
import { Container, Sprite, Spritesheet, Transform } from "pixi.js";

const armTangentDistance = 22;
const footMoveSpeed = 200;
const footTangentDistance = 12;
const maxFootNormalDistance = 16;

class Mech extends Container implements PhysicsComponent {
	private _body: MechBody;
	private _leftArm: MechArm;
	private _rightArm: MechArm;
	private _leftFoot: MechFoot;
	private _rightFoot: MechFoot;

	private readonly _previousPosition: Vector = { x: 0, y: 0 };

	constructor(position: Vector, direction: number = 0) {
		super();

		this._body = new MechBody(direction);
		this.addChild(this._body);
		this._leftArm = new MechArm(direction, Side.Left);
		this.addChild(this._leftArm);
		this._rightArm = new MechArm(direction, Side.Right);
		this.addChild(this._rightArm);
		this._leftFoot = new MechFoot(direction, Side.Left);
		this.addChild(this._leftFoot);
		this._rightFoot = new MechFoot(direction, Side.Right);
		this.addChild(this._rightFoot);

		this.transform = new ObservableTransform(() => {
			const positionDiff = subtract(this.position, this._previousPosition);

			if (!hasValue(positionDiff)) return;

			this._previousPosition.x = this.position.x;
			this._previousPosition.y = this.position.y;

			this._leftFoot.adjust(positionDiff);
			this._rightFoot.adjust(positionDiff);
		});

		this.position.set(position.x, position.y);
		this._leftFoot.position.set(0);
		this._rightFoot.position.set(0);
		this._leftFoot.position.set(0);
		this._leftFoot.targetPosition.x = 0;
		this._leftFoot.targetPosition.y = 0;
		this._rightFoot.position.set(0);
		this._rightFoot.targetPosition.x = 0;
		this._rightFoot.targetPosition.y = 0;
	}

	public cannonRemainingReloadSeconds: number = 0;
	public cannonRecoil: number = 0;

	public get bodyDirection(): number {
		return this._body.direction;
	}
	public set bodyDirection(value: number) {
		this._body.direction = value;

		const bodyDirectionNormal = { x: Math.cos(this._body.direction), y: Math.sin(this._body.direction) };
		const normalOffset = multiply({ x: bodyDirectionNormal.x, y: bodyDirectionNormal.y }, -this.cannonRecoil);
		const leftTangentOffset = multiply({ x: bodyDirectionNormal.y, y: -bodyDirectionNormal.x }, armTangentDistance);
		const rightTangentOffset = multiply({ x: -bodyDirectionNormal.y, y: bodyDirectionNormal.x }, armTangentDistance);
		const leftArmOffset = add(normalOffset, leftTangentOffset);
		const rightArmOffset = add(normalOffset, rightTangentOffset);

		this._leftArm.position.set(leftArmOffset.x, leftArmOffset.y);
		this._rightArm.position.set(rightArmOffset.x, rightArmOffset.y);
	}
	public get leftArmDirection(): number {
		return this._leftArm.direction;
	}
	public set leftArmDirection(value: number) {
		this._leftArm.direction = value;
	}
	public get leftArmPosition(): Vector {
		return this._leftArm.position;
	}
	public get rightArmDirection(): number {
		return this._rightArm.direction;
	}
	public set rightArmDirection(value: number) {
		this._rightArm.direction = value;
	}
	public get rightArmPosition(): Vector {
		return this._rightArm.position;
	}
	public readonly velocity: Vector = { x: 0, y: 0 };
	public readonly acceleration: Vector = { x: 0, y: 0 };
	public readonly friction: number = 10;
	public readonly size: Vector = { x: 32, y: 32 };
	public readonly edges: Edges = { bottom: true, left: true, right: true, top: true };
	public destroyed: boolean = false;

	public walk(deltaSeconds: number): void {
		this.checkFootSteps();

		this._leftFoot.move(deltaSeconds);
		this._rightFoot.move(deltaSeconds);
	}

	private checkFootSteps(): void {
		if (!hasValue(this.velocity)) return;

		const directionVector = normalise(this.velocity);
		const leftFootCentreScalarOffset = dot(this._leftFoot.targetPosition, directionVector);
		const rightFootCentreScalarOffset = dot(this._rightFoot.targetPosition, directionVector);

		const bothFeetBehind = leftFootCentreScalarOffset < 0 && rightFootCentreScalarOffset < 0;
		if ((bothFeetBehind && rightFootCentreScalarOffset > leftFootCentreScalarOffset) || Math.abs(leftFootCentreScalarOffset) > maxFootNormalDistance)
			this._leftFoot.step(directionVector);
		else if ((bothFeetBehind && rightFootCentreScalarOffset <= leftFootCentreScalarOffset) || Math.abs(rightFootCentreScalarOffset) > maxFootNormalDistance)
			this._rightFoot.step(directionVector);
	}
}

class MechBody extends Sprite {
	private _spritesheet: Spritesheet;
	private _direction: number = 0;

	constructor(direction: number) {
		super();

		this._spritesheet = getResource(Resource.Mech).spritesheet!;

		this.anchor.set(0.5);
		this.direction = direction;
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
	}
}

class MechArm extends Sprite {
	private _spritesheet: Spritesheet;
	private _direction: number = 0;
	private _side: Side;

	constructor(direction: number, side: Side) {
		super();

		this._spritesheet = getResource(Resource.Mech).spritesheet!;
		this._side = side;

		this.anchor.set(0.5);
		this.zIndex = -1;

		this.direction = direction;
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
	private readonly _spritesheet: Spritesheet;
	private readonly _side: Side;
	private _direction: number = 0;

	constructor(direction: number, side: Side) {
		super();

		this._spritesheet = getResource(Resource.Mech).spritesheet!;
		this._side = side;

		this.anchor.set(0.5);
		this.zIndex = -2;

		this.direction = direction;
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

	public adjust(offset: Vector): void {
		this.position.x -= offset.x;
		this.position.y -= offset.y;

		this.targetPosition.x -= offset.x;
		this.targetPosition.y -= offset.y;
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
