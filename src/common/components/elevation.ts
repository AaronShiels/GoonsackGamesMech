import { Vector } from "../utilities/vector.js";
import { BodyComponent } from "./body.js";

interface ElevationComponent extends BodyComponent {
	elevation: number;
	readonly perspectiveDisplacement: Vector;
	perspectiveScale: number;
}

const isElevated = (object: any): object is ElevationComponent => "elevation" in object && "perspectiveDisplacement" in object && "perspectiveScale" in object;

export { ElevationComponent, isElevated };
