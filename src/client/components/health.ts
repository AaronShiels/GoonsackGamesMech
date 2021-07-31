import { Entity } from "../entities";

interface HealthComponent extends Entity {
	hitpoints: number;
	lastHitTimestamp: number;
}

const hasHealth = (object: any): object is HealthComponent => "hitpoints" in object && "lastHitTimestamp" in object;

export { HealthComponent, hasHealth };
