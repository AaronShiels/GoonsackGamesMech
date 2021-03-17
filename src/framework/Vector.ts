interface Vector {
	x: number;
	y: number;
}

const add = (base: Vector, delta: Vector): void => {
	base.x += delta.x;
	base.y += delta.y;
};
const subtract = (base: Vector, delta: Vector): void => {
	base.x -= delta.x;
	base.y -= delta.y;
};
const multiply = (base: Vector, delta: Vector): void => {
	base.x *= delta.x;
	base.y *= delta.y;
};
const divide = (base: Vector, delta: Vector): void => {
	base.x /= delta.x;
	base.y /= delta.y;
};
const length = (base: Vector): number => Math.sqrt(Math.pow(base.x, 2) + Math.pow(base.y, 2));

export default Vector;
export { add, subtract, multiply, divide, length };
