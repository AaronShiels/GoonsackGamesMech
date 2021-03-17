import {
	AnimatedSpriteSet,
	BodyComponent,
	createAnimatedSpriteSet,
	createBodyComponent,
	createPhysicsComponent,
	createSpriteComponent,
	PhysicsComponent,
	SpriteComponent
} from "../components";
import Vector from "../framework/Vector";

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

const cyborgSpriteSheetResource = "assets/cyborg/cyborg.json";
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

type Cyborg = BodyComponent & PhysicsComponent & SpriteComponent;

const createCyborg = (position: Vector): Cyborg => {
	const bodyComponent: BodyComponent = createBodyComponent();
	const physicsComponent: PhysicsComponent = createPhysicsComponent();
	const animatedSpriteSet: AnimatedSpriteSet = createAnimatedSpriteSet(cyborgSpriteSheetResource, animations, "attackdown");
	const spriteComponent: SpriteComponent = createSpriteComponent(animatedSpriteSet);

	return { ...bodyComponent, ...physicsComponent, ...spriteComponent, ...{ position } };
};

export { cyborgSpriteSheetResource, createCyborg };
