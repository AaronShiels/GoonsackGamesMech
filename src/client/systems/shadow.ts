import { BLEND_MODES, Container, Graphics, Renderer, SCALE_MODES, Sprite } from "pixi.js";
import { hasBody, getBounds } from "../../common/components/body.js";
import { Rectangle } from "../../common/utilities/rectangle.js";
import { add, subtract, Vector } from "../../common/utilities/vector.js";
import { Mech } from "../entities/mech.js";
import { Initialiser, System } from "../../common/systems/system.js";
import { Entity } from "../../common/entities/entity.js";

const shadowStrength = 0.2;
const accuracyDelta: number = 0.01;
const boundaryBuffer: number = 10;

let shadow: Shadow | undefined;

const shadowInit: Initialiser = (game) => {
	shadow = new Shadow(game.renderer);
	game.world.addChild(shadow);
};

const shadowSystem: System = (game) => {
	if (!shadow) throw new Error("Shadows not initialised");

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	const cameraBounds: Rectangle = {
		x: game.camera.x - (game.camera.width + boundaryBuffer) / 2,
		y: game.camera.y - (game.camera.height + boundaryBuffer) / 2,
		width: game.camera.width + boundaryBuffer,
		height: game.camera.height + boundaryBuffer
	};

	const rectangles = getRectangles(game.entities, cameraBounds);
	const testVertices = generateTestVertices(rectangles);
	const segments = getSegments(rectangles, cameraBounds);
	const lightPoints = getLightPoints(testVertices, segments, mech.position);
	const sortedPoints = lightPoints.sort((a, b) => radialSort(mech.position, a, b));

	shadow.update(sortedPoints, cameraBounds);
};

class Shadow extends Container {
	private _renderer: Renderer;
	private _lightGeometry: Graphics;
	private _shadowSprite: Sprite;

	constructor(renderer: Renderer) {
		super();

		this._renderer = renderer;
		this._lightGeometry = new Graphics();
		this._shadowSprite = new Sprite();
		this._shadowSprite.alpha = shadowStrength;
		this._shadowSprite.blendMode = BLEND_MODES.MULTIPLY;

		this.addChild(this._shadowSprite);
	}

	public update(lightPoints: Vector[], bounds: Rectangle): void {
		const polygonData: number[] = [];
		for (const point of lightPoints) polygonData.push(point.x, point.y);

		this._lightGeometry.clear();

		this._lightGeometry.beginFill(0x000000, 1);
		this._lightGeometry.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
		this._lightGeometry.endFill();

		this._lightGeometry.beginFill(0xffffff, 1);
		this._lightGeometry.drawPolygon(polygonData);
		this._lightGeometry.endFill();

		this._shadowSprite.texture.destroy(true);
		this._shadowSprite.texture = this._renderer.generateTexture(this._lightGeometry, SCALE_MODES.NEAREST, window.devicePixelRatio);
		this._shadowSprite.position.set(bounds.x, bounds.y);
	}
}

const getRectangles = (entities: ReadonlyArray<Entity>, bounds: Rectangle): Rectangle[] => {
	const rectangles: Rectangle[] = [];

	for (const entity of entities) {
		if (!hasBody(entity)) continue;
		if (!(entity.edges.bottom && entity.edges.left && entity.edges.right && entity.edges.top)) continue;
		if (entity instanceof Mech) continue;

		const entityBounds = getBounds(entity);
		if (entityBounds.x + entityBounds.width < bounds.x) continue;
		if (entityBounds.x > bounds.x + bounds.width) continue;
		if (entityBounds.y + entityBounds.height < bounds.y) continue;
		if (entityBounds.y / 2 > bounds.y + bounds.height) continue;

		rectangles.push(entityBounds);
	}
	rectangles.push(bounds);

	return rectangles;
};

const generateTestVertices = (rectangles: Rectangle[]): Vector[] => {
	const testVertices: Vector[] = [];

	for (const rectangle of rectangles) {
		const corners: Vector[] = [
			{ x: rectangle.x, y: rectangle.y },
			{ x: rectangle.x, y: rectangle.y + rectangle.height },
			{ x: rectangle.x + rectangle.width, y: rectangle.y },
			{ x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height }
		];
		for (const corner of corners) {
			const positiveTest = add(corner, accuracyDelta);
			const negativeTest = subtract(corner, accuracyDelta);

			testVertices.push(positiveTest, negativeTest);
		}
	}

	return testVertices;
};

