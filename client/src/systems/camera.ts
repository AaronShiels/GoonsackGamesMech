import { System } from ".";
import { BodyComponent, hasBody, isPlayer, PlayerComponent } from "../components";
import { add, multiply, normalise, subtract, length, timestampSeconds } from "../utilities";

const focalCoefficient = 0.25;
const scrollSpeed = 100;

const cameraSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	const playerEntity = game.entities.filter((e) => isPlayer(e) && hasBody(e))[0] as (PlayerComponent & BodyComponent) | undefined;
	if (!playerEntity) return;

	// Check change
	const cursorOffset = subtract(game.input.cursorPosition, game.camera);
	const desiredPosition = add(playerEntity.position, multiply(cursorOffset, focalCoefficient));

	// Apply change
	if (desiredPosition.x === game.camera.x && desiredPosition.y === game.camera.y) return;

	const difference = subtract(desiredPosition, game.camera);
	const differenceLength = length(difference);
	const deltaLength = scrollSpeed * deltaSeconds;
	const delta = multiply(normalise(difference), deltaLength);

	game.camera.x += differenceLength < deltaLength ? difference.x : delta.x;
	game.camera.y += differenceLength < deltaLength ? difference.y : delta.y;
};

export { cameraSystem };
