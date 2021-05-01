const boundAngle = (angle: number, minimum: number = -Math.PI, maximum: number = Math.PI): number => {
	if (angle < minimum) return angle + (maximum - minimum);
	else if (angle >= maximum) return angle - (maximum - minimum);
	else return angle;
};

const toDegrees = (angle: number): number => (angle * 180) / Math.PI;

export { boundAngle, toDegrees };
