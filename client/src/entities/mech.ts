import { Sprite } from "pixi.js";
import { BodyComponent, PhysicsComponent, SpriteComponent, PlayerComponent } from "../components";
import { getResource, Resource } from "../assets";
import { Vector } from "../utilities";

type Mech = BodyComponent & PhysicsComponent & SpriteComponent & PlayerComponent;

const createMech = (position: Vector): Mech => {
	const sprite = new Sprite(getResource(Resource.Mech).texture);
	sprite.anchor.set(0.5);

	return {
		destroyed: false,
		position,
		size: { x: 16, y: 16 },
		edges: { bottom: true, left: true, right: true, top: true },
		velocity: { x: 0, y: 0 },
		acceleration: { x: 0, y: 0 },
		isPlayer: true,
		direction: { x: 0, y: 0 },
		walking: { active: false },
		sprite
	};
};

export { createMech };
