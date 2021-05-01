import { Vector } from "../utilities";
import { BodyComponent } from "./body";

interface PhysicsComponent extends BodyComponent {
	velocity: Vector;
	acceleration: Vector;
}

const hasPhysics = (object: any): object is PhysicsComponent => "velocity" in object && "acceleration" in object;

export { PhysicsComponent, hasPhysics };