const getSegments = (rectangles: Rectangle[], bounds: Rectangle): Segment[] => {
	const segments: Segment[] = [];

	for (const rectangle of rectangles) {
		const rectangleSegments = toSegments(rectangle);
		segments.push(...rectangleSegments);
	}

	const boundarySegments = toSegments(bounds);
	segments.push(...boundarySegments);

	return segments;
};

const getLightPoints = (testVertices: Vector[], segments: Segment[], source: Vector): Vector[] => {
	const lightPoints: Vector[] = [];

	for (const testVertex of testVertices) {
		let shortestDistanceSquared: number = Number.POSITIVE_INFINITY;
		let closestIntersection: Vector | undefined;

		const ray: Segment = {
			x0: source.x,
			y0: source.y,
			x1: testVertex.x,
			y1: testVertex.y
		};
		for (const segment of segments) {
			const intersection = getIntersection(ray, segment);
			if (!intersection) continue;

			const distanceSquared = (ray.x0 - intersection.x) * (ray.x0 - intersection.x) + (ray.y0 - intersection.y) * (ray.y0 - intersection.y);
			if (distanceSquared >= shortestDistanceSquared) continue;

			shortestDistanceSquared = distanceSquared;
			closestIntersection = intersection;
		}

		if (closestIntersection) lightPoints.push(closestIntersection);
	}

	return lightPoints;
};

interface Segment {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

const toSegments = (rectangle: Rectangle): Segment[] => [
	{ x0: rectangle.x, y0: rectangle.y, x1: rectangle.x + rectangle.width, y1: rectangle.y },
	{ x0: rectangle.x, y0: rectangle.y, x1: rectangle.x, y1: rectangle.y + rectangle.height },
	{ x0: rectangle.x, y0: rectangle.y + rectangle.height, x1: rectangle.x + rectangle.width, y1: rectangle.y + rectangle.height },
	{ x0: rectangle.x + rectangle.width, y0: rectangle.y, x1: rectangle.x + rectangle.width, y1: rectangle.y + rectangle.height }
];

const getIntersection = (ray: Segment, segment: Segment): Vector | undefined => {
	// Check if none of the lines are of length 0
	if ((ray.x0 === ray.x1 && ray.y0 === ray.y1) || (segment.x0 === segment.x1 && segment.y0 === segment.y1)) return;

	const denominator = (segment.y1 - segment.y0) * (ray.x1 - ray.x0) - (segment.x1 - segment.x0) * (ray.y1 - ray.y0);

	// Lines are parallel
	if (denominator === 0) return;

	const ua = ((segment.x1 - segment.x0) * (ray.y0 - segment.y0) - (segment.y1 - segment.y0) * (ray.x0 - segment.x0)) / denominator;
	const ub = ((ray.x1 - ray.x0) * (ray.y0 - segment.y0) - (ray.y1 - ray.y0) * (ray.x0 - segment.x0)) / denominator;

	// Check is along segment
	if (ub < 0 || ub > 1 || ua < 0) return;

	const intersection = {
		x: ray.x0 + ua * (ray.x1 - ray.x0),
		y: ray.y0 + ua * (ray.y1 - ray.y0)
	};

	return intersection;
};

const radialSort = (centre: Vector, pointA: Vector, pointB: Vector): number => {
	if (pointA.x - centre.x >= 0 && pointB.x - centre.x < 0) return 1;
	if (pointA.x - centre.x < 0 && pointB.x - centre.x >= 0) return -1;
	if (pointA.x - centre.x === 0 && pointB.x - centre.x === 0) {
		if (pointA.y - centre.y >= 0 || pointB.y - centre.y >= 0) return 1;
		return -1;
	}

	const det = (pointA.x - centre.x) * (pointB.y - centre.y) - (pointB.x - centre.x) * (pointA.y - centre.y);
	if (det < 0) return 1;
	if (det > 0) return -1;

	return 1;
};

export { shadowInit, shadowSystem };
