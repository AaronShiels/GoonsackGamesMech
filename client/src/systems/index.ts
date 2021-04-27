import { playerSystem } from "./player";
import { physicsSystem } from "./physics";
import { spriteSystem } from "./sprite";
import { cameraSystem } from "./camera";
import { collisionSystem } from "./collision";
import { garbageCollectionSystem } from "./garbageCollection";
import { enemySystem } from "./enemy";
import { healthSystem } from "./health";
import { Game } from "../game";

type System = (game: Game, deltaSeconds: number) => void;

const systems = [playerSystem, enemySystem, healthSystem, physicsSystem, collisionSystem, cameraSystem, spriteSystem, garbageCollectionSystem];

export { System, systems };
