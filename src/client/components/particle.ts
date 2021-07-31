import { PhysicsComponent } from "./physics";

interface Particle extends PhysicsComponent {
	remainingSeconds: number;
}

const hasLimitedLifespan = (object: any): object is Particle => "remainingSeconds" in object;

export { Particle, hasLimitedLifespan };
