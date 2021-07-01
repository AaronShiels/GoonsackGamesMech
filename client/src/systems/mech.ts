import { boundAngle, hasValue, subtract, add, Vector } from "../utilities";
import { System } from ".";
import { multiply } from "../utilities";
import { Mech } from "../entities";
import { Game } from "../game";
import { ExplosionTiny } from "../entities";
import { CannonBullet } from "../entities/projectile";

const walkingForce = 200;
const maxTurnThreshold = Math.PI / 16;
const bodyTurnSpeed = 3;
const maxArmTurnSpeed = 8;
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

	applyAcceleration(mech, game.input.moveDirection);
	applyBodyRotation(mech, game.input.cursorPosition, deltaSeconds);
	applyArmRotations(mech, game.input.cursorPosition, deltaSeconds);
	applyCannon(game, mech, game.input.firing, deltaSeconds);

	mech.walk(deltaSeconds);
};

const applyAcceleration = (mech: Mech, direction: Vector): void => {
	const acceleration = multiply(direction, walkingForce);

	mech.acceleration.x = acceleration.x;
	mech.acceleration.y = acceleration.y;
};

const applyBodyRotation = (mech: Mech, targetPosition: Vector, deltaSeconds: number): void => {
	const targetVector = subtract(targetPosition, mech.position);
	if (!hasValue(targetVector)) return;

	const targetAngle = Math.atan2(targetVector.y, targetVector.x);
	const differenceAngle = boundAngle(targetAngle - mech.bodyDirection);
	const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, bodyTurnSpeed * deltaSeconds) : Math.max(differenceAngle, -bodyTurnSpeed * deltaSeconds);
	const newAngle = boundAngle(mech.bodyDirection + deltaAngle);

	mech.bodyDirection = newAngle;
};

const applyArmRotations = (mech: Mech, targetPosition: Vector, deltaSeconds: number): void => {
	const absoluteLeftArmPosition = add(mech.position, mech.leftArmPosition);
	const leftArmTargetVector = subtract(targetPosition, absoluteLeftArmPosition);
	if (hasValue(leftArmTargetVector)) {
		const targetAngle = Math.atan2(leftArmTargetVector.y, leftArmTargetVector.x);
		const differenceAngle = boundAngle(targetAngle - mech.leftArmDirection);
		const turnSpeed = Math.min(Math.abs(differenceAngle) / maxTurnThreshold, maxArmTurnSpeed);
		const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, turnSpeed * deltaSeconds) : Math.max(differenceAngle, -turnSpeed * deltaSeconds);
		const newAngle = boundAngle(mech.leftArmDirection + deltaAngle);

		mech.leftArmDirection = newAngle;
	}

	const absoluteRightArmPosition = add(mech.position, mech.rightArmPosition);
	const rightArmTargetVector = subtract(targetPosition, absoluteRightArmPosition);
	if (hasValue(rightArmTargetVector)) {
		const targetAngle = Math.atan2(rightArmTargetVector.y, rightArmTargetVector.x);
		const differenceAngle = boundAngle(targetAngle - mech.rightArmDirection);
		const turnSpeed = Math.min(Math.abs(differenceAngle) / maxTurnThreshold, maxArmTurnSpeed);
		const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, turnSpeed * deltaSeconds) : Math.max(differenceAngle, -turnSpeed * deltaSeconds);
		const newAngle = boundAngle(mech.rightArmDirection + deltaAngle);

		mech.rightArmDirection = newAngle;
	}
};

const applyCannon = (game: Game, mech: Mech, firing: boolean, deltaSeconds: number): void => {
	if (firing && mech.cannonRemainingReloadSeconds <= 0) {
		const leftArmAbsolutePosition = add(mech.position, mech.leftArmPosition);
		const leftArmDirectionUnitVector = { x: Math.cos(mech.leftArmDirection), y: Math.sin(mech.leftArmDirection) };
		const leftArmBarrelPosition = add(leftArmAbsolutePosition, multiply(leftArmDirectionUnitVector, armBarrelLength));
		const leftCannonBulletVelocity = multiply(leftArmDirectionUnitVector, cannonVelocity);

		const leftCannonBullet = new CannonBullet(leftArmBarrelPosition, leftCannonBulletVelocity, mech.leftArmDirection);
		game.stage.addChild(leftCannonBullet);
		const leftCannonFire = new ExplosionTiny(leftArmBarrelPosition);
		game.stage.addChild(leftCannonFire);

		const leftArmRecoilAngle = boundAngle(mech.leftArmDirection + maxAngularRecoil);
		mech.leftArmDirection = leftArmRecoilAngle;

		const rightArmAbsolutePosition = add(mech.position, mech.rightArmPosition);
		const rightArmDirectionUnitVector = { x: Math.cos(mech.rightArmDirection), y: Math.sin(mech.rightArmDirection) };
		const rightArmBarrelPosition = add(rightArmAbsolutePosition, multiply(rightArmDirectionUnitVector, armBarrelLength));
		const rightCannonBulletVelocity = multiply(rightArmDirectionUnitVector, cannonVelocity);

		const rightArmRecoilAngle = boundAngle(mech.rightArmDirection - maxAngularRecoil);
		mech.rightArmDirection = rightArmRecoilAngle;

		const rightCannonBullet = new CannonBullet(rightArmBarrelPosition, rightCannonBulletVelocity, mech.rightArmDirection);
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
