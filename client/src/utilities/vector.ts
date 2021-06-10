interface Vector {
	x: number;
	y: number;
}

const add = (vectorA: Vector, vectorB: Vector): Vector => ({
	x: vectorA.x + vectorB.x,
	y: vectorA.y + vectorB.y
});
const subtract = (vectorA: Vector, vectorB: Vector): Vector => ({
	x: vectorA.x - vectorB.x,
	y: vectorA.y - vectorB.y
});
const multiply = (vectorA: Vector, vectorBOrScalar: Vector | number): Vector => {
	if (typeof vectorBOrScalar === "number") vectorBOrScalar = { x: vectorBOrScalar, y: vectorBOrScalar };

	return {
		x: vectorA.x * vectorBOrScalar.x,
		y: vectorA.y * vectorBOrScalar.y
	};
};
const divide = (vectorA: Vector, vectorBOrScalar: Vector | number): Vector => {
	if (typeof vectorBOrScalar === "number") vectorBOrScalar = { x: vectorBOrScalar, y: vectorBOrScalar };

	return {
		x: vectorA.x / vectorBOrScalar.x,
		y: vectorA.y / vectorBOrScalar.y
	};
};
const length = (vector: Vector): number => {
	if (!hasValue(vector)) throw new Error("Vector is empty.");
	return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
};
const dot = (vectorA: Vector, vectorB: Vector): number => vectorA.x * vectorB.x + vectorA.y * vectorB.y;
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
const round = (vector: Vector): Vector => ({ x: vector.x, y: vector.y });

export { Vector, add, subtract, multiply, divide, length, dot, normalise, cardinalise, hasValue, round };
