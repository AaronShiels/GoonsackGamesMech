import { isElevated } from "../../common/components/elevation.js";
import { multiply, subtract } from "../../common/utilities/vector.js";
import { System } from "../../common/systems/system.js";

const elevationPerspectiveCoefficient = 16;

const elevationSystem: System = (game) => {
	for (const entity of game.entities) {
		if (!isElevated(entity)) continue;

		const cameraOffset = subtract(game.camera, entity.position);
		const perspectiveDisplacement = multiply(cameraOffset, -entity.elevation / elevationPerspectiveCoefficient);
		const perspectiveScale = 1 + entity.elevation / elevationPerspectiveCoefficient;

		entity.perspectiveDisplacement.x = perspectiveDisplacement.x;
		entity.perspectiveDisplacement.y = perspectiveDisplacement.y;
		entity.perspectiveScale = perspectiveScale;
	}
};

export { elevationSystem };
