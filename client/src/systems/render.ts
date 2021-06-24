import { AnimatedSprite } from "pixi.js";
import { Initialiser, System } from ".";

const renderInit: Initialiser = (game) => (game.renderer.backgroundColor = 0x1f512b);

const renderSystem: System = (game, deltaSeconds) => {
	game.stage.x = -((game.camera.x - game.camera.width / 2) * game.stage.scale.x);
	game.stage.y = -((game.camera.y - game.camera.height / 2) * game.stage.scale.y);

	if (!game.state.active()) return;

	for (const entity of game.entities) {
		if (!(entity instanceof AnimatedSprite)) continue;

		entity.update(deltaSeconds * 60);
	}
};

export { renderInit, renderSystem };
