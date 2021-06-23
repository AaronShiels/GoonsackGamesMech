import { mechSystem } from "./mech";
import { physicsSystem } from "./physics";
import { renderSystem } from "./render";
import { collisionSystem } from "./collision";
import { garbageCollectionSystem } from "./garbageCollection";
import { enemySystem } from "./enemy";
import { healthSystem } from "./health";
import { Game } from "../game";
import { inputSystem } from "./input";
import { cameraSystem } from "./camera";
import { elevationSystem } from "./elevation";
import { hudSystem } from "./hud";
import { particleSystem } from "./particle";
import { shadowSystem } from "./shadow";

type System = (game: Game, deltaSeconds: number) => void;

const systems = [
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

export { System, systems };
