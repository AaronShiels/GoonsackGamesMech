import { hasBody } from "../../common/components/body.js";
import { hasPhysics } from "../../common/components/physics.js";
import { multiply, subtract } from "../../common/utilities/vector.js";
import { System } from "../../common/systems/system.js";

const physicsSystem: System = (game, deltaSeconds) => {
	for (const entity of game.entities) {
		if (!hasBody(entity) || !hasPhysics(entity)) continue;

		const frictionDecceleration = multiply(entity.velocity, entity.friction);
		const totalAcceleration = subtract(entity.acceleration, frictionDecceleration);
		const deltaAcceleration = multiply(totalAcceleration, deltaSeconds);

		entity.velocity.x += deltaAcceleration.x;
		entity.velocity.y += deltaAcceleration.y;

		const deltaVelocity = multiply(entity.velocity, deltaSeconds);

		entity.position.x += deltaVelocity.x;
		entity.position.y += deltaVelocity.y;
	}
};

export { physicsSystem };
