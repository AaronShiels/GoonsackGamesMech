import { Vector } from "../shapes";

interface PlayerComponent {
	direction: Vector;
	walking: { active: boolean; elapsed: number };
	attacking: { active: boolean; elapsed: number; counter: number };
	dashing: { active: boolean; elapsed: number };
}

const isPlayer = (object: any): object is PlayerComponent => "direction" in object;

export { PlayerComponent, isPlayer };
