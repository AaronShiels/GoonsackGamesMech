import { Initialiser, System } from ".";
import { Mech } from "../entities";
import { add, multiply, normalise, subtract, length } from "../utilities";

const focalCoefficient = 0.25;
const scrollSpeed = 100;

const cameraInit: Initialiser = (game) => {
	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) throw new Error("Player not initialised!");

	game.camera.x = mech.position.x;
	game.camera.y = mech.position.y;
};

const cameraSystem: System = (game, deltaSeconds) => {
	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	const cursorWorldPosition = subtract(game.input.cursorPosition, game.world.position);
	const cursorOffset = subtract(cursorWorldPosition, game.camera);
	const desiredCameraPosition = add(mech.position, multiply(cursorOffset, focalCoefficient));

	if (desiredCameraPosition.x === game.camera.x && desiredCameraPosition.y === game.camera.y) return;

	const difference = subtract(desiredCameraPosition, game.camera);
	const differenceLength = length(difference);
	const deltaLength = scrollSpeed * deltaSeconds;
	const delta = multiply(normalise(difference), deltaLength);

	game.camera.x += differenceLength < deltaLength ? difference.x : delta.x;
	game.camera.y += differenceLength < deltaLength ? difference.y : delta.y;
};

export { cameraInit, cameraSystem };
