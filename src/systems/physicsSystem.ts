import { System } from ".";
import { isMovingBody, MovingBody } from "../components";
import { add } from "../framework/Vector";

const physicsSystem: System = (world) => {
	for (const entity of world.entities<MovingBody>(isMovingBody)) {
		add(entity, entity.velocity);
	}
};

export default physicsSystem;
