import { Edges, PhysicsComponent } from "../components";
import { getResource, Resource } from "../assets";
import { boundAngle, toDegrees, Vector } from "../utilities";
import { Container, Graphics, Sprite, Spritesheet } from "pixi.js";

class Mech extends Container implements PhysicsComponent {
	private _location: Vector = { x: 0, y: 0 };

	constructor(location: Vector) {
		super();

		this.body = new MechBody(0);
		this.addChild(this.body);
		this.leftFoot = new MechFoot(location);
		this.leftFoot.zIndex = this.zIndex - 1;
		this.addChild(this.leftFoot);
		this.rightFoot = new MechFoot(location);
		this.rightFoot.zIndex = this.zIndex - 1;
		this.addChild(this.rightFoot);

		// Initialise location
		this.location = location;
	}

	public get location(): Vector {
		return this._location;
	}
	public set location(value: Vector) {
		this._location = value;

		this.position.x = Math.round(value.x);
		this.position.y = Math.round(value.y);

		// Force correction of feet relative to mech
		this.leftFoot.location = this.leftFoot.location;
		this.rightFoot.location = this.rightFoot.location;
	}

	public readonly body: MechBody;
	public readonly leftFoot: MechFoot;
	public readonly rightFoot: MechFoot;

	public velocity: Vector = { x: 0, y: 0 };
	public acceleration: Vector = { x: 0, y: 0 };
	public size: Vector = { x: 32, y: 32 };
	public edges: Edges = { bottom: true, left: true, right: true, top: true };
	public destroyed: boolean = false;
}

class MechBody extends Sprite {
	private _spritesheet: Spritesheet;
	private _direction: number = 0;

	constructor(initialDirection: number) {
		super();

		this._spritesheet = getResource(Resource.Mech).spritesheet!;
		this.texture = this._spritesheet.textures["mech_0.png"];
		this.anchor.set(0.5);

		this.direction = initialDirection;
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

class MechFoot extends Graphics {
	private _location: Vector = { x: 0, y: 0 };

	constructor(initalLocation: Vector) {
		super();

		this.beginFill(0x0000ff);
		this.drawCircle(0, 0, 10);
		this.endFill();

		this.location = initalLocation;
		this.desiredLocation = initalLocation;
	}

	public get location(): Vector {
		return this._location;
	}
	public set location(value: Vector) {
		this._location = value;

		if (!this.parent || !(this.parent instanceof Mech)) return;

		this.position.x = Math.round(this._location.x - this.parent.location.x);
		this.position.y = Math.round(this._location.y - this.parent.location.y);
	}
	public desiredLocation: Vector;
}

export { Mech, MechBody, MechFoot };
