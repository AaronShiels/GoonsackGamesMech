import { BaseComponent, isEntity } from "./base";
import { hasBody, getBounds, Edges, hasEdges, BodyComponent } from "./body";
import { hasPhysics, PhysicsComponent } from "./physics";
import { isPlayer, PlayerComponent } from "./player";
import { AnimatedSpriteSet, hasSprite, createSprite, createAnimatedSprite, createAnimatedSpriteSet, createSpriteComponent, SpriteComponent } from "./sprite";

export {
	BaseComponent,
	isEntity,
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
	isPlayer
};
