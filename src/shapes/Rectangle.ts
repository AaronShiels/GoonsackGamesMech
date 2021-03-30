import { Vector } from ".";

interface Rectangle extends Vector {
	width: number;
	height: number;
}

const centre = (rectangle: Rectangle): Vector => ({ x: rectangle.x + rectangle.width / 2, y: rectangle.y + rectangle.height / 2 });
const intersects = (rectangleA: Rectangle, rectangleB: Rectangle): boolean =>
	rectangleA.x < rectangleB.x + rectangleB.width &&
	rectangleB.x < rectangleA.x + rectangleA.width &&
	rectangleA.y < rectangleB.y + rectangleB.height &&
	rectangleB.y < rectangleA.y + rectangleA.height;
const intersection = (rectangleA: Rectangle, rectangleB: Rectangle): Vector | undefined => {
	if (!intersects(rectangleA, rectangleB)) return;

	const centreA = centre(rectangleA);
	const centreB = centre(rectangleB);

	const x = centreA.x <= centreB.x ? rectangleA.x + rectangleA.width - rectangleB.x : rectangleA.x - (rectangleB.x + rectangleB.width);
	const y = centreA.y <= centreB.y ? rectangleA.y + rectangleA.height - rectangleB.y : rectangleA.y - (rectangleB.y + rectangleB.height);

	return { x, y };
};
const liesWithin = (point: Vector, rectangle: Rectangle): boolean =>
	point.x > rectangle.x && point.x < rectangle.x + rectangle.width && point.y > rectangle.y && point.y < rectangle.y + rectangle.height;

export { Rectangle, centre, intersects, intersection, liesWithin };
