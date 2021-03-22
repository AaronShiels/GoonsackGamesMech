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

enum Animation {
	AttackDown = "attackdown",
	AttackDownAlt = "attackdownalt",
	AttackLeft = "attackleft",
	AttackLeftAlt = "attackleftalt",
	AttackRight = "attackright",
	AttackRightAlt = "attackrightalt",
	AttackUp = "attackup",
	AttackUpAlt = "attackupalt",
	StandDown = "standdown",
	StandLeft = "standleft",
	StandRight = "standright",
	StandUp = "standup",
	WalkDown = "walkdown",
	WalkLeft = "walkleft",
	WalkRight = "walkright",
	WalkUp = "walkup"
}

const animations: { [key in Animation]: number } = {
	attackdown: 0.4,
	attackdownalt: 0.4,
	attackleft: 0.4,
	attackleftalt: 0.4,
	attackright: 0.4,
	attackrightalt: 0.4,
	attackup: 0.4,
	attackupalt: 0.4,
	standdown: 0.03,
	standleft: 0.03,
	standright: 0.03,
	standup: 0.03,
	walkdown: 0.4,
	walkleft: 0.4,
	walkright: 0.4,
	walkup: 0.4
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
		walking: false,
		...sprite
	};
};

export default Cyborg;
export { createCyborg };
