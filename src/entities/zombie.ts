import {
	BodyComponent,
	PhysicsComponent,
	SpriteComponent,
	AnimatedSpriteSet,
	createAnimatedSpriteSet,
	createSpriteComponent,
	EnemyComponent,
	HealthComponent
} from "../components";
import { getResource, Resource } from "../framework/resources";
import { Vector } from "../shapes";

type Zombie = BodyComponent & PhysicsComponent & SpriteComponent & EnemyComponent & HealthComponent;

const animations: { [key: string]: { animationSpeed: number; loop: boolean } } = {
	zombiestanddown: { animationSpeed: 0.03, loop: true },
	zombiestandleft: { animationSpeed: 0.03, loop: true },
	zombiestandright: { animationSpeed: 0.03, loop: true },
	zombiestandup: { animationSpeed: 0.03, loop: true },
	zombiewalkdown: { animationSpeed: 0.2, loop: true },
	zombiewalkleft: { animationSpeed: 0.2, loop: true },
	zombiewalkright: { animationSpeed: 0.2, loop: true },
	zombiewalkup: { animationSpeed: 0.2, loop: true }
};

const createZombie = (position: Vector): Zombie => {
	const spriteSheet = getResource(Resource.Zombie).spritesheet;
	const offset = { x: 0, y: 2 };
	const animatedSpriteSet: AnimatedSpriteSet = createAnimatedSpriteSet(spriteSheet, animations, "zombiewalkdown", 2, offset);
	const sprite: SpriteComponent = createSpriteComponent(animatedSpriteSet);

	return {
		position,
		size: { x: 8, y: 12 },
		edges: { bottom: true, left: true, right: true, top: true },
		velocity: { x: 0, y: 0 },
		acceleration: { x: 0, y: 0 },
		isEnemy: true,
		direction: { x: 0, y: 0 },
		walking: { active: false },
		hitpoints: 3,
		lastHitTimestamp: 0,
		...sprite
	};
};

export { Zombie, createZombie };
