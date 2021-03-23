import { System } from ".";
import { hasSprite } from "../components";

const garbageCollectionSystem: System = (entities, stage) => {
	for (let i = entities.length - 1; i >= 0; i--) {
		const entity = entities[i];
		if (!entity.destroyed) continue;

		if (hasSprite(entity)) stage.removeChild(entity.sprite);
		entities.splice(i, 1);
	}
};

export default garbageCollectionSystem;
