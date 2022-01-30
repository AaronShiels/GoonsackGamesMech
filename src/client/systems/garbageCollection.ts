import { isEntity } from "../../common/entities/entity.js";
import { System } from "../../common/systems/system.js";

const garbageCollectionSystem: System = (game) => {
	for (let i = game.entities.length - 1; i >= 0; i--) {
		const entity = game.world.getChildAt(i);
		if (!isEntity(entity) || !entity.destroyed) continue;

		game.world.removeChild(entity);
	}
};

export { garbageCollectionSystem };
