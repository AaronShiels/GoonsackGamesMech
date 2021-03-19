import { System } from ".";
import { hasBody, hasPhysics } from "../components";
import { add, multiply, subtract } from "../framework/Vector";

const frictionCoefficient = 10;

const physicsSystem: System = (world, deltaSeconds) => {
	for (const entity of world.getEntities()) {
		if (!hasBody(entity) || !hasPhysics(entity)) continue;

		const frictionDecceleration = multiply(entity.velocity, frictionCoefficient);
		const totalAcceleration = subtract(entity.acceleration, frictionDecceleration);
		entity.velocity = add(entity.velocity, multiply(totalAcceleration, deltaSeconds));
		entity.position = add(entity.position, multiply(entity.velocity, deltaSeconds));

		console.log(
			`(${Math.round(entity.acceleration.x)},${Math.round(entity.acceleration.y)}) (${Math.round(entity.velocity.x)},${Math.round(
				entity.velocity.y
			)}) (${Math.round(entity.position.x)},${Math.round(entity.position.y)})`
		);
	}
};

export default physicsSystem;
