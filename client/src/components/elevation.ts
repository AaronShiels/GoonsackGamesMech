import { Vector } from "../utilities";
import { BodyComponent } from "./body";

interface ElevationComponent extends BodyComponent {
	elevation: number;
	perspectiveDisplacement: Vector;
	perspectiveScale: number;
}

const isElevated = (object: any): object is ElevationComponent => "elevation" in object && "perspectiveDisplacement" in object && "perspectiveScale" in object;

export { ElevationComponent, isElevated };
