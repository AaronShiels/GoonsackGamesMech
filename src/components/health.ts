interface HealthComponent {
	hitpoints: number;
	lastHitTimestamp: number;
}

const hasHealth = (object: any): object is HealthComponent => "hitpoints" in object;

export { HealthComponent, hasHealth };
