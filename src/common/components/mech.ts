import { Vector } from "../utilities/vector.js";
import { BodyComponent } from "./body.js";

interface MechComponent extends BodyComponent {
	readonly leftArm: MechSubComponent;
	readonly rightArm: MechSubComponent;
	readonly torso: MechSubComponent;
}

interface MechSubComponent {
	direction: number;
	readonly position: Vector;
}

const isMech = (object: any): object is MechComponent => "leftArm" in object && "rightArm" in object && "torso" in object;

export { MechComponent, isMech };
