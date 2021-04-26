import { Entity } from "../entities";
import { Vector } from "../utilities";

interface PhysicsComponent extends Entity {
	velocity: Vector;
	acceleration: Vector;
}

const hasPhysics = (object: any): object is PhysicsComponent => "velocity" in object && "acceleration" in object;

export { PhysicsComponent, hasPhysics };
