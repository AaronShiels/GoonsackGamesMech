import { boundAngle, hasValue, subtract, length, add, normalise, dot, Vector } from "../utilities";
import { System } from ".";
import { multiply } from "../utilities";
import { Mech, MechArm, MechFoot } from "../entities";

const walkingForce = 200;
const bodyTurnSpeed = 3;
const armTurnSpeed = 4;
const footMoveSpeed = 200;
const maxFootNormalDistance = 16;
const footTangentDistance = 12;
const armTangentDistance = 22;

const mechSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	mech.acceleration = multiply(game.input.moveDirection, walkingForce);

	updateBodyDirection(mech, game.input.cursorLocation, deltaSeconds);
	updateArmDirections(mech, game.input.cursorLocation, deltaSeconds);
	updateDesiredFeetLocations(mech, game.input.moveDirection);
	updateFeetLocation(mech, deltaSeconds);
};

const updateBodyDirection = (mech: Mech, targetLocation: Vector, deltaSeconds: number): void => {
	const targetVector = subtract(targetLocation, mech.location);
	if (!hasValue(targetVector)) return;

	const targetAngle = Math.atan2(targetVector.y, targetVector.x);
	const differenceAngle = boundAngle(targetAngle - mech.body.direction);
	const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, bodyTurnSpeed * deltaSeconds) : Math.max(differenceAngle, -bodyTurnSpeed * deltaSeconds);
	const newAngle = boundAngle(mech.body.direction + deltaAngle);
	mech.body.direction = newAngle;

	updateArmLocation(mech.leftArm, newAngle, "left");
	updateArmLocation(mech.rightArm, newAngle, "right");
};

const updateArmDirections = (mech: Mech, targetLocation: Vector, deltaSeconds: number): void => {
	updateArmDirection(mech, mech.leftArm, targetLocation, deltaSeconds);
	updateArmDirection(mech, mech.rightArm, targetLocation, deltaSeconds);
};

const updateArmDirection = (mech: Mech, arm: MechArm, targetLocation: Vector, deltaSeconds: number): void => {
	const absoluteArmLocation = add(mech.location, arm.location);
	const targetVector = subtract(targetLocation, absoluteArmLocation);
	const targetAngle = Math.atan2(targetVector.y, targetVector.x);
	const differenceAngle = boundAngle(targetAngle - arm.direction);
	const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, armTurnSpeed * deltaSeconds) : Math.max(differenceAngle, -armTurnSpeed * deltaSeconds);
	const newAngle = boundAngle(arm.direction + deltaAngle);
	arm.direction = newAngle;
};

const updateArmLocation = (arm: MechArm, bodyDirection: number, side: "left" | "right"): void => {
	const bodyDirectionNormal = { x: Math.cos(bodyDirection), y: Math.sin(bodyDirection) };
	const tangentDirection = side == "left" ? 1 : -1;
	const tangentOffset = multiply({ x: bodyDirectionNormal.y * tangentDirection, y: bodyDirectionNormal.x * -tangentDirection }, armTangentDistance);
	arm.location = tangentOffset;
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

const calculateDesiredFootLocation = (mech: Mech, moveDirection: Vector, side: "left" | "right"): Vector => {
	const forwardFootLocation = add(mech.location, multiply(moveDirection, maxFootNormalDistance));
	const tangentDirection = side == "left" ? 1 : -1;
	const tangentOffset = multiply({ x: moveDirection.y * tangentDirection, y: moveDirection.x * -tangentDirection }, footTangentDistance);
	const adjustedForwardFootLocation = add(forwardFootLocation, tangentOffset);
	return adjustedForwardFootLocation;
};

const updateFeetLocation = (mech: Mech, deltaSeconds: number): void => {
	const maxDeltaDistance = footMoveSpeed * deltaSeconds;
	updateFootLocation(mech.leftFoot, maxDeltaDistance);
	updateFootLocation(mech.rightFoot, maxDeltaDistance);
};

const updateFootLocation = (foot: MechFoot, maxDeltaDistance: number): void => {
	const desiredFootLocationOffset = subtract(foot.desiredLocation, foot.location);
	if (hasValue(desiredFootLocationOffset))
		if (length(desiredFootLocationOffset) > maxDeltaDistance)
			foot.location = add(foot.location, multiply(normalise(desiredFootLocationOffset), maxDeltaDistance));
		else foot.location = foot.desiredLocation;
};

export { mechSystem };
