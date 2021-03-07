import World from "../framework/World";
import physicsSystem from "./physicsSystem";

type System = (world: World, delta: number) => void;

const systems = [physicsSystem];
const runSystems = (world: World, delta: number): void =>
	systems.forEach((system) => system(world, delta));

export { System, runSystems };
