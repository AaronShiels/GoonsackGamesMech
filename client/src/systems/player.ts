import { System } from ".";
import { AnimatedSpriteSet, getBounds, hasBody, hasHealth, hasPhysics, hasSprite, isEnemy, isPlayer } from "../components";
import { camera } from "../framework/camera";
import { gameState } from "../framework/gameState";
import { getInput } from "../framework/input";
import { now } from "../framework/time";
import { cardinalise, hasValue, multiply, normalise, sectorRectangeIntersects, subtract, toDirectionString, Vector } from "../shapes";

const walkingForce = 600;
const attackDuration = 0.25;
const attackKnockbackVelocity = 400;
const dashDuration = 0.75;
const dashInstantaneousVelocity = 400;

const playerSystem: System = (entities, _, deltaSeconds) => {
	if (!gameState.active()) return;

	for (const entity of entities) {
		if (!isPlayer(entity)) continue;

		const playerPosition = hasBody(entity) ? entity.position : { x: camera.width / 2, y: camera.height / 2 };
		const input = getInput(playerPosition);

		// Check state end
		if (entity.dashing.active && entity.dashing.elapsed >= dashDuration) entity.dashing.active = false;
		if (entity.attacking.active && entity.attacking.elapsed >= attackDuration) entity.attacking.active = false;
		if (entity.walking.active && (entity.attacking.active || entity.dashing.active || !hasValue(input.moveDirection))) entity.walking.active = false;

		// Check state start
		if (!entity.dashing.active && !entity.attacking.active && input.dash) {
			entity.dashing.active = true;
			entity.dashing.elapsed = 0;
			if (hasValue(input.moveDirection)) entity.direction = input.moveDirection;
			if (hasPhysics(entity)) entity.velocity = multiply(entity.direction, dashInstantaneousVelocity);
		}
		if (!entity.attacking.active && input.attack) {
			entity.attacking.active = true;
			entity.attacking.elapsed = 0;
			entity.attacking.counter++;
			if (hasValue(input.moveDirection)) entity.direction = input.moveDirection;

			const { sectorMinimum, sectorMaximum } = getAttackAngles(entity.direction, entity.attacking.counter);
			entity.attacking.minimumAngle = sectorMinimum;
			entity.attacking.maximumAngle = sectorMaximum;
		}
		if (!entity.walking.active && !entity.dashing.active && !entity.attacking.active && hasValue(input.moveDirection)) entity.walking.active = true;

		// Apply state
		if (entity.dashing.active) entity.dashing.elapsed += deltaSeconds;
		if (entity.attacking.active) {
			entity.attacking.elapsed += deltaSeconds;

			const attackSector = { ...entity.attacking, ...playerPosition };
			for (const otherEntity of entities) {
				if (!isEnemy(otherEntity) || !hasBody(otherEntity)) continue;

				const enemeyBounds = getBounds(otherEntity);
				if (!sectorRectangeIntersects(attackSector, enemeyBounds)) continue;

				const currentTimestamp = now();
				if (hasHealth(otherEntity) && otherEntity.lastHitTimestamp + entity.attacking.elapsed < currentTimestamp) {
					otherEntity.hitpoints--;
					otherEntity.lastHitTimestamp = currentTimestamp;
				}

				if (hasPhysics(otherEntity)) {
					const knockbackDirection = normalise(subtract(otherEntity.position, playerPosition));
					const knockbackVector = multiply(knockbackDirection, attackKnockbackVelocity);
					otherEntity.velocity = knockbackVector;
				}
			}
		}
		if (entity.walking.active) {
			entity.direction = input.moveDirection;
			if (hasPhysics(entity)) entity.acceleration = multiply(entity.direction, walkingForce);
		} else {
			if (hasPhysics(entity)) entity.acceleration = { x: 0, y: 0 };
		}

		// Apply animation
		if (!hasSprite(entity) || !(entity.sprite instanceof AnimatedSpriteSet)) continue;

		const directionSuffix = toDirectionString(entity.direction);
		if (entity.attacking.active) {
			const attackSuffix = entity.attacking.counter % 2 !== 0 ? "alt" : "";
			entity.sprite.play(`cyborgattack${directionSuffix}${attackSuffix}`);
		} else if (entity.walking.active) entity.sprite.play(`cyborgwalk${directionSuffix}`);
		else entity.sprite.play(`cyborgstand${directionSuffix}`);
	}
};

const getAttackAngles = (direction: Vector, attackCounter: number): { sectorMinimum: number; sectorMaximum: number } => {
	const cardinalDirection = hasValue(direction) ? cardinalise(direction) : { x: 0, y: 1 };
	let baseAttackAngle = 0;
	if (cardinalDirection.x == 1) baseAttackAngle = 0;
	else if (cardinalDirection.x == -1) baseAttackAngle = Math.PI;
	else if (cardinalDirection.y == 1) baseAttackAngle = 0.5 * Math.PI;
	else if (cardinalDirection.y == -1) baseAttackAngle = 1.5 * Math.PI;

	const adjustedAngle = baseAttackAngle + 0.125 * Math.PI * (attackCounter % 2 === 0 ? 1 : -1);
	return { sectorMinimum: adjustedAngle - 0.3125 * Math.PI, sectorMaximum: adjustedAngle + 0.3125 * Math.PI };
};

export { playerSystem };
