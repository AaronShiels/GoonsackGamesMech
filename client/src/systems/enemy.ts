import { System } from ".";
import { AnimatedSpriteSet, BodyComponent, hasBody, hasPhysics, hasSprite, isEnemy, isPlayer } from "../components";
import { gameState } from "../framework/gameState";
import { multiply, length, subtract, normalise, toDirectionString } from "../shapes";

const walkingForce = 200;
const walkingAcquisitonRange = 50;

const enemySystem: System = (entities) => {
	if (!gameState.active()) return;

	for (const entity of entities) {
		if (!isEnemy(entity)) continue;

		const targetVectorsAscending = entities
			.filter((e) => isPlayer(e) && hasBody(e))
			.map((e) => subtract((e as BodyComponent).position, ((entity as unknown) as BodyComponent).position))
			.sort((v1, v2) => length(v1) - length(v2));
		const unitTargetDirection = targetVectorsAscending.length ? normalise(targetVectorsAscending[0]) : { x: 0, y: 0 };
		const targetDistance = targetVectorsAscending.length ? length(targetVectorsAscending[0]) : 0;

		// Check state end
		if (entity.walking.active && (!targetDistance || targetDistance > walkingAcquisitonRange * 1.5)) entity.walking.active = false;

		// Check state start
		if (!entity.walking.active && targetDistance && targetDistance <= walkingAcquisitonRange) entity.walking.active = true;

		// Apply state
		if (entity.walking.active) {
			entity.direction = unitTargetDirection;
			if (hasPhysics(entity)) entity.acceleration = multiply(entity.direction, walkingForce);
		} else {
			if (hasPhysics(entity)) entity.acceleration = { x: 0, y: 0 };
		}

		// Apply animation
		if (!hasSprite(entity) || !(entity.sprite instanceof AnimatedSpriteSet)) continue;

		const directionSuffix = toDirectionString(entity.direction);
		if (entity.walking.active) entity.sprite.play(`zombiewalk${directionSuffix}`);
		else entity.sprite.play(`zombiestand${directionSuffix}`);
	}
};

export { enemySystem };
