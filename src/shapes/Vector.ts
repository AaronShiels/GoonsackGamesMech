interface Vector {
	x: number;
	y: number;
}

const add = (a: Vector, b: Vector): Vector => ({
	x: a.x + b.x,
	y: a.y + b.y
});
const subtract = (a: Vector, b: Vector): Vector => ({
	x: a.x - b.x,
	y: a.y - b.y
});
const multiply = (a: Vector, b: Vector | number): Vector => {
	if (typeof b === "number") b = { x: b, y: b };

	return {
		x: a.x * b.x,
		y: a.y * b.y
	};
};
const divide = (a: Vector, b: Vector | number): Vector => {
	if (typeof b === "number") b = { x: b, y: b };

	return {
		x: a.x / b.x,
		y: a.y / b.y
	};
};
const length = (vector: Vector): number => {
	if (!hasValue(vector)) throw new Error("Vector is empty.");
	return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
};
const normalise = (vector: Vector): Vector => {
	if (!hasValue(vector)) throw new Error("Vector is empty.");
	const vectorLength = length(vector);
	return divide(vector, vectorLength);
};
const cardinalise = (vector: Vector) => {
	const threshold = 0.01;
	if (!hasValue(vector)) throw new Error("Vector is empty.");
	const horizontalMagnitude = Math.abs(vector.x);
	const verticalMagnitude = Math.abs(vector.y);
	return horizontalMagnitude > verticalMagnitude - threshold ? { x: vector.x > 0 ? 1 : -1, y: 0 } : { x: 0, y: vector.y > 0 ? 1 : -1 };
};
const hasValue = (vector: Vector): boolean => vector.x !== 0 || vector.y !== 0;

export default Vector;
export { add, subtract, multiply, divide, length, normalise, cardinalise, hasValue };
