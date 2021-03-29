import { System } from ".";
import { AnimatedSpriteSet, hasBody, hasPhysics, hasSprite, isPlayer } from "../components";
import camera from "../framework/camera";
import gameState from "../framework/gameState";
import { getInput } from "../framework/input";
import { Vector, cardinalise, hasValue, multiply, normalise } from "../shapes";

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
		}
		if (!entity.walking.active && !entity.dashing.active && !entity.attacking.active && hasValue(input.moveDirection)) entity.walking.active = true;

		// Apply state
		if (entity.dashing.active) entity.dashing.elapsed += deltaSeconds;
		if (entity.attacking.active) entity.attacking.elapsed += deltaSeconds;
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
			const attackSuffix = entity.attacking.counter % 2 ? "alt" : "";
			entity.sprite.play(`attack${directionSuffix}${attackSuffix}`);
		} else if (entity.walking.active) entity.sprite.play(`walk${directionSuffix}`);
		else entity.sprite.play(`stand${directionSuffix}`);
	}
};

const toDirectionString = (direction: Vector): string => {
	const cardinal = hasValue(direction) ? cardinalise(direction) : { x: 0, y: 0 };
	if (cardinal.x === 1 && cardinal.y === 0) return "right";
	else if (cardinal.x === -1 && cardinal.y === 0) return "left";
	else if (cardinal.x === 0 && cardinal.y === 1) return "down";
	else if (cardinal.x === 0 && cardinal.y === -1) return "up";
	else return "down";
};

export default playerSystem;
