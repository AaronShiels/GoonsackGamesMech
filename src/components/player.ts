import { BaseComponent } from ".";
import { Vector } from "../shapes";

interface PlayerComponent extends BaseComponent {
	isPlayer: true;
	direction: Vector;
	walking: { active: boolean };
	attacking: { active: boolean; elapsed: number; counter: number };
	dashing: { active: boolean; elapsed: number };
}

const isPlayer = (object: any): object is PlayerComponent => !!object.isPlayer;

export { PlayerComponent, isPlayer };
