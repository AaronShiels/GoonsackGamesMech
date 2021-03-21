import Vector from "./Vector";

interface Rectangle extends Vector {
	width: number;
	height: number;
}

const intersects = (a: Rectangle, b: Rectangle): boolean => a.x < b.x + b.width && b.x <= a.x + a.width && a.y < b.y + b.height && b.y <= a.y + a.height;

export default Rectangle;
export { intersects };
