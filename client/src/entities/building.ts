import { Sprite } from "pixi.js";
import { getResource, Resource } from "../assets";
import { BodyComponent, Edges } from "../components";
import { multiply, ObjectData, Vector } from "../utilities";

class Building extends Sprite implements BodyComponent {
	private _location: Vector = { x: 0, y: 0 };
	private _cameraOffset: Vector = { x: 0, y: 0 };

	constructor(objectData: ObjectData) {
		super(getResource(Resource.Building).spritesheet!.textures["building_top.png"]);

		console.log(objectData);
		this.elevation = 0.25;
		this.location = objectData.location;
		this.size = objectData.size;
		this.edges = { bottom: true, left: true, right: true, top: true };
		this.scale.set(1 + this.elevation);
		this.zIndex = this.elevation * 10;
		this.anchor.set(0.5);
	}

	public elevation: number;
	public set cameraOffset(value: Vector) {
		if (this._cameraOffset && this._cameraOffset.x === value.x && this._cameraOffset.y === value.y) return;

		this._cameraOffset = value;
		this.updatePosition();
	}
	public get location(): Vector {
		return this._location;
	}
	public set location(value: Vector) {
		this._location = value;
		this.updatePosition();
	}
	public size: Vector;
	public edges: Edges;
	public destroyed: boolean = false;

	private updatePosition(): void {
		const displacement = multiply(this._cameraOffset, this.elevation);

		this.position.x = Math.round(this._location.x - displacement.x);
		this.position.y = Math.round(this._location.y - displacement.y);
	}
}

export { Building };
