import { System } from ".";
import { hasHealth } from "../components";
import { gameState } from "../framework/gameState";

const healthSystem: System = (entities) => {
	if (!gameState.active()) return;

	for (const entity of entities) {
		if (!hasHealth(entity)) continue;

		if (entity.hitpoints <= 0) entity.destroyed = true;
	}
};

export { healthSystem };
