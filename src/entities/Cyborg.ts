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
	cyborgattackdown: { animationSpeed: 0.4, loop: false },
	cyborgattackdownalt: { animationSpeed: 0.4, loop: false },
	cyborgattackleft: { animationSpeed: 0.4, loop: false },
	cyborgattackleftalt: { animationSpeed: 0.4, loop: false },
	cyborgattackright: { animationSpeed: 0.4, loop: false },
	cyborgattackrightalt: { animationSpeed: 0.4, loop: false },
	cyborgattackup: { animationSpeed: 0.4, loop: false },
	cyborgattackupalt: { animationSpeed: 0.4, loop: false },
	cyborgstanddown: { animationSpeed: 0.03, loop: true },
	cyborgstandleft: { animationSpeed: 0.03, loop: true },
	cyborgstandright: { animationSpeed: 0.03, loop: true },
	cyborgstandup: { animationSpeed: 0.03, loop: true },
	cyborgwalkdown: { animationSpeed: 0.4, loop: true },
	cyborgwalkleft: { animationSpeed: 0.4, loop: true },
	cyborgwalkright: { animationSpeed: 0.4, loop: true },
	cyborgwalkup: { animationSpeed: 0.4, loop: true }
};

const createCyborg = (position: Vector): Cyborg => {
	const spriteSheet = getResource(Resource.Cyborg).spritesheet;
	const offset = { x: 0, y: 2 };
	const animatedSpriteSet: AnimatedSpriteSet = createAnimatedSpriteSet(spriteSheet, animations, "cyborgattackdown", 2, offset);
	const sprite: SpriteComponent = createSpriteComponent(animatedSpriteSet);

	return {
		position,
		size: { x: 8, y: 12 },
		edges: { bottom: true, left: true, right: true, top: true },
		velocity: { x: 0, y: 0 },
		acceleration: { x: 0, y: 0 },
		isPlayer: true,
		direction: { x: 0, y: 0 },
		walking: { active: false },
		attacking: { active: false, elapsed: 0, counter: 0 },
		dashing: { active: false, elapsed: 0 },
		...sprite
	};
};

export { Cyborg, createCyborg };
