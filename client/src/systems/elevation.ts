import { System } from ".";
import { isElevated } from "../components";
import { multiply, subtract } from "../utilities";

const elevationPerspectiveCoefficient = 16;

const elevationSystem: System = (game) => {
	if (!game.state.active()) return;

	for (const entity of game.entities) {
		if (!isElevated(entity)) continue;

		const cameraOffset = subtract(game.camera, entity.location);
		entity.perspectiveDisplacement = multiply(cameraOffset, -entity.elevation / elevationPerspectiveCoefficient);
		entity.perspectiveScale = 1 + entity.elevation / elevationPerspectiveCoefficient;
	}
};

export { elevationSystem };
