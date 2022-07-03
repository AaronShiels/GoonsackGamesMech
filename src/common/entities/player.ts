import { PhysicsComponent } from "../components/physics.js";
import { Entity } from "./entity.js";

interface PlayerEntity extends Entity, PhysicsComponent {
	type: "player";
}

export { PlayerEntity };
