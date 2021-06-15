import { boundAngle, hasValue, subtract, length, add, normalise, dot, Vector } from "../utilities";
import { System } from ".";
import { multiply } from "../utilities";
import { Mech, MechArm, MechFoot } from "../entities";

const walkingForce = 200;
const maxTurnThreshold = Math.PI / 16;
const maxBodyTurnSpeed = 3;
const minBodyTurnSpeed = 0.25;
const maxArmTurnSpeed = 8;
const minArmTurnSpeed = 0.0;
const footMoveSpeed = 200;
const maxFootNormalDistance = 16;
const footTangentDistance = 12;
const armTangentDistance = 22;

const mechSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	const acceleration = multiply(game.input.moveDirection, walkingForce);

	mech.acceleration.x = acceleration.x;
	mech.acceleration.y = acceleration.y;

	updateBodyDirection(mech, game.input.cursorPosition, deltaSeconds);
	updateArmDirection(mech, mech.leftArm, game.input.cursorPosition, deltaSeconds);
	updateArmDirection(mech, mech.rightArm, game.input.cursorPosition, deltaSeconds);
	updateDesiredFeetPositions(mech, game.input.moveDirection);
	updateFootPosition(mech.leftFoot, deltaSeconds);
	updateFootPosition(mech.rightFoot, deltaSeconds);
};

const updateBodyDirection = (mech: Mech, targetPosition: Vector, deltaSeconds: number): void => {
	const targetVector = subtract(targetPosition, mech.position);
	if (!hasValue(targetVector)) return;

	const targetAngle = Math.atan2(targetVector.y, targetVector.x);
	const differenceAngle = boundAngle(targetAngle - mech.body.direction);
	const deltaAngle =
		differenceAngle > 0 ? Math.min(differenceAngle, maxBodyTurnSpeed * deltaSeconds) : Math.max(differenceAngle, -maxBodyTurnSpeed * deltaSeconds);
	const newAngle = boundAngle(mech.body.direction + deltaAngle);

	mech.body.direction = newAngle;

	updateArmPosition(mech.leftArm, newAngle, "left");
	updateArmPosition(mech.rightArm, newAngle, "right");
};

const updateArmDirection = (mech: Mech, arm: MechArm, targetPosition: Vector, deltaSeconds: number): void => {
	const absoluteArmPosition = add(mech.position, arm.position);
	const targetVector = subtract(targetPosition, absoluteArmPosition);
	const targetAngle = Math.atan2(targetVector.y, targetVector.x);
	const differenceAngle = boundAngle(targetAngle - arm.direction);
	const turnSpeed = Math.max(Math.min(Math.abs(differenceAngle) / maxTurnThreshold, maxArmTurnSpeed), minArmTurnSpeed);
	const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, turnSpeed * deltaSeconds) : Math.max(differenceAngle, -turnSpeed * deltaSeconds);
	const newAngle = boundAngle(arm.direction + deltaAngle);

	arm.direction = newAngle;
};

const updateArmPosition = (arm: MechArm, bodyDirection: number, side: "left" | "right"): void => {
	const bodyDirectionNormal = { x: Math.cos(bodyDirection), y: Math.sin(bodyDirection) };
	const tangentDirection = side == "left" ? 1 : -1;
	const tangentOffset = multiply({ x: bodyDirectionNormal.y * tangentDirection, y: bodyDirectionNormal.x * -tangentDirection }, armTangentDistance);

	arm.position.x = tangentOffset.x;
	arm.position.y = tangentOffset.y;
};

const updateDesiredFeetPositions = (mech: Mech, moveDirection: Vector): void => {
	if (hasValue(moveDirection)) {
		const leftFootCentreScalarOffset = calculateFootCentreScalarOffset(mech, mech.leftFoot, moveDirection);
		const rightFootCentreScalarOffset = calculateFootCentreScalarOffset(mech, mech.rightFoot, moveDirection);

		if (leftFootCentreScalarOffset < 0 && rightFootCentreScalarOffset < 0)
			if (rightFootCentreScalarOffset > leftFootCentreScalarOffset) {
				const desiredAbsolutePosition = calculateDesiredFootPosition(mech, moveDirection, "left");
				const direction = Math.atan2(moveDirection.y, moveDirection.x);

				mech.leftFoot.desiredAbsolutePosition.x = desiredAbsolutePosition.x;
				mech.leftFoot.desiredAbsolutePosition.y = desiredAbsolutePosition.y;
				mech.leftFoot.direction = direction;
			} else {
				const desiredAbsolutePosition = calculateDesiredFootPosition(mech, moveDirection, "right");
				const direction = Math.atan2(moveDirection.y, moveDirection.x);

				mech.rightFoot.desiredAbsolutePosition.x = desiredAbsolutePosition.x;
				mech.rightFoot.desiredAbsolutePosition.y = desiredAbsolutePosition.y;
				mech.rightFoot.direction = direction;
			}

		if (Math.abs(leftFootCentreScalarOffset) > maxFootNormalDistance) {
			const desiredAbsolutePosition = calculateDesiredFootPosition(mech, moveDirection, "left");
			const direction = Math.atan2(moveDirection.y, moveDirection.x);

			mech.leftFoot.desiredAbsolutePosition.x = desiredAbsolutePosition.x;
			mech.leftFoot.desiredAbsolutePosition.y = desiredAbsolutePosition.y;
			mech.leftFoot.direction = direction;
		}

		if (Math.abs(rightFootCentreScalarOffset) > maxFootNormalDistance) {
			const desiredAbsolutePosition = calculateDesiredFootPosition(mech, moveDirection, "right");
			const direction = Math.atan2(moveDirection.y, moveDirection.x);

			mech.rightFoot.desiredAbsolutePosition.x = desiredAbsolutePosition.x;
			mech.rightFoot.desiredAbsolutePosition.y = desiredAbsolutePosition.y;
			mech.rightFoot.direction = direction;
		}
	}
};

const calculateFootCentreScalarOffset = (mech: Mech, foot: MechFoot, moveDirection: Vector): number => {
	const footCentreOffset = subtract(foot.desiredAbsolutePosition, mech.position);
	const footCentreScalarOffset = dot(footCentreOffset, moveDirection);

	return footCentreScalarOffset;
};

const calculateDesiredFootPosition = (mech: Mech, moveDirection: Vector, side: "left" | "right"): Vector => {
	const forwardFootPosition = add(mech.position, multiply(moveDirection, maxFootNormalDistance));
	const tangentDirection = side == "left" ? 1 : -1;
	const tangentOffset = multiply({ x: moveDirection.y * tangentDirection, y: moveDirection.x * -tangentDirection }, footTangentDistance);
	const adjustedForwardFootPosition = add(forwardFootPosition, tangentOffset);

	return adjustedForwardFootPosition;
};

const updateFootPosition = (foot: MechFoot, deltaSeconds: number): void => {
	const desiredPositionOffset = subtract(foot.desiredAbsolutePosition, foot.absolutePosition);
	const deltaDistance = footMoveSpeed * deltaSeconds;

	if (hasValue(desiredPositionOffset))
		if (length(desiredPositionOffset) > deltaDistance) {
			const deltaAbsolutePosition = multiply(normalise(desiredPositionOffset), deltaDistance);

			foot.absolutePosition.x += deltaAbsolutePosition.x;
			foot.absolutePosition.y += deltaAbsolutePosition.y;
		} else {
			foot.absolutePosition.x = foot.desiredAbsolutePosition.x;
			foot.absolutePosition.y = foot.desiredAbsolutePosition.y;
		}
};

export { mechSystem };
