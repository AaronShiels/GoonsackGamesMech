import playerSystem from "./playerSystem";
import physicsSystem from "./physicsSystem";
import spriteSystem from "./spriteSystem";
import areaSystem from "./areaSystem";
import cameraSystem from "./cameraSystem";
import collisionSystem from "./collisionSystem";
import { BaseComponent } from "../components";
import { Container } from "pixi.js";
import garbageCollectionSystem from "./garbageCollectionSystem";

type System = (entites: BaseComponent[], stage: Container, deltaSeconds: number) => void;

const systems = [areaSystem, playerSystem, physicsSystem, collisionSystem, cameraSystem, spriteSystem, garbageCollectionSystem];

export default systems;
export { System };
