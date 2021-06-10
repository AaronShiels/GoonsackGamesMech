import { Container, ObservablePoint, Sprite } from "pixi.js";
import { getResource, Resource } from "../assets";
import { Edges, ElevationComponent } from "../components";
import { ObjectData, Vector } from "../utilities";

const maxFloors = 8;
const minFloors = 4;

class BuildingSegment extends Container implements ElevationComponent {
	private _segmentSprite: Sprite;

	constructor(objectData: ObjectData, floor: number, roof: boolean) {
		super();

		this.position.x = objectData.position.x;
		this.position.y = objectData.position.y;
		this.size = objectData.size;
		this.edges = { bottom: !floor, left: !floor, right: !floor, top: !floor };
		this.elevation = floor;

		const spriteSheet = getResource(Resource.Building).spritesheet!;
		const texture = spriteSheet.textures[`building_${roof ? "roof" : "side"}.png`];
		this._segmentSprite = new Sprite(texture);
		this._segmentSprite.anchor.set(0.5);
		this.addChild(this._segmentSprite);
	}

	public readonly size: Vector;
	public readonly edges: Edges;
	public get elevation(): number {
		return this.zIndex;
	}
	public set elevation(value: number) {
		this.zIndex = value;
	}
	public readonly perspectiveDisplacement: ObservablePoint = new ObservablePoint(this.updateDisplacement, this);
	public get perspectiveScale(): number {
		return this._segmentSprite.scale.x;
	}
	public set perspectiveScale(value: number) {
		this._segmentSprite.scale.set(value);
	}
	public destroyed: boolean = false;

	private updateDisplacement(): void {
		this._segmentSprite.position.x = this.perspectiveDisplacement.x;
		this._segmentSprite.position.y = this.perspectiveDisplacement.y;
	}
}

const createBuilding = (objectData: ObjectData): BuildingSegment[] => {
	const segmentCount = Math.floor(Math.random() * (maxFloors - minFloors + 1) + minFloors);

	const buildingSegments = [];
	for (let i = 0; i < segmentCount; i++) buildingSegments.push(new BuildingSegment(objectData, i, i === segmentCount - 1));

	return buildingSegments;
};

export { BuildingSegment, createBuilding };
