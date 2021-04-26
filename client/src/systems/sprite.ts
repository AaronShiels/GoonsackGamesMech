import { AnimatedSprite } from "pixi.js";
import { System } from ".";
import { AnimatedSpriteSet, hasBody, hasSprite } from "../components";
const spriteSystem: System = (game, deltaSeconds) => {
	for (const entity of game.entities) {
		if (!hasBody(entity) || !hasSprite(entity)) continue;

		if (!entity.sprite.parent) game.stage.addChild(entity.sprite);

		entity.sprite.x = entity.position.x;
		entity.sprite.y = entity.position.y;

		if (game.state.active() && (entity.sprite instanceof AnimatedSprite || entity.sprite instanceof AnimatedSpriteSet))
			entity.sprite.update(deltaSeconds * 60);
	}
};

export { spriteSystem };
