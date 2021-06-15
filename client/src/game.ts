import { Application, SCALE_MODES, settings } from "pixi.js";
import { Entity, Tile, isEntity, Mech, createBuilding, ReticleHemisphere, ReticlePointer } from "./entities";
import { Rectangle, Side, Vector } from "./utilities";
import { systems } from "./systems";
import { defaultMap, loadResources } from "./assets";
import { generateTileData, generateObjectData } from "./utilities/map";

// settings.ROUND_PIXELS = true;
settings.SCALE_MODE = SCALE_MODES.NEAREST;
settings.SORTABLE_CHILDREN = true;

interface GameSettings {
	width: number;
	height: number;
}

interface GameInput {
	moveDirection: Vector;
	cursorPosition: Vector;
}

interface GameState {
	active(): boolean;
}

class Game extends Application {
	constructor(element: HTMLElement, settings: GameSettings) {
		super({
			width: element.clientWidth,
			height: (element.clientWidth / settings.width) * settings.height,
			autoDensity: true,
			resolution: window.devicePixelRatio
		});

		this.stage.scale.x = this.screen.width / settings.width;
		this.stage.scale.y = this.screen.height / settings.height;
		element.appendChild(this.view);

		this.camera = { x: 0, y: 0, ...settings };
		this.input = { cursorPosition: { x: settings.width / 2, y: settings.height / 2 }, moveDirection: { x: 0, y: 0 } };
	}

	public readonly camera: Rectangle;
	public readonly state: GameState = {
		active: () => true
	};
	public readonly input: GameInput;
	public get entities(): ReadonlyArray<Entity> {
		return this.stage.children.filter((e) => isEntity(e)) as unknown as Entity[];
	}

	async load(): Promise<void> {
		// Initialise render target
		this.renderer.backgroundColor = parseInt("FFFFFF", 16);

		// Load resourcess
		await loadResources();

		// Load map
		const tiles = generateTileData(defaultMap, "ground").map((td) => new Tile(td));
		const buildings = generateObjectData(defaultMap, "buildings").flatMap((od) => createBuilding(od));
		this.stage.addChild(...tiles, ...buildings);

		// Initialise player
		const initalPosition = { x: 80, y: 120 };

		this.camera.x = initalPosition.x;
		this.camera.y = initalPosition.y;
		this.input.cursorPosition = initalPosition;

		const mech = new Mech(initalPosition);
		this.stage.addChild(mech);

		// Start game loop
		this.ticker.add((delta): void => systems.forEach((system) => system(this, delta / 60)));

		console.log(`Game started using ${this.renderer.type === 1 ? "WebGL" : "canvas"} renderer.`);
	}
}

export { Game };
