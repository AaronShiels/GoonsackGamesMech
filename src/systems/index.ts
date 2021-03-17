import World from "../framework/world";
import physicsSystem from "./physicsSystem";
import spriteSystem from "./spriteSystem";

type System = (world: World, delta: number) => void;

const systems = [physicsSystem, spriteSystem];

export default systems;
export { System };
