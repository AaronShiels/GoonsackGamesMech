import { Edges, PhysicsComponent } from "../components";
import { getResource, Resource } from "../assets";
import { boundAngle, toDegrees, Vector } from "../utilities";
import { AnimatedSprite, Spritesheet, Texture } from "pixi.js";

class Mech extends AnimatedSprite implements PhysicsComponent {
	private _spriteSheet: Spritesheet;
	private _direction: number = 0;

	constructor(position: Vector) {
		super(getResource(Resource.Mech).spritesheet!.animations["mech_0"]);

		this._spriteSheet = getResource(Resource.Mech).spritesheet!;

		this.x = position.x;
		this.y = position.y;
		this.anchor.set(0.5);
		this.autoUpdate = false;
		this.play();
	}

	public get direction(): number {
		return this._direction;
	}

	public set direction(value: number) {
		this._direction = value;

		const degreeAngle = boundAngle(toDegrees(value), 0, 360);
		const roundedDegreeAngle = Math.round(degreeAngle / 15) * 15;

		this.textures = this._spriteSheet.animations[`mech_${roundedDegreeAngle % 90}`];
		this.angle = Math.floor(roundedDegreeAngle / 90) * 90;
	}

	public velocity: Vector = { x: 0, y: 0 };
	public acceleration: Vector = { x: 0, y: 0 };
	public size: Vector = { x: 32, y: 32 };
	public edges: Edges = { bottom: true, left: true, right: true, top: true };
	public x: number = 0;
	public y: number = 0;
	public destroyed: boolean = false;
}

export { Mech };
