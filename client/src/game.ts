import { Application, Container, SCALE_MODES, settings } from "pixi.js";
import { Entity, Tile, isEntity, Mech, createBuilding } from "./entities";
import { Rectangle, Vector } from "./utilities";
import { initialisers, systems } from "./systems";
import { defaultMap, loadResources } from "./assets";
import { generateTileData, generateObjectData } from "./utilities";

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

const gameResolution = 400;

class Game extends Application {
	constructor(screenDimensions: number) {
		super({
			width: screenDimensions,
			height: screenDimensions,
			autoDensity: true,
			resolution: window.devicePixelRatio
		});

		this.stage.scale.x = this.screen.width / gameResolution;
		this.stage.scale.y = this.screen.height / gameResolution;

		this.camera = {
			x: 0,
			y: 0,
			width: gameResolution,
			height: gameResolution
		};
		this.input = {
			cursorPosition: { x: 0, y: 0 },
			moveDirection: { x: 0, y: 0 },
			firing: false
		};
	}

	public readonly camera: Rectangle;
	public readonly state: GameState = {
		active: () => true
	};
	public readonly input: GameInput;

	public readonly hud: Container = new Container();
	public readonly world: Container = new Container();

	public get entities(): ReadonlyArray<Entity> {
		return this.world.children.filter((e) => isEntity(e)) as unknown as Entity[];
	}

	async load(): Promise<void> {
		// Load resourcess
		await loadResources();

		// Load game world
		this.stage.addChild(this.world, this.hud);

		const tiles = generateTileData(defaultMap, "ground").map((td) => new Tile(td));
		const buildings = generateObjectData(defaultMap, "buildings").flatMap((od) => createBuilding(od));
		const mech = new Mech({ x: 80, y: 120 });
		this.world.addChild(...tiles, ...buildings, mech);

		// Start game loop
		initialisers.forEach((init) => init(this));
		this.ticker.add((delta): void => systems.forEach((system) => system(this, delta / 60)));
	}
}

export { Game };
