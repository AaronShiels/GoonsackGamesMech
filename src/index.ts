import { settings, SCALE_MODES, Application } from "pixi.js";
import camera from "./framework/camera";
import { loadResources } from "./framework/resources";
import { createWorld } from "./framework/world";

const loadGame = async (): Promise<void> => {
	const gameElement = document.getElementById("game") as HTMLDivElement | null;
	if (!gameElement) throw new Error("Game element not found.");

	settings.SCALE_MODE = SCALE_MODES.NEAREST;
	settings.SORTABLE_CHILDREN = true;

	const app = new Application({
		autoDensity: true,
		height: (gameElement.clientWidth / 16) * 9,
		width: gameElement.clientWidth,
		resolution: window.devicePixelRatio || 1
	});
	app.renderer.backgroundColor = parseInt("39314B", 16);
	app.stage.scale.x = app.screen.width / camera.width;
	app.stage.scale.y = app.screen.height / camera.height;

	await loadResources();
	const world = createWorld(app);

	gameElement.appendChild(app.view);
};
loadGame();
