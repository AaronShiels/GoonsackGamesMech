import { playerSystem } from "./player";
import { physicsSystem } from "./physics";
import { renderSystem } from "./render";
import { collisionSystem } from "./collision";
import { garbageCollectionSystem } from "./garbageCollection";
import { enemySystem } from "./enemy";
import { healthSystem } from "./health";
import { Game } from "../game";
import { inputSystem } from "./input";
import { cameraSystem } from "./camera";

type System = (game: Game, deltaSeconds: number) => void;

const systems = [inputSystem, playerSystem, enemySystem, healthSystem, physicsSystem, collisionSystem, cameraSystem, renderSystem, garbageCollectionSystem];

export { System, systems };
