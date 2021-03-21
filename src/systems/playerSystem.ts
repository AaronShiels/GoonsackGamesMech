import { System } from ".";
import { AnimatedSpriteSet, hasPhysics, hasSprite, isPlayer } from "../components";
import gameState from "../framework/gameState";
import input from "../framework/input";
import { Vector, cardinalise, hasValue, multiply, normalise } from "../shapes";

const walkForce = 600;

const playerSystem: System = (world) => {
	if (!gameState.active()) return;

	const inputVector: Vector = { x: 0, y: 0 };
	if (input.right) inputVector.x++;
	if (input.left) inputVector.x--;
	if (input.down) inputVector.y++;
	if (input.up) inputVector.y--;
	const inputDirection = hasValue(inputVector) ? normalise(inputVector) : { x: 0, y: 0 };

	for (const entity of world.entities) {
		if (!isPlayer(entity)) continue;

		// Check state
		if (!entity.walking && hasValue(inputDirection)) entity.walking = true;
		if (entity.walking && !hasValue(inputDirection)) entity.walking = false;

		// Apply state
		if (hasValue(inputDirection)) entity.direction = inputDirection;
		if (hasPhysics(entity)) entity.acceleration = hasValue(inputDirection) ? multiply(entity.direction, walkForce) : { x: 0, y: 0 };

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
