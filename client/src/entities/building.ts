import { Container, Sprite } from "pixi.js";
import { getResource, Resource } from "../assets";
import { Edges, ElevationComponent } from "../components";
import { ObjectData, Vector } from "../utilities";

const maxFloors = 8;
const minFloors = 4;

class BuildingSegment extends Container implements ElevationComponent {
	private _location: Vector = { x: 0, y: 0 };
	private _elevation: number = 0;
	private _perspectiveDisplacement: Vector = { x: 0, y: 0 };
	private _perspectiveScale: number = 1;
	private _segmentSprite: Sprite;

	constructor(objectData: ObjectData, floor: number, roof: boolean) {
		super();

		this.location = objectData.location;
		this.size = objectData.size;
		this.edges = { bottom: !floor, left: !floor, right: !floor, top: !floor };
		this.elevation = floor;

		const spriteSheet = getResource(Resource.Building).spritesheet!;
		const texture = spriteSheet.textures[`building_${roof ? "roof" : "side"}.png`];
		this._segmentSprite = new Sprite(texture);
		this._segmentSprite.anchor.set(0.5);
		this.addChild(this._segmentSprite);
	}

	public get location(): Vector {
		return this._location;
	}
	public set location(value: Vector) {
		this._location = value;

		this.position.x = value.x;
		this.position.y = value.y;
	}
	public size: Vector;
	public edges: Edges;
	public get elevation(): number {
		return this._elevation;
	}
	public set elevation(value: number) {
		this._elevation = value;

		this.zIndex = value;
	}
	public get perspectiveDisplacement(): Vector {
		return this._perspectiveDisplacement;
	}
	public set perspectiveDisplacement(value: Vector) {
		this._perspectiveDisplacement = value;

		this._segmentSprite.position.x = Math.round(value.x);
		this._segmentSprite.position.y = Math.round(value.y);
	}
	public get perspectiveScale(): number {
		return this._perspectiveScale;
	}
	public set perspectiveScale(value: number) {
		this._perspectiveScale = value;

		this._segmentSprite.scale.set(value);
	}
	public destroyed: boolean = false;
}

const createBuilding = (objectData: ObjectData): BuildingSegment[] => {
	const segmentCount = Math.floor(Math.random() * (maxFloors - minFloors + 1) + minFloors);

	const buildingSegments = [];
	for (let i = 0; i < segmentCount; i++) buildingSegments.push(new BuildingSegment(objectData, i, i === segmentCount - 1));

	return buildingSegments;
};

/* OLD IMPLEMENTATION
class Building extends Container implements BodyComponent {
	private readonly _roof: Sprite;
	private readonly _sideNS: Sprite[] = [];
	private readonly _sideEW: Sprite[] = [];

	private _cameraOffset: Vector = { x: 0, y: 0 };

	constructor(objectData: ObjectData) {
		super();

		this.elevation = 0.25;
		this.location = objectData.location;
		this.size = objectData.size;
		this.edges = { bottom: true, left: true, right: true, top: true };

		this.position.x = this.location.x;
		this.position.y = this.location.y;

		const spriteSheet = getResource(Resource.Building).spritesheet!;
		const roofTexture = spriteSheet.textures["building_roof.png"];
		const sideTexture = spriteSheet.textures["building_side.png"];

		this._roof = new Sprite(roofTexture);
		this._roof.anchor.set(0.5);
		this._roof.zIndex = 1;
		this.addChild(this._roof);

		for (let i = 0; i < segmentCount; i++) {
			const segmentNS = new Sprite(sideTexture);
			segmentNS.anchor.set(0.5);
			this.addChild(segmentNS);
			this._sideNS.push(segmentNS);

			const segmentEW = new Sprite(sideTexture);
			segmentEW.anchor.set(0.5);
			this.addChild(segmentEW);
			this._sideEW.push(segmentEW);
		}
	}

	public elevation: number;
	public location: Vector;
	public size: Vector;
	public edges: Edges;
	public destroyed: boolean = false;

	public updatePerspective(cameraOffset: Vector): void {
		if (this._cameraOffset.x === cameraOffset.x && this._cameraOffset.y === cameraOffset.y) return;

		this._cameraOffset = cameraOffset;

		// Calculate roof
		const roofWidth = Math.round(this.size.x * (1 + this.elevation));
		const roofHeight = Math.round(this.size.y * (1 + this.elevation));
		const roofDisplacementX = Math.round(-this._cameraOffset.x * this.elevation);
		const roofDisplacementY = Math.round(-this._cameraOffset.y * this.elevation);

		this._roof.position.x = roofDisplacementX;
		this._roof.position.y = roofDisplacementY;
		this._roof.width = roofWidth;
		this._roof.height = roofHeight;

		// Calculate sides
		const positionXInterval = roofDisplacementX / segmentCount;
		const positionYInterval = roofDisplacementY / segmentCount;
		const widthInterval = (roofWidth - this.size.x) / segmentCount;
		const heightInterval = (roofHeight - this.size.y) / segmentCount;

		const sideEWCoefficient = cameraOffset.x >= 0 ? 1 : -1;
		const sideNSCoefficient = cameraOffset.y >= 0 ? 1 : -1;
		const sideEWGround = (sideEWCoefficient * this.size.x) / 2;
		const sideNSGround = (sideNSCoefficient * this.size.y) / 2;
		const sideEWRoof = roofDisplacementX + (sideEWCoefficient * roofWidth) / 2;
		const sideNSRoof = roofDisplacementY + (sideNSCoefficient * roofHeight) / 2;

		const sideEWInterval = (sideEWRoof - sideEWGround) / segmentCount;
		const sideNSInterval = (sideNSRoof - sideNSGround) / segmentCount;

		for (let i = 0; i < segmentCount; i++) {
			this._sideNS[i].width = this.size.x + widthInterval * i;
			this._sideNS[i].height = sideNSInterval;
			this._sideNS[i].position.x = positionXInterval * i;
			this._sideNS[i].position.y = sideNSGround + sideNSInterval * i + sideNSInterval / 2;

			this._sideEW[i].width = sideEWInterval;
			this._sideEW[i].height = this.size.y + heightInterval * i;
			this._sideEW[i].position.x = sideEWGround + sideEWInterval * i + sideEWInterval / 2;
			this._sideEW[i].position.y = positionYInterval * i;
		}
	}
}
*/

export { BuildingSegment, createBuilding };
