import { System } from ".";
import { hasBody, hasPhysics } from "../components";
import { add } from "../framework/Vector";

const physicsSystem: System = (world) => {
	for (const entity of world.getEntities()) {
		if (!hasBody(entity) || !hasPhysics(entity)) continue;

		add(entity.position, entity.velocity);
	}
};

export default physicsSystem;
