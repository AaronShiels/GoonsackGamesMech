import { boundAngle, hasValue, subtract, length, add, normalise, dot, Vector } from "../utilities";
import { System } from ".";
import { multiply } from "../utilities";
import { Mech, MechFoot } from "../entities";

const walkingForce = 200;
const turnSpeed = 3;
const footSpeed = 200;
const maxFootNormalDistance = 15;
const footTangentDistance = 10;

const mechSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	mech.acceleration = multiply(game.input.moveDirection, walkingForce);

	applyBodyRotation(mech, game.input.cursorLocation, deltaSeconds);

	updateDesiredFeetLocations(mech, game.input.moveDirection);
	applyFeetMovement(mech, deltaSeconds);
};

const applyBodyRotation = (mech: Mech, targetLocation: Vector, deltaSeconds: number): void => {
	const targetVector = subtract(targetLocation, mech.location);
	if (hasValue(targetVector)) {
		const targetAngle = Math.atan2(targetVector.y, targetVector.x);
		const differenceAngle = boundAngle(targetAngle - mech.body.direction);
		const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, turnSpeed * deltaSeconds) : Math.max(differenceAngle, -turnSpeed * deltaSeconds);
		mech.body.direction = boundAngle(mech.body.direction + deltaAngle);
	}
};

const updateDesiredFeetLocations = (mech: Mech, moveDirection: Vector): void => {
	if (hasValue(moveDirection)) {
		const leftFootCentreScalarOffset = calculateFootCentreScalarOffset(mech, mech.leftFoot, moveDirection);
		const rightFootCentreScalarOffset = calculateFootCentreScalarOffset(mech, mech.rightFoot, moveDirection);

		if (leftFootCentreScalarOffset < 0 && rightFootCentreScalarOffset < 0)
			if (rightFootCentreScalarOffset > leftFootCentreScalarOffset) {
				mech.leftFoot.desiredLocation = calculateDesiredFootLocation(mech, moveDirection, "left");
				mech.leftFoot.direction = Math.atan2(moveDirection.y, moveDirection.x);
			} else {
				mech.rightFoot.desiredLocation = calculateDesiredFootLocation(mech, moveDirection, "right");
				mech.rightFoot.direction = Math.atan2(moveDirection.y, moveDirection.x);
			}

		if (Math.abs(leftFootCentreScalarOffset) > maxFootNormalDistance) {
			mech.leftFoot.desiredLocation = calculateDesiredFootLocation(mech, moveDirection, "left");
			mech.leftFoot.direction = Math.atan2(moveDirection.y, moveDirection.x);
		}

		if (Math.abs(rightFootCentreScalarOffset) > maxFootNormalDistance) {
			mech.rightFoot.desiredLocation = calculateDesiredFootLocation(mech, moveDirection, "right");
			mech.rightFoot.direction = Math.atan2(moveDirection.y, moveDirection.x);
		}
	}
};

const calculateFootCentreScalarOffset = (mech: Mech, foot: MechFoot, moveDirection: Vector): number => {
	const footCentreOffset = subtract(foot.desiredLocation, mech.location);
	const footCentreScalarOffset = dot(footCentreOffset, moveDirection);
	return footCentreScalarOffset;
};

const calculateDesiredFootLocation = (mech: Mech, moveDirection: Vector, leftOrRight: "left" | "right"): Vector => {
	const forwardFootLocation = add(mech.location, multiply(moveDirection, maxFootNormalDistance));
	const tangentDirection = leftOrRight == "left" ? 1 : -1;
	const tangentOffset = multiply({ x: moveDirection.y * tangentDirection, y: moveDirection.x * -tangentDirection }, footTangentDistance);
	const adjustedForwardFootLocation = add(forwardFootLocation, tangentOffset);
	return adjustedForwardFootLocation;
};

const applyFeetMovement = (mech: Mech, deltaSeconds: number): void => {
	const maxDeltaDistance = footSpeed * deltaSeconds;
	applyFootMovement(mech.leftFoot, maxDeltaDistance);
	applyFootMovement(mech.rightFoot, maxDeltaDistance);
};

const applyFootMovement = (foot: MechFoot, maxDeltaDistance: number): void => {
	const desiredFootLocationOffset = subtract(foot.desiredLocation, foot.location);
	if (hasValue(desiredFootLocationOffset))
		if (length(desiredFootLocationOffset) > maxDeltaDistance)
			foot.location = add(foot.location, multiply(normalise(desiredFootLocationOffset), maxDeltaDistance));
		else foot.location = foot.desiredLocation;
};

export { mechSystem };
