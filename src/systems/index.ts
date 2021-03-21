import World from "../framework/world";
import playerSystem from "./playerSystem";
import physicsSystem from "./physicsSystem";
import spriteSystem from "./spriteSystem";
import areaSystem from "./areaSystem";
import cameraSystem from "./cameraSystem";
import collisionSystem from "./collisionSystem";

type System = (world: World, deltaSeconds: number) => void;

const systems = [areaSystem, playerSystem, physicsSystem, collisionSystem, cameraSystem, spriteSystem];

export default systems;
export { System };
