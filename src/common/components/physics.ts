import { Vector } from "../utilities/vector.js";
import { BodyComponent } from "./body.js";

interface PhysicsComponent extends BodyComponent {
	readonly velocity: Vector;
	readonly acceleration: Vector;
	readonly friction: number;
}

const hasPhysics = (object: any): object is PhysicsComponent => "velocity" in object && "acceleration" in object && "friction" in object;

export { PhysicsComponent, hasPhysics };
