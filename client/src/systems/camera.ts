import { System } from ".";

const cameraSystem: System = (game) => {
	game.stage.x = -(game.camera.x * game.stage.scale.x);
	game.stage.y = -(game.camera.y * game.stage.scale.y);
};

export { cameraSystem };
