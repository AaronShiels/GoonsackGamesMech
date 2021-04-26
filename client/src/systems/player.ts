import { System } from ".";
import { AnimatedSpriteSet, BodyComponent, getBounds, hasBody, hasHealth, hasPhysics, hasSprite, isEnemy, isPlayer, PlayerComponent } from "../components";
import { cardinalise, hasValue, multiply, normalise, sectorRectangeIntersects, subtract, timestampSeconds, toDirectionString, Vector } from "../utilities";

const walkingForce = 600;
const attackDuration = 0.25;
const attackKnockbackVelocity = 400;
const dashDuration = 0.75;
const dashInstantaneousVelocity = 400;

const playerSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	const playerEntity = game.entities.filter((e) => isPlayer(e) && hasBody(e))[0] as (PlayerComponent & BodyComponent) | undefined;
	if (!playerEntity) return;

	// Check state end
	if (playerEntity.dashing.active && playerEntity.dashing.elapsed >= dashDuration) playerEntity.dashing.active = false;
	if (playerEntity.attacking.active && playerEntity.attacking.elapsed >= attackDuration) playerEntity.attacking.active = false;
	if (playerEntity.walking.active && (playerEntity.attacking.active || playerEntity.dashing.active || !hasValue(game.input.moveDirection)))
		playerEntity.walking.active = false;

	// Check state start
	if (!playerEntity.dashing.active && !playerEntity.attacking.active && game.input.dash) {
		playerEntity.dashing.active = true;
		playerEntity.dashing.elapsed = 0;
		if (hasValue(game.input.moveDirection)) playerEntity.direction = game.input.moveDirection;
		if (hasPhysics(playerEntity)) playerEntity.velocity = multiply(playerEntity.direction, dashInstantaneousVelocity);
	}
	if (!playerEntity.attacking.active && game.input.attack) {
		playerEntity.attacking.active = true;
		playerEntity.attacking.elapsed = 0;
		playerEntity.attacking.counter++;
		if (hasValue(game.input.moveDirection)) playerEntity.direction = game.input.moveDirection;

		const { sectorMinimum, sectorMaximum } = getAttackAngles(playerEntity.direction, playerEntity.attacking.counter);
		playerEntity.attacking.minimumAngle = sectorMinimum;
		playerEntity.attacking.maximumAngle = sectorMaximum;
	}
	if (!playerEntity.walking.active && !playerEntity.dashing.active && !playerEntity.attacking.active && hasValue(game.input.moveDirection))
		playerEntity.walking.active = true;

	// Apply state
	if (playerEntity.dashing.active) playerEntity.dashing.elapsed += deltaSeconds;
	if (playerEntity.attacking.active) {
		playerEntity.attacking.elapsed += deltaSeconds;

		const attackSector = { ...playerEntity.attacking, ...playerEntity.position };
		for (const otherEntity of game.entities) {
			if (!isEnemy(otherEntity) || !hasBody(otherEntity)) continue;

			const enemeyBounds = getBounds(otherEntity);
			if (!sectorRectangeIntersects(attackSector, enemeyBounds)) continue;

			const timestamp = timestampSeconds();
			if (hasHealth(otherEntity) && otherEntity.lastHitTimestamp + playerEntity.attacking.elapsed < timestamp) {
				otherEntity.hitpoints--;
				otherEntity.lastHitTimestamp = timestamp;
			}

			if (hasPhysics(otherEntity)) {
				const knockbackDirection = normalise(subtract(otherEntity.position, playerEntity.position));
				const knockbackVector = multiply(knockbackDirection, attackKnockbackVelocity);
				otherEntity.velocity = knockbackVector;
			}
		}
	}
	if (playerEntity.walking.active) {
		playerEntity.direction = game.input.moveDirection;
		if (hasPhysics(playerEntity)) playerEntity.acceleration = multiply(playerEntity.direction, walkingForce);
	} else {
		if (hasPhysics(playerEntity)) playerEntity.acceleration = { x: 0, y: 0 };
	}

	// Apply animation
	if (!hasSprite(playerEntity) || !(playerEntity.sprite instanceof AnimatedSpriteSet)) return;

	const directionSuffix = toDirectionString(playerEntity.direction);
	if (playerEntity.attacking.active) {
		const attackSuffix = playerEntity.attacking.counter % 2 !== 0 ? "alt" : "";
		playerEntity.sprite.play(`cyborgattack${directionSuffix}${attackSuffix}`);
	} else if (playerEntity.walking.active) playerEntity.sprite.play(`cyborgwalk${directionSuffix}`);
	else playerEntity.sprite.play(`cyborgstand${directionSuffix}`);
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
