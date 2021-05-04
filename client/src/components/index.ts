import { hasBody, getBounds, Edges, hasEdges, BodyComponent } from "./body";
import { EnemyComponent, isEnemy } from "./enemy";
import { HealthComponent, hasHealth } from "./health";
import { hasPhysics, PhysicsComponent } from "./physics";
import { isPlayer, PlayerComponent } from "./player";
import { SpriteComponent, hasSprite } from "./sprite";

export {
	BodyComponent,
	Edges,
	hasBody,
	hasEdges,
	getBounds,
	PhysicsComponent,
	hasPhysics,
	SpriteComponent,
	hasSprite,
	PlayerComponent,
	isPlayer,
	EnemyComponent,
	isEnemy,
	HealthComponent,
	hasHealth
};
