import BaseComponent, { isEntity } from "./BaseComponent";
import BodyComponent, { hasBody, getBounds, Edges, hasEdges } from "./BodyComponent";
import PhysicsComponent, { hasPhysics } from "./PhysicsComponent";
import PlayerComponent, { isPlayer } from "./PlayerComponent";
import SpriteComponent, {
	AnimatedSpriteSet,
	hasSprite,
	createSprite,
	createAnimatedSprite,
	createAnimatedSpriteSet,
	createSpriteComponent
} from "./SpriteComponent";

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
