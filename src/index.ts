import { settings, SCALE_MODES, Application, Loader } from "pixi.js";
import { cyborgSpriteSheetResource } from "./entities/cyborg";
import { gameWidth, gameHeight } from "./framework/constants";
import { createWorld } from "./framework/world";

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

	game.stage.scale.x = game.screen.width / gameWidth;
	game.stage.scale.y = game.screen.height / gameHeight;

	const world = createWorld(game);
};

const assets = [cyborgSpriteSheetResource];
const loadAssets = (): Promise<void> => new Promise<void>((res) => Loader.shared.add(assets).load((_) => res()));

loadGame();
