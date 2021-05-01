import { System } from ".";
import { BodyComponent, hasBody, isPlayer, PlayerComponent } from "../components";
import { add, multiply, subtract, timestampSeconds } from "../utilities";

const focalCoefficient = 0.25;

const cameraSystem: System = (game, ds) => {
	if (!game.state.active()) return;

	const playerEntity = game.entities.filter((e) => isPlayer(e) && hasBody(e))[0] as (PlayerComponent & BodyComponent) | undefined;
	if (!playerEntity) return;

	const focalPoint = add(playerEntity.position, multiply(subtract(game.input.cursorPosition, playerEntity.position), focalCoefficient));

	game.camera.x = focalPoint.x - game.camera.width / 2;
	game.camera.y = focalPoint.y - game.camera.height / 2;
};

export { cameraSystem };
