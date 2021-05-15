import { System } from ".";
import { hasBody, hasPhysics } from "../components";
import { add, multiply, round, subtract } from "../utilities";

const frictionCoefficient = 10;

const physicsSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	for (const entity of game.stage.children) {
		if (!hasBody(entity) || !hasPhysics(entity)) continue;

		const frictionDecceleration = multiply(entity.velocity, frictionCoefficient);
		const totalAcceleration = subtract(entity.acceleration, frictionDecceleration);
		const newVelocity = add(entity.velocity, multiply(totalAcceleration, deltaSeconds));
		const newPosition = add(entity, multiply(entity.velocity, deltaSeconds));

		entity.velocity = newVelocity;
		entity.x = newPosition.x;
		entity.y = newPosition.y;
	}
};

export { physicsSystem };
