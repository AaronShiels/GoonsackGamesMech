import { System } from ".";
import { hasBody, hasSprite } from "../components";

const spriteSystem: System = (world) => {
	for (const entity of world.getEntities()) {
		if (!hasBody(entity) || !hasSprite(entity)) continue;

		entity.sprite.x = entity.position.x;
		entity.sprite.y = entity.position.y;
	}
};

export default spriteSystem;
