import { hasBody, getBounds, Edges, hasEdges, BodyComponent } from "./body";
import { EnemyComponent, isEnemy } from "./enemy";
import { HealthComponent, hasHealth } from "./health";
import { hasPhysics, PhysicsComponent } from "./physics";
import { isPlayer, PlayerComponent } from "./player";
import { AnimatedSpriteSet, hasSprite, createSprite, createAnimatedSprite, createAnimatedSpriteSet, createSpriteComponent, SpriteComponent } from "./sprite";

export {
	BodyComponent,
	Edges,
	hasBody,
	hasEdges,
	getBounds,
	PhysicsComponent,
	hasPhysics,
	SpriteComponent,
	AnimatedSpriteSet,
	hasSprite,
	createSprite,
	createAnimatedSprite,
	createAnimatedSpriteSet,
	createSpriteComponent,
	PlayerComponent,
	isPlayer,
	EnemyComponent,
	isEnemy,
	HealthComponent,
	hasHealth
};
