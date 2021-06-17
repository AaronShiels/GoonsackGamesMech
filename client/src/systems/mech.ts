import { boundAngle, hasValue, subtract, length, add, normalise, dot, Vector } from "../utilities";
import { System } from ".";
import { multiply } from "../utilities";
import { Mech, MechArm, MechFoot } from "../entities";
import { Game } from "../game";
import { ExplosionTiny } from "../entities";
import { CannonBullet } from "../entities/projectile";

const walkingForce = 200;
const maxTurnThreshold = Math.PI / 16;
const bodyTurnSpeed = 3;
const maxArmTurnSpeed = 8;
const footMoveSpeed = 200;
const maxFootNormalDistance = 16;
const footTangentDistance = 12;
const armTangentDistance = 22;
const armBarrelLength = 16;
const cannonReloadSeconds = 0.5;
const cannonVelocity = 1000;
const maxAngularRecoil = Math.PI / 32;
const maxNormalRecoil = 6;
const maxArmNormalSpeed = 12;

const mechSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	applyMovement(mech, game.input.moveDirection);
	applyRotation(mech, game.input.cursorPosition, deltaSeconds);
	applyMechanics(mech, game.input.moveDirection, deltaSeconds);
	applyCannon(game, mech, game.input.firing, deltaSeconds);
};

const applyMovement = (mech: Mech, direction: Vector): void => {
	const acceleration = multiply(direction, walkingForce);

	mech.acceleration.x = acceleration.x;
	mech.acceleration.y = acceleration.y;
};

const applyRotation = (mech: Mech, focalPoint: Vector, deltaSeconds: number): void => {
	updateBodyDirection(mech, focalPoint, deltaSeconds);
	updateArmPosition(mech, mech.leftArm, "left");
	updateArmPosition(mech, mech.rightArm, "right");
	updateArmDirection(mech, mech.leftArm, focalPoint, deltaSeconds);
	updateArmDirection(mech, mech.rightArm, focalPoint, deltaSeconds);
};

const applyMechanics = (mech: Mech, direction: Vector, deltaSeconds: number): void => {
	updateDesiredFeetPositions(mech, direction);
	updateFootPosition(mech.leftFoot, deltaSeconds);
	updateFootPosition(mech.rightFoot, deltaSeconds);
};

const updateBodyDirection = (mech: Mech, targetPosition: Vector, deltaSeconds: number): void => {
	const targetVector = subtract(targetPosition, mech.position);
	if (!hasValue(targetVector)) return;

	const targetAngle = Math.atan2(targetVector.y, targetVector.x);
	const differenceAngle = boundAngle(targetAngle - mech.body.direction);
	const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, bodyTurnSpeed * deltaSeconds) : Math.max(differenceAngle, -bodyTurnSpeed * deltaSeconds);
	const newAngle = boundAngle(mech.body.direction + deltaAngle);

	mech.body.direction = newAngle;
};

const updateArmDirection = (mech: Mech, arm: MechArm, targetPosition: Vector, deltaSeconds: number): void => {
	const absoluteArmPosition = add(mech.position, arm.position);
	const targetVector = subtract(targetPosition, absoluteArmPosition);
	const targetAngle = Math.atan2(targetVector.y, targetVector.x);
	const differenceAngle = boundAngle(targetAngle - arm.direction);
	const turnSpeed = Math.min(Math.abs(differenceAngle) / maxTurnThreshold, maxArmTurnSpeed);
	const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, turnSpeed * deltaSeconds) : Math.max(differenceAngle, -turnSpeed * deltaSeconds);
	const newAngle = boundAngle(arm.direction + deltaAngle);

	arm.direction = newAngle;
};

const updateArmPosition = (mech: Mech, arm: MechArm, side: "left" | "right"): void => {
	const bodyDirectionNormal = { x: Math.cos(mech.body.direction), y: Math.sin(mech.body.direction) };
	const tangentDirection = side == "left" ? 1 : -1;
	const normalOffset = multiply({ x: bodyDirectionNormal.x, y: bodyDirectionNormal.y }, -mech.cannonRecoil);
	const tangentOffset = multiply({ x: bodyDirectionNormal.y * tangentDirection, y: bodyDirectionNormal.x * -tangentDirection }, armTangentDistance);
	const combinedOffset = add(normalOffset, tangentOffset);

	arm.position.x = combinedOffset.x;
	arm.position.y = combinedOffset.y;
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

const applyCannon = (game: Game, mech: Mech, firing: boolean, deltaSeconds: number): void => {
	if (firing && mech.cannonRemainingReloadSeconds <= 0) {
		const leftArmAbsolutePosition = add(mech.position, mech.leftArm.position);
		const leftArmDirectionUnitVector = { x: Math.cos(mech.leftArm.direction), y: Math.sin(mech.leftArm.direction) };
		const leftArmBarrelPosition = add(leftArmAbsolutePosition, multiply(leftArmDirectionUnitVector, armBarrelLength));
		const leftCannonBulletVelocity = multiply(leftArmDirectionUnitVector, cannonVelocity);

		const leftCannonBullet = new CannonBullet(leftArmBarrelPosition, leftCannonBulletVelocity, mech.leftArm.direction);
		game.stage.addChild(leftCannonBullet);
		const leftCannonFire = new ExplosionTiny(leftArmBarrelPosition);
		game.stage.addChild(leftCannonFire);

		const leftArmRecoilAngle = boundAngle(mech.leftArm.direction + maxAngularRecoil);
		mech.leftArm.direction = leftArmRecoilAngle;

		const rightArmAbsolutePosition = add(mech.position, mech.rightArm.position);
		const rightArmDirectionUnitVector = { x: Math.cos(mech.rightArm.direction), y: Math.sin(mech.rightArm.direction) };
		const rightArmBarrelPosition = add(rightArmAbsolutePosition, multiply(rightArmDirectionUnitVector, armBarrelLength));
		const rightCannonBulletVelocity = multiply(rightArmDirectionUnitVector, cannonVelocity);

		const rightArmRecoilAngle = boundAngle(mech.rightArm.direction - maxAngularRecoil);
		mech.rightArm.direction = rightArmRecoilAngle;

		const rightCannonBullet = new CannonBullet(rightArmBarrelPosition, rightCannonBulletVelocity, mech.rightArm.direction);
		game.stage.addChild(rightCannonBullet);
		const rightCannonFire = new ExplosionTiny(rightArmBarrelPosition);
		game.stage.addChild(rightCannonFire);

		mech.cannonRemainingReloadSeconds = cannonReloadSeconds;
		mech.cannonRecoil = maxNormalRecoil;
	} else if (mech.cannonRemainingReloadSeconds > 0) mech.cannonRemainingReloadSeconds -= deltaSeconds;

	if (mech.cannonRecoil > 0) {
		const deltaCannonRecoil = maxArmNormalSpeed * deltaSeconds;
		mech.cannonRecoil = deltaCannonRecoil > mech.cannonRecoil ? 0 : mech.cannonRecoil - deltaCannonRecoil;
	}
};

export { mechSystem };
