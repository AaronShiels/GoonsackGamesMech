import { Entity } from "../entities";
import { Vector } from "../utilities";

interface EnemyComponent extends Entity {
	isEnemy: true;
	direction: Vector;
	walking: { active: boolean };
}

const isEnemy = (object: any): object is EnemyComponent => !!object.isEnemy;

export { EnemyComponent, isEnemy };
