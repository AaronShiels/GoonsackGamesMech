import { playerSystem } from "./player";
import { physicsSystem } from "./physics";
import { spriteSystem } from "./sprite";
import { areaSystem } from "./area";
import { cameraSystem } from "./camera";
import { collisionSystem } from "./collision";
import { BaseComponent } from "../components";
import { Container } from "pixi.js";
import { garbageCollectionSystem } from "./garbageCollection";
import { enemySystem } from "./enemy";
import { healthSystem } from "./health";

type System = (entites: BaseComponent[], stage: Container, deltaSeconds: number) => void;

const systems = [areaSystem, playerSystem, enemySystem, healthSystem, physicsSystem, collisionSystem, cameraSystem, spriteSystem, garbageCollectionSystem];

export { System, systems };
