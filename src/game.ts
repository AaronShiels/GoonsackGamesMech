import { Application, Container, SCALE_MODES, settings } from "pixi.js";
import { loadResources } from "./assets";
import { Vector } from "./utilities/vector.js";
import { touchControlPaneModifier } from "./utilities/device.js";
import { getPlayerId, getGameId } from "./utilities/identity.js";
import { Rectangle } from "./utilities/rectangle.js";
import { Entity, isEntity } from "./entities/entity.js";
import { Initialiser, System } from "./systems/system.js";
import { cameraInit, cameraSystem } from "./systems/camera.js";
import { collisionSystem } from "./systems/collision.js";
import { elevationSystem } from "./systems/elevation.js";
import { garbageCollectionSystem } from "./systems/garbageCollection.js";
import { hudInit, hudSystem } from "./systems/hud.js";
import { inputInit, inputSystem } from "./systems/input.js";
import { mechSystem } from "./systems/mech.js";
import { particleSystem } from "./systems/particle.js";
import { physicsSystem } from "./systems/physics.js";
import { renderInit, renderSystem } from "./systems/render.js";
import { shadowInit, shadowSystem } from "./systems/shadow.js";
import { worldInit } from "./systems/world.js";

settings.SCALE_MODE = SCALE_MODES.NEAREST;
settings.SORTABLE_CHILDREN = true;

interface GameInput {
	moveDirection: Vector;
	cursorPosition: Vector;
	firing: boolean;
}

const minimumScreenDimension = Math.min(window.innerWidth, window.innerHeight);
const gameResolution = 400;
const controlPaneWidthAugment = touchControlPaneModifier.x + touchControlPaneModifier.width;
const controlPaneHeightAugment = touchControlPaneModifier.y + touchControlPaneModifier.height;
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

	async load(): Promise<void> {
		// Load resourcess
		await loadResources();

		// Initialise and run game loop
		initialisers.forEach((init) => init(this));
		this.ticker.add((delta): void => systems.forEach((system) => system(this, delta / 60)));
	}
}

const initialisers: Initialiser[] = [worldInit, inputInit, cameraInit, hudInit, shadowInit, renderInit];

const systems: System[] = [
	inputSystem,
	mechSystem,
	physicsSystem,
	collisionSystem,
	cameraSystem,
	elevationSystem,
	particleSystem,
	hudSystem,
	shadowSystem,
	renderSystem,
	garbageCollectionSystem
];

export { Game };
