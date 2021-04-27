import { Entity } from "../entities";
import { Vector } from "../utilities";

interface PlayerComponent extends Entity {
	isPlayer: true;
	direction: Vector;
	walking: { active: boolean };
}

const isPlayer = (object: any): object is PlayerComponent => !!object.isPlayer;

export { PlayerComponent, isPlayer };
