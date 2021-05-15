import { boundAngle, hasValue, subtract } from "../utilities";
import { System } from ".";
import { multiply } from "../utilities";
import { Mech } from "../entities";

const walkingForce = 200;
const turnSpeed = 3;

const mechSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	const mech = game.stage.children.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	// Apply state
	mech.acceleration = multiply(game.input.moveDirection, walkingForce);

	const targetVector = subtract(game.input.cursorPosition, mech.position);
	if (!hasValue(targetVector)) return;

	const targetAngle = Math.atan2(targetVector.y, targetVector.x);
	const differenceAngle = boundAngle(targetAngle - mech.direction);
	const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, turnSpeed * deltaSeconds) : Math.max(differenceAngle, -turnSpeed * deltaSeconds);
	mech.direction = boundAngle(mech.direction + deltaAngle);
};
export { mechSystem };
