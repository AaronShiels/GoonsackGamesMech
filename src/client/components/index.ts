import { hasBody, getBounds, Edges, hasEdges, BodyComponent } from "./body";
import { ElevationComponent, isElevated } from "./elevation";
import { EnemyComponent, isEnemy } from "./enemy";
import { HealthComponent, hasHealth } from "./health";
import { Particle, hasLimitedLifespan } from "./particle";
import { hasPhysics, PhysicsComponent } from "./physics";

export {
	BodyComponent,
	Edges,
	hasBody,
	hasEdges,
	getBounds,
	PhysicsComponent,
	hasPhysics,
	EnemyComponent,
	isEnemy,
	HealthComponent,
	hasHealth,
	ElevationComponent,
	isElevated,
	Particle,
	hasLimitedLifespan
};
