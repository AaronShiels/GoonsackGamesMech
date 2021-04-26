import { System } from ".";
import { hasBody, hasPhysics } from "../components";
import { add, multiply, subtract } from "../utilities";

const frictionCoefficient = 10;

const physicsSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	for (const entity of game.entities) {
		if (!hasBody(entity) || !hasPhysics(entity)) continue;

		const frictionDecceleration = multiply(entity.velocity, frictionCoefficient);
		const totalAcceleration = subtract(entity.acceleration, frictionDecceleration);
		entity.velocity = add(entity.velocity, multiply(totalAcceleration, deltaSeconds));
		entity.position = add(entity.position, multiply(entity.velocity, deltaSeconds));
	}
};

export { physicsSystem };
