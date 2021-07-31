import { Application, Container, SCALE_MODES, settings } from "pixi.js";
import { Entity, isEntity } from "./entities";
import { initialisers, systems } from "./systems";
import { loadResources } from "./assets";
import { Rectangle, Vector, touchControlPaneModifier, isTouch, getPlayerId, getGameId } from "./utilities";

settings.SCALE_MODE = SCALE_MODES.NEAREST;
settings.SORTABLE_CHILDREN = true;

interface GameInput {
	moveDirection: Vector;
	cursorPosition: Vector;
	firing: boolean;
}

interface GameState {
	active(): boolean;
}

const minimumScreenDimension = Math.min(window.innerWidth, window.innerHeight);
const gameResolution = 400;
const controlPaneWidthAugment = isTouch ? touchControlPaneModifier.x + touchControlPaneModifier.width : 1;
const controlPaneHeightAugment = isTouch ? touchControlPaneModifier.y + touchControlPaneModifier.height : 1;
const screenWidth = minimumScreenDimension * controlPaneWidthAugment;
const screenHeight = minimumScreenDimension * controlPaneHeightAugment;

class Game extends Application {
	constructor() {
		super({
			width: screenWidth,
			height: screenHeight,
			autoDensity: true,
			resolution: window.devicePixelRatio
		});

		this.stage.scale.set(minimumScreenDimension / gameResolution);
		this.stage.addChild(this.world, this.hud);

		this.camera = { x: 0, y: 0, width: gameResolution, height: gameResolution };
		this.input = {
			cursorPosition: { x: gameResolution / 2, y: gameResolution / 2 },
			moveDirection: { x: 0, y: 0 },
			firing: false
		};

		this.playerId = getPlayerId();
		this.gameId = getGameId(this.playerId);
	}

	public readonly camera: Rectangle;
	public readonly input: GameInput;
	public readonly hud: Container = new Container();
	public readonly world: Container = new Container();
	public readonly playerId: string;
	public readonly gameId: string;

	public get entities(): ReadonlyArray<Entity> {
		return this.world.children.filter((e) => isEntity(e)) as unknown as Entity[];
	}

	public get isServer(): boolean {
		return this.gameId === this.playerId;
	}

	async load(): Promise<void> {
		// Load resourcess
		await loadResources();

		// Initialise and run game loop
		initialisers.forEach((init) => init(this));
		this.ticker.add((delta): void => systems.forEach((system) => system(this, delta / 60)));
	}
}

export { Game };
