import { Bounds, Graphics } from "pixi.js";
import { System } from ".";
import { getBounds, hasBody } from "../components";
import { Entity, Mech } from "../entities";
import { add, subtract, Rectangle, Vector } from "../utilities";

const accuracyDelta: number = 2.1;

const graphics = new Graphics();
let attached = false;

const shadowSystem: System = (game) => {
	if (!attached) {
		game.stage.addChild(graphics);
		attached = true;
	}

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	const cameraBounds: Rectangle = {
		x: game.camera.x - game.camera.width / 2,
		y: game.camera.y - game.camera.height / 2,
		width: game.camera.width,
		height: game.camera.height
	};
	const rectangles = getRectangles(game.entities, cameraBounds);
	const testVertices = generateTestVertices(rectangles);
	const segments = getSegments(rectangles, cameraBounds);
	const lightPoints = getLightPoints(testVertices, segments, mech.position);

	console.log(`Rectangles: ${rectangles.length}, Test Vertices: ${testVertices.length}, Light Points: ${lightPoints.length}`);

	graphics.clear();
	graphics.beginFill(0x0000ff);
	for (const point of testVertices) {
		graphics.drawRect(point.x, point.y, 1, 1);
	}
	graphics.endFill();

	graphics.lineStyle(1, 0xff0000);
	for (const point of lightPoints) {
		graphics.moveTo(mech.position.x, mech.position.y);
		graphics.lineTo(point.x, point.y);
	}
};

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
			if (!intersection || !intersection.onLine2) continue;

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

interface Intersection extends Vector {
	onLine1: boolean;
	onLine2: boolean;
}

const toSegments = (rectangle: Rectangle): Segment[] => [
	{ x0: rectangle.x, y0: rectangle.y, x1: rectangle.x + rectangle.width, y1: rectangle.y },
	{ x0: rectangle.x, y0: rectangle.y, x1: rectangle.x, y1: rectangle.y + rectangle.height },
	{ x0: rectangle.x, y0: rectangle.y + rectangle.height, x1: rectangle.x + rectangle.width, y1: rectangle.y + rectangle.height },
	{ x0: rectangle.x + rectangle.width, y0: rectangle.y, x1: rectangle.x + rectangle.width, y1: rectangle.y + rectangle.height }
];

const getIntersection = (line1: Segment, line2: Segment): Intersection | undefined => {
	// if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
	const denominator = (line2.y1 - line2.y0) * (line1.x1 - line1.x0) - (line2.x1 - line2.x0) * (line1.y1 - line1.y0);
	if (!denominator) return;

	const startDiffY = line1.y0 - line2.y0;
	const startDiffX = line1.x0 - line2.x0;
	const numerator1 = (line2.x1 - line2.x0) * startDiffY - (line2.y1 - line2.y0) * startDiffX;
	const numerator2 = (line1.x1 - line1.x0) * startDiffY - (line1.y1 - line1.y0) * startDiffX;
	const a = numerator1 / denominator;
	const b = numerator2 / denominator;

	// if we cast these lines infinitely in both directions, they intersect here:
	const result = {
		x: line1.x0 + a * (line1.x1 - line1.x0),
		y: line1.y0 + a * (line1.y1 - line1.y0),
		onLine1: false,
		onLine2: false
	};

	// if line1 is a segment and line2 is infinite, they intersect if:
	if (a > 0 && a < 1) result.onLine1 = true;

	// if line2 is a segment and line1 is infinite, they intersect if:
	if (b > 0 && b < 1) result.onLine2 = true;

	// if line1 and line2 are segments, they intersect if both of the above are true
	return result;
};

export { shadowSystem };
