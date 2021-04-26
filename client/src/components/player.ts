import { Entity } from "../entities";
import { Vector } from "../utilities";

interface PlayerComponent extends Entity {
	isPlayer: true;
	direction: Vector;
	walking: { active: boolean };
	attacking: { active: boolean; elapsed: number; counter: number; minimumAngle: number; maximumAngle: number; radius: number };
	dashing: { active: boolean; elapsed: number };
}

const isPlayer = (object: any): object is PlayerComponent => !!object.isPlayer;

export { PlayerComponent, isPlayer };
