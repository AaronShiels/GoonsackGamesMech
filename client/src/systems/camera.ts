import { System } from ".";
import { BuildingSegment, Mech } from "../entities";
import { Game } from "../game";
import { add, multiply, normalise, subtract, length, round } from "../utilities";

const focalCoefficient = 0.25;
const scrollSpeed = 100;

const cameraSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	const cursorOffset = subtract(game.input.cursorPosition, game.camera);
	const desiredCameraPosition = add(mech.position, multiply(cursorOffset, focalCoefficient));

	if (desiredCameraPosition.x === game.camera.x && desiredCameraPosition.y === game.camera.y) return;

	const difference = subtract(desiredCameraPosition, game.camera);
	const differenceLength = length(difference);
	const deltaLength = scrollSpeed * deltaSeconds;
	const delta = multiply(normalise(difference), deltaLength);

	game.camera.x += differenceLength < deltaLength ? difference.x : delta.x;
	game.camera.y += differenceLength < deltaLength ? difference.y : delta.y;
};

export { cameraSystem };
