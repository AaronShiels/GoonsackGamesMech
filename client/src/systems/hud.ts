import { System } from ".";
import { Mech } from "../entities";
import { add, multiply, Side, subtract, Vector, length, ReticleHemisphere, ReticlePointer } from "../utilities";

let reticleLeft: ReticleHemisphere | undefined;
let reticleRight: ReticleHemisphere | undefined;
let reticleCentre: ReticlePointer | undefined;

const hudSystem: System = (game) => {
	if (!reticleLeft) {
		reticleLeft = new ReticleHemisphere(Side.Left, game.input.cursorPosition);
		game.stage.addChild(reticleLeft);
	}
	if (!reticleRight) {
		reticleRight = new ReticleHemisphere(Side.Right, game.input.cursorPosition);
		game.stage.addChild(reticleRight);
	}
	if (!reticleCentre) {
		reticleCentre = new ReticlePointer(game.input.cursorPosition);
		game.stage.addChild(reticleCentre);
	}

	reticleCentre.position.set(game.input.cursorPosition.x, game.input.cursorPosition.y);

	if (!game.state.active()) return;

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	const leftArmPosition = add(mech.leftArm.position, mech.position);
	const leftReticlePosition = getReticlePosition(leftArmPosition, mech.leftArm.direction, game.input.cursorPosition);
	reticleLeft.position.set(leftReticlePosition.x, leftReticlePosition.y);

	const rightArmPosition = add(mech.rightArm.position, mech.position);
	const rightReticlePosition = getReticlePosition(rightArmPosition, mech.rightArm.direction, game.input.cursorPosition);
	reticleRight.position.set(rightReticlePosition.x, rightReticlePosition.y);
};

const getReticlePosition = (armPosition: Vector, armDirection: number, cursorPosition: Vector): Vector => {
	const directionUnitVector = { x: Math.cos(armDirection), y: Math.sin(armDirection) };
	const armToCursorVector = subtract(cursorPosition, armPosition);
	const projection = length(armToCursorVector);
	const closestPoint = add(multiply(directionUnitVector, projection), armPosition);

	return closestPoint;
};

export { hudSystem };
