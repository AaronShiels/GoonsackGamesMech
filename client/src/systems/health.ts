import { System } from ".";
import { hasHealth } from "../components";

const healthSystem: System = (game) => {
	if (!game.state.active()) return;

	for (const entity of game.entities) {
		if (!hasHealth(entity)) continue;

		if (entity.hitpoints <= 0) entity.destroyed = true;
	}
};

export { healthSystem };
