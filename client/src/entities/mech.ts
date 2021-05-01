import { PhysicsComponent, SpriteComponent, PlayerComponent, AnimatedSpriteCollection } from "../components";
import { getResource, Resource } from "../assets";
import { Vector } from "../utilities";

type Mech = PhysicsComponent & SpriteComponent & PlayerComponent;

const createMech = (position: Vector): Mech => {
	const spritesheet = getResource(Resource.Mech).spritesheet!;
	const sprite = new AnimatedSpriteCollection(spritesheet);
	sprite.anchor.set(0.5);
	sprite.play("mech_0");

	return {
		destroyed: false,
		position,
		size: { x: 32, y: 32 },
		edges: { bottom: true, left: true, right: true, top: true },
		velocity: { x: 0, y: 0 },
		acceleration: { x: 0, y: 0 },
		isPlayer: true,
		direction: 0,
		sprite
	};
};

export { createMech };
