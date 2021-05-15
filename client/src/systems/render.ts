import { AnimatedSprite, DisplayObject } from "pixi.js";
import { System } from ".";

const renderSystem: System = (game, deltaSeconds) => {
	game.stage.x = -((game.camera.x - game.camera.width / 2) * game.stage.scale.x);
	game.stage.y = -((game.camera.y - game.camera.height / 2) * game.stage.scale.y);

	if (!game.state.active()) return;

	for (const entity of game.stage.children) {
		if (!(entity instanceof AnimatedSprite)) continue;

		entity.update(deltaSeconds * 60);
	}
};

export { renderSystem };
