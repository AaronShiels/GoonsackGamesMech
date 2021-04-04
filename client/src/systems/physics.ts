import { System } from ".";
import { hasBody, hasPhysics } from "../components";
import { gameState } from "../framework/gameState";
import { add, multiply, subtract } from "../shapes";

const frictionCoefficient = 10;

const physicsSystem: System = (entities, _, deltaSeconds) => {
	if (!gameState.active()) return;

	for (const entity of entities) {
		if (!hasBody(entity) || !hasPhysics(entity)) continue;

		const frictionDecceleration = multiply(entity.velocity, frictionCoefficient);
		const totalAcceleration = subtract(entity.acceleration, frictionDecceleration);
		entity.velocity = add(entity.velocity, multiply(totalAcceleration, deltaSeconds));
		entity.position = add(entity.position, multiply(entity.velocity, deltaSeconds));
	}
};

export { physicsSystem };
