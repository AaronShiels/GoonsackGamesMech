import { System } from ".";
import { AnimatedSpriteSet, hasBody, hasPhysics, hasSprite, isPlayer } from "../components";
import camera from "../framework/camera";
import gameState from "../framework/gameState";
import { getInput } from "../framework/input";
import { Vector, cardinalise, hasValue, multiply, normalise } from "../shapes";

const walkForce = 600;

const playerSystem: System = (entities) => {
	if (!gameState.active()) return;

	for (const entity of entities) {
		if (!isPlayer(entity)) continue;

		const playerPosition = hasBody(entity) ? entity.position : { x: camera.width / 2, y: camera.height / 2 };
		const input = getInput(playerPosition);

		// Check state
		if (!entity.walking && hasValue(input.moveDirection)) entity.walking = true;
		if (entity.walking && !hasValue(input.moveDirection)) entity.walking = false;

		// Apply state
		if (hasValue(input.moveDirection)) entity.direction = input.moveDirection;
		if (hasPhysics(entity)) entity.acceleration = hasValue(input.moveDirection) ? multiply(entity.direction, walkForce) : { x: 0, y: 0 };

		// Apply animation
		if (!hasSprite(entity) || !(entity.sprite instanceof AnimatedSpriteSet)) continue;

		const directionSuffix = toDirectionString(entity.direction);
		if (entity.walking) entity.sprite.play(`walk${directionSuffix}`);
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
