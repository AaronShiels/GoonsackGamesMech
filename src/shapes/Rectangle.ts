import { Vector } from ".";

interface Rectangle extends Vector {
	width: number;
	height: number;
}

const centre = (rectangle: Rectangle): Vector => ({ x: rectangle.x + rectangle.width / 2, y: rectangle.y + rectangle.height / 2 });
const intersects = (a: Rectangle, b: Rectangle): boolean => a.x < b.x + b.width && b.x <= a.x + a.width && a.y < b.y + b.height && b.y <= a.y + a.height;
const intersection = (a: Rectangle, b: Rectangle): Vector | undefined => {
	if (!intersects(a, b)) return;

	const centreA = centre(a);
	const centreB = centre(b);

	const x = centreA.x <= centreB.x ? a.x + a.width - b.x : a.x - (b.x + b.width);
	const y = centreA.y <= centreB.y ? a.y + a.height - b.y : a.y - (b.y + b.height);

	return { x, y };
};

export { Rectangle, centre, intersects, intersection };
