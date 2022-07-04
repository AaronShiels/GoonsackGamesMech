import { System } from "./system.js";
import { hasLimitedLifespan } from "../components/particle.js";

const particleSystem: System = (game, deltaSeconds) => {
	for (const entity of game.entities) {
		if (!hasLimitedLifespan(entity)) continue;

		if (entity.remainingSeconds < 0) entity.destroyed = true;
		else entity.remainingSeconds -= deltaSeconds;
	}
};

export { particleSystem };
