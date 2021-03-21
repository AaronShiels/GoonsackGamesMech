import World from "../framework/world";
import playerSystem from "./playerSystem";
import physicsSystem from "./physicsSystem";
import spriteSystem from "./spriteSystem";
import areaSystem from "./areaSystem";
import cameraSystem from "./cameraSystem";

type System = (world: World, deltaSeconds: number) => void;

const systems = [areaSystem, playerSystem, physicsSystem, cameraSystem, spriteSystem];

export default systems;
export { System };
