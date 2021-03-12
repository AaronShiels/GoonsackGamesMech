import { settings, SCALE_MODES, Application } from "pixi.js";
import { loadAssets } from "./framework/assets";
import World from "./framework/World";

const loadGame = async (): Promise<void> => {
	settings.SCALE_MODE = SCALE_MODES.NEAREST;

	const game = new Application({
		width: 1280,
		height: 720,
		autoDensity: true,
		resolution: window.devicePixelRatio || 1
	});

	const gameElement = document.getElementById("game") as HTMLDivElement | null;
	if (!gameElement) throw new Error("Game element not found!");

	gameElement.appendChild(game.view);

	await loadAssets();

	const world = new World(game);
	game.stage.addChild(world);
};

loadGame();
