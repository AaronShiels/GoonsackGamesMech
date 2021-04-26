import { System } from ".";
import { hasSprite } from "../components";

const garbageCollectionSystem: System = (game) => {
	for (let i = game.entities.length - 1; i >= 0; i--) {
		const entity = game.entities[i];
		if (!entity.destroyed) continue;

		if (hasSprite(entity)) game.stage.removeChild(entity.sprite);
		game.entities.splice(i, 1);
	}
};

export { garbageCollectionSystem };
