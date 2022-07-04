import { boundAngle } from "../utilities/angles.js";
import { add, hasValue, multiply, subtract, Vector } from "../utilities/vector.js";
import { ExplosionTiny } from "../entities/explosion.js";
import { Mech } from "../entities/mech.js";
import { CannonBullet } from "../entities/projectile.js";
import { Game } from "../game.js";
import { System } from "./system.js";

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
	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	const worldCursorPosition = subtract(game.input.cursorPosition, game.world.position);

	applyAcceleration(game, mech);
	applyBodyRotation(mech, worldCursorPosition, deltaSeconds);
	applyArmRotations(mech, worldCursorPosition, deltaSeconds);
	applyCannon(game, mech, game.input.firing, deltaSeconds);

	mech.walk(deltaSeconds);
};

const applyAcceleration = (game: Game, mech: Mech): void => {
	const acceleration = multiply(game.input.moveDirection, walkingForce);

	mech.acceleration.x = acceleration.x;
	mech.acceleration.y = acceleration.y;
};

const applyBodyRotation = (mech: Mech, targetPosition: Vector, deltaSeconds: number): void => {
	const targetVector = subtract(targetPosition, mech.position);
	if (!hasValue(targetVector)) return;

	const targetAngle = Math.atan2(targetVector.y, targetVector.x);
	const differenceAngle = boundAngle(targetAngle - mech.torso.direction);
	const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, bodyTurnSpeed * deltaSeconds) : Math.max(differenceAngle, -bodyTurnSpeed * deltaSeconds);
	const newAngle = boundAngle(mech.torso.direction + deltaAngle);

	mech.torso.direction = newAngle;
};

const applyArmRotations = (mech: Mech, targetPosition: Vector, deltaSeconds: number): void => {
	const absoluteLeftArmPosition = add(mech.position, mech.leftArm.position);
	const leftArmTargetVector = subtract(targetPosition, absoluteLeftArmPosition);
	if (hasValue(leftArmTargetVector)) {
		const targetAngle = Math.atan2(leftArmTargetVector.y, leftArmTargetVector.x);
		const differenceAngle = boundAngle(targetAngle - mech.leftArm.direction);
		const turnSpeed = Math.min(Math.abs(differenceAngle) / maxTurnThreshold, maxArmTurnSpeed);
		const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, turnSpeed * deltaSeconds) : Math.max(differenceAngle, -turnSpeed * deltaSeconds);
		const newAngle = boundAngle(mech.leftArm.direction + deltaAngle);

		mech.leftArm.direction = newAngle;
	}

	const absoluteRightArmPosition = add(mech.position, mech.rightArm.position);
	const rightArmTargetVector = subtract(targetPosition, absoluteRightArmPosition);
	if (hasValue(rightArmTargetVector)) {
		const targetAngle = Math.atan2(rightArmTargetVector.y, rightArmTargetVector.x);
		const differenceAngle = boundAngle(targetAngle - mech.rightArm.direction);
		const turnSpeed = Math.min(Math.abs(differenceAngle) / maxTurnThreshold, maxArmTurnSpeed);
		const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, turnSpeed * deltaSeconds) : Math.max(differenceAngle, -turnSpeed * deltaSeconds);
		const newAngle = boundAngle(mech.rightArm.direction + deltaAngle);

		mech.rightArm.direction = newAngle;
	}
};

const applyCannon = (game: Game, mech: Mech, firing: boolean, deltaSeconds: number): void => {
	if (firing && mech.cannonRemainingReloadSeconds <= 0) {
		const leftArmAbsolutePosition = add(mech.position, mech.leftArm.position);
		const leftArmDirectionUnitVector = { x: Math.cos(mech.leftArm.direction), y: Math.sin(mech.leftArm.direction) };
		const leftArmBarrelPosition = add(leftArmAbsolutePosition, multiply(leftArmDirectionUnitVector, armBarrelLength));
		const leftCannonBulletVelocity = multiply(leftArmDirectionUnitVector, cannonVelocity);

		const leftCannonBullet = new CannonBullet(leftArmBarrelPosition, leftCannonBulletVelocity, mech.leftArm.direction);
		game.world.addChild(leftCannonBullet);
		const leftCannonFire = new ExplosionTiny(leftArmBarrelPosition);
		game.world.addChild(leftCannonFire);

		const leftArmRecoilAngle = boundAngle(mech.leftArm.direction + maxAngularRecoil);
		mech.leftArm.direction = leftArmRecoilAngle;

		const rightArmAbsolutePosition = add(mech.position, mech.rightArm.position);
		const rightArmDirectionUnitVector = { x: Math.cos(mech.rightArm.direction), y: Math.sin(mech.rightArm.direction) };
		const rightArmBarrelPosition = add(rightArmAbsolutePosition, multiply(rightArmDirectionUnitVector, armBarrelLength));
		const rightCannonBulletVelocity = multiply(rightArmDirectionUnitVector, cannonVelocity);

		const rightArmRecoilAngle = boundAngle(mech.rightArm.direction - maxAngularRecoil);
		mech.rightArm.direction = rightArmRecoilAngle;

		const rightCannonBullet = new CannonBullet(rightArmBarrelPosition, rightCannonBulletVelocity, mech.rightArm.direction);
		game.world.addChild(rightCannonBullet);
		const rightCannonFire = new ExplosionTiny(rightArmBarrelPosition);
		game.world.addChild(rightCannonFire);

		mech.cannonRemainingReloadSeconds = cannonReloadSeconds;
		mech.cannonRecoil = maxNormalRecoil;
	} else if (mech.cannonRemainingReloadSeconds > 0) mech.cannonRemainingReloadSeconds -= deltaSeconds;

	if (mech.cannonRecoil > 0) {
		const deltaCannonRecoil = maxArmNormalSpeed * deltaSeconds;
		mech.cannonRecoil = deltaCannonRecoil > mech.cannonRecoil ? 0 : mech.cannonRecoil - deltaCannonRecoil;
	}
};

export { mechSystem };
