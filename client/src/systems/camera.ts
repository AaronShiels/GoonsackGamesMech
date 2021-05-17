import { System } from ".";
import { Mech } from "../entities";
import { add, multiply, normalise, subtract, length, timestampSeconds } from "../utilities";

const focalCoefficient = 0.25;
const scrollSpeed = 100;

const cameraSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	// Check change
	const cursorOffset = subtract(game.input.cursorLocation, game.camera);
	const desiredLocation = add(mech, multiply(cursorOffset, focalCoefficient));

	// Apply change
	if (desiredLocation.x === game.camera.x && desiredLocation.y === game.camera.y) return;

	const difference = subtract(desiredLocation, game.camera);
	const differenceLength = length(difference);
	const deltaLength = scrollSpeed * deltaSeconds;
	const delta = multiply(normalise(difference), deltaLength);

	game.camera.x += differenceLength < deltaLength ? difference.x : delta.x;
	game.camera.y += differenceLength < deltaLength ? difference.y : delta.y;
};

export { cameraSystem };
