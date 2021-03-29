import {
	AnimatedSpriteSet,
	BodyComponent,
	createAnimatedSpriteSet,
	createSpriteComponent,
	PhysicsComponent,
	SpriteComponent,
	PlayerComponent
} from "../components";
import { getResource, Resource } from "../framework/resources";
import { Vector } from "../shapes";

type Cyborg = BodyComponent & PhysicsComponent & SpriteComponent & PlayerComponent;

const animations: { [key: string]: { animationSpeed: number; loop: boolean } } = {
	attackdown: { animationSpeed: 0.4, loop: false },
	attackdownalt: { animationSpeed: 0.4, loop: false },
	attackleft: { animationSpeed: 0.4, loop: false },
	attackleftalt: { animationSpeed: 0.4, loop: false },
	attackright: { animationSpeed: 0.4, loop: false },
	attackrightalt: { animationSpeed: 0.4, loop: false },
	attackup: { animationSpeed: 0.4, loop: false },
	attackupalt: { animationSpeed: 0.4, loop: false },
	standdown: { animationSpeed: 0.03, loop: true },
	standleft: { animationSpeed: 0.03, loop: true },
	standright: { animationSpeed: 0.03, loop: true },
	standup: { animationSpeed: 0.03, loop: true },
	walkdown: { animationSpeed: 0.4, loop: true },
	walkleft: { animationSpeed: 0.4, loop: true },
	walkright: { animationSpeed: 0.4, loop: true },
	walkup: { animationSpeed: 0.4, loop: true }
};

const createCyborg = (position: Vector): Cyborg => {
	const spriteSheet = getResource(Resource.Cyborg).spritesheet;
	const offset = { x: 0, y: 2 };
	const animatedSpriteSet: AnimatedSpriteSet = createAnimatedSpriteSet(spriteSheet, animations, "attackdown", 2, offset);
	const sprite: SpriteComponent = createSpriteComponent(animatedSpriteSet);

	return {
		position,
		size: { x: 8, y: 12 },
		edges: { bottom: true, left: true, right: true, top: true },
		velocity: { x: 0, y: 0 },
		acceleration: { x: 0, y: 0 },
		direction: { x: 0, y: 0 },
		walking: { active: false, elapsed: 0 },
		attacking: { active: false, elapsed: 0, counter: 0 },
		dashing: { active: false, elapsed: 0 },
		...sprite
	};
};

export { Cyborg, createCyborg };
