import { Edges, PhysicsComponent } from "../components";
import { getResource, Resource } from "../assets";
import { boundAngle, Side, toDegrees, Vector } from "../utilities";
import { Container, ObservablePoint, Sprite, Spritesheet, Transform } from "pixi.js";

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

class Mech extends Container implements PhysicsComponent {
	constructor(position: Vector, direction: number = 0) {
		super();

		this.body = new MechBody(direction);
		this.addChild(this.body);
		this.leftArm = new MechArm(direction, Side.Left);
		this.addChild(this.leftArm);
		this.rightArm = new MechArm(direction, Side.Right);
		this.addChild(this.rightArm);
		this.leftFoot = new MechFoot(direction, position);
		this.addChild(this.leftFoot);
		this.rightFoot = new MechFoot(direction, position);
		this.addChild(this.rightFoot);

		this.transform = new ObservableTransform(() => this.adjustFeet());

		this.position.x = position.x;
		this.position.y = position.y;
	}

	public readonly body: MechBody;
	public readonly leftArm: MechArm;
	public readonly rightArm: MechArm;
	public readonly leftFoot: MechFoot;
	public readonly rightFoot: MechFoot;

	public readonly velocity: Vector = { x: 0, y: 0 };
	public readonly acceleration: Vector = { x: 0, y: 0 };
	public readonly size: Vector = { x: 32, y: 32 };
	public readonly edges: Edges = { bottom: true, left: true, right: true, top: true };
	public destroyed: boolean = false;

	private adjustFeet(): void {
		this.leftFoot.position.x = this.leftFoot.absolutePosition.x - this.position.x;
		this.leftFoot.position.y = this.leftFoot.absolutePosition.y - this.position.y;

		this.rightFoot.position.x = this.rightFoot.absolutePosition.x - this.position.x;
		this.rightFoot.position.y = this.rightFoot.absolutePosition.y - this.position.y;
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
	private _spritesheet: Spritesheet;
	private _direction: number = 0;

	constructor(direction: number, absolutePosition: Vector) {
		super();

		this._spritesheet = getResource(Resource.Mech).spritesheet!;

		this.anchor.set(0.5);
		this.zIndex = -2;

		this.direction = direction;
		this.absolutePosition = new ObservablePoint(this.adjust, this, absolutePosition.x, absolutePosition.y);
		this.desiredAbsolutePosition = { ...absolutePosition };
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
	public readonly desiredAbsolutePosition: Vector;
	public readonly absolutePosition: ObservablePoint;

	private adjust(): void {
		if (!this.parent || !(this.parent instanceof Mech)) return;

		this.position.x = this.absolutePosition.x - this.parent.position.x;
		this.position.y = this.absolutePosition.y - this.parent.position.y;
	}
}

export { Mech, MechBody, MechArm, MechFoot };
