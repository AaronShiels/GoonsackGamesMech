import { System } from "../../common/systems/system.js";
import { hasLimitedLifespan } from "../../common/components/particle.js";

const particleSystem: System = (game, deltaSeconds) => {
	for (const entity of game.entities) {
		if (!hasLimitedLifespan(entity)) continue;

		if (entity.remainingSeconds < 0) entity.destroyed = true;
		else entity.remainingSeconds -= deltaSeconds;
	}
};

export { particleSystem };
