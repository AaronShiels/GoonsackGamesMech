import { Entity } from "../entities";

interface PlayerComponent extends Entity {
	isPlayer: true;
	direction: number;
}

const isPlayer = (object: any): object is PlayerComponent => !!object.isPlayer;

export { PlayerComponent, isPlayer };
