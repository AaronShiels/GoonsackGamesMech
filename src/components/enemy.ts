import { BaseComponent } from ".";
import { Vector } from "../shapes";

interface EnemyComponent extends BaseComponent {
	isEnemy: true;
	direction: Vector;
	walking: { active: boolean };
}

const isEnemy = (object: any): object is EnemyComponent => !!object.isEnemy;

export { EnemyComponent, isEnemy };
