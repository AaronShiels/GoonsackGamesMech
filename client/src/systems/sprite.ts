import { AnimatedSprite } from "pixi.js";
import { System } from ".";
import { AnimatedSpriteSet, hasBody, hasSprite } from "../components";
import { gameState } from "../framework/gameState";

const spriteSystem: System = (entities, stage, deltaSeconds) => {
	for (const entity of entities) {
		if (!hasBody(entity) || !hasSprite(entity)) continue;

		if (!entity.sprite.parent) stage.addChild(entity.sprite);

		entity.sprite.x = entity.position.x;
		entity.sprite.y = entity.position.y;

		if (gameState.active() && (entity.sprite instanceof AnimatedSprite || entity.sprite instanceof AnimatedSpriteSet))
			entity.sprite.update(deltaSeconds * 60);
	}
};

export { spriteSystem };
