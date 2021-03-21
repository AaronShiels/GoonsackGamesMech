import { settings, SCALE_MODES, Application } from "pixi.js";
import camera from "./framework/camera";
import { loadResources } from "./framework/resources";
import { createWorld } from "./framework/world";

const loadGame = async (): Promise<void> => {
	settings.SCALE_MODE = SCALE_MODES.NEAREST;
	settings.SORTABLE_CHILDREN = true;

	const app = new Application({
		width: 1280,
		height: 704,
		autoDensity: true,
		resolution: window.devicePixelRatio || 1
	});
	app.stage.scale.x = app.screen.width / camera.width;
	app.stage.scale.y = app.screen.height / camera.height;

	const gameElement = document.getElementById("game") as HTMLDivElement | null;
	if (!gameElement) throw new Error("Game element not found.");

	gameElement.appendChild(app.view);

	await loadResources();

	const world = createWorld(app);
};

loadGame();
