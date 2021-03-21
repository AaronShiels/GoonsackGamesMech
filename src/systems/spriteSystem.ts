import { AnimatedSprite } from "pixi.js";
import { System } from ".";
import { AnimatedSpriteSet, hasBody, hasSprite } from "../components";
import gameState from "../framework/gameState";

const spriteSystem: System = (world, deltaSeconds) => {
	for (const entity of world.entities) {
		if (!hasBody(entity) || !hasSprite(entity)) continue;

		entity.sprite.x = entity.position.x;
		entity.sprite.y = entity.position.y;

		if (gameState.active() && (entity.sprite instanceof AnimatedSprite || entity.sprite instanceof AnimatedSpriteSet))
			entity.sprite.update(deltaSeconds * 60);
	}
};

export default spriteSystem;
