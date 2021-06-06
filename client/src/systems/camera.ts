import { System } from ".";
import { BuildingSegment, Mech } from "../entities";
import { Game } from "../game";
import { add, multiply, normalise, subtract, length, round } from "../utilities";

const focalCoefficient = 0.25;
const scrollSpeed = 100;

const cameraSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	updateCameraLocation(game, deltaSeconds);
	applyBuildingElevation(game);
};

const updateCameraLocation = (game: Game, deltaSeconds: number): void => {
	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	const cursorOffset = subtract(game.input.cursorLocation, game.camera);
	const desiredCameraLocation = add(mech.location, multiply(cursorOffset, focalCoefficient));

	if (desiredCameraLocation.x === game.camera.x && desiredCameraLocation.y === game.camera.y) return;

	const difference = subtract(desiredCameraLocation, game.camera);
	const differenceLength = length(difference);
	const deltaLength = scrollSpeed * deltaSeconds;
	const delta = multiply(normalise(difference), deltaLength);

	game.camera.x += differenceLength < deltaLength ? difference.x : delta.x;
	game.camera.y += differenceLength < deltaLength ? difference.y : delta.y;
};

const applyBuildingElevation = (game: Game): void => {
	for (const entity of game.entities) {
		if (!(entity instanceof BuildingSegment)) continue;

		entity.updatePerspective(round(subtract(game.camera, entity.location)));
	}
};

export { cameraSystem };
