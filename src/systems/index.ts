import World from "../framework/world";
import playerSystem from "./playerSystem";
import physicsSystem from "./physicsSystem";
import spriteSystem from "./spriteSystem";

type System = (world: World, deltaSeconds: number) => void;

const systems = [playerSystem, physicsSystem, spriteSystem];

export default systems;
export { System };
