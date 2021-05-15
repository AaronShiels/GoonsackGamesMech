import { System } from ".";
import { isEntity } from "../entities";

const garbageCollectionSystem: System = (game) => {
	for (let i = game.stage.children.length - 1; i >= 0; i--) {
		const entity = game.stage.getChildAt(i);
		if (!isEntity(entity) || !entity.destroyed) continue;

		game.stage.removeChild(entity);
	}
};

export { garbageCollectionSystem };
