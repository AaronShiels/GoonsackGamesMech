import { mechSystem } from "./mech";
import { physicsSystem } from "./physics";
import { renderInit, renderSystem } from "./render";
import { collisionSystem } from "./collision";
import { garbageCollectionSystem } from "./garbageCollection";
import { enemySystem } from "./enemy";
import { healthSystem } from "./health";
import { Game } from "../game";
import { inputInit, inputSystem } from "./input";
import { cameraInit, cameraSystem } from "./camera";
import { elevationSystem } from "./elevation";
import { hudInit, hudSystem } from "./hud";
import { particleSystem } from "./particle";
import { shadowInit, shadowSystem } from "./shadow";
import { worldInit } from "./world";

type Initialiser = (game: Game) => void;

type System = (game: Game, deltaSeconds: number) => void;

const initialisers: Initialiser[] = [worldInit, inputInit, cameraInit, hudInit, shadowInit, renderInit];

const systems: System[] = [
	inputSystem,
	mechSystem,
	enemySystem,
	healthSystem,
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

export { System, systems, Initialiser, initialisers };
