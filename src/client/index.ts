import { DeepstreamClient } from "@deepstream/client";
import { settings, SCALE_MODES, Application } from "pixi.js";
import { GameState } from "../common/state.js";
import { Initialiser, System } from "../common/systems/system.js";
import { createGameState } from "./state.js";

declare const SERVER_HOST: string;
if (!SERVER_HOST) throw new Error("Invalid configuration provided");

settings.SCALE_MODE = SCALE_MODES.NEAREST;
settings.SORTABLE_CHILDREN = true;

const gameResolution = 400;
const initialisers: ReadonlyArray<Initialiser> = [];
const systems: ReadonlyArray<System> = [];

const start = async (): Promise<void> => {
	// Create and configure application
	const screenDimension = Math.min(window.innerWidth, window.innerHeight);
	const app = new Application({
		width: screenDimension,
		height: screenDimension,
		autoDensity: true,
		resolution: window.devicePixelRatio
	});
	document.body.appendChild(app.view);
	app.stage.scale.set(screenDimension / gameResolution);

	// Create multiplayer connection
	const connection = new DeepstreamClient(SERVER_HOST);
	await connection.login({ username: "client" });

	// Create and initialise state
	const state = createGameState(connection);
	initialisers.forEach((init) => init(state));

	// Start game loop
	app.ticker.add((delta) => onTick(state, (delta * 1000) / 60));
};

const onTick = (state: GameState, delta: number): void => {
	systems.forEach((system) => system(state, delta));
};

start();
