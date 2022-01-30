import { centre, Rectangle } from "./rectangle.js";
import { subtract, Vector } from "./vector.js";

interface Circle extends Vector {
	radius: number;
}

interface Sector extends Circle {
	minimumAngle: number;
	maximumAngle: number;
}

const circleRectangleIntersects = (circle: Circle, rectangle: Rectangle): boolean => {
	const rectangleCentre = centre(rectangle);
	const centreDistanceX = Math.abs(circle.x - rectangleCentre.x);
	const centreDistanceY = Math.abs(circle.y - rectangleCentre.y);

	const isDefinitelyOutside = centreDistanceX > rectangle.width / 2 + circle.radius || centreDistanceY > rectangle.height / 2 + circle.radius;
	if (isDefinitelyOutside) return false;

	const isDefinitelyInside = centreDistanceX <= rectangle.width / 2 || centreDistanceY <= rectangle.height / 2;
	if (isDefinitelyInside) return true;

	const cornerDistanceSquared = Math.pow(centreDistanceX - rectangle.width / 2, 2) + Math.pow(centreDistanceY - rectangle.height / 2, 2);
	return cornerDistanceSquared <= Math.pow(circle.radius, 2);
};

const sectorRectangeIntersects = (sector: Sector, rectangle: Rectangle): boolean => {
	const rectangleCentre = centre(rectangle);
	const centreDistanceX = Math.abs(sector.x - rectangleCentre.x);
	const centreDistanceY = Math.abs(sector.y - rectangleCentre.y);

	const isDefinitelyOutside = centreDistanceX > rectangle.width / 2 + sector.radius || centreDistanceY > rectangle.height / 2 + sector.radius;
	if (isDefinitelyOutside) return false;

	// TODO this approach sucks
	const rectangleCorners = [
		{ x: rectangle.x, y: rectangle.y },
		{ x: rectangle.x + rectangle.width, y: rectangle.y },
		{ x: rectangle.x, y: rectangle.y + rectangle.height },
		{ x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height }
	];
	const rectangleCornersInsideAngle = rectangleCorners
		.map((corner) => {
			const vector = subtract(corner, sector);
			return (Math.atan2(vector.y, vector.x) + 2 * Math.PI) % (2 * Math.PI);
		})
		.filter((rad) =>
			sector.maximumAngle >= sector.minimumAngle
				? rad >= sector.minimumAngle && rad <= sector.maximumAngle
				: rad <= sector.minimumAngle || rad > sector.maximumAngle
		);

	return !!rectangleCornersInsideAngle.length;
};

export { Circle, Sector, circleRectangleIntersects, sectorRectangeIntersects };
