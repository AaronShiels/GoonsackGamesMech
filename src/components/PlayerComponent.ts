import { Vector } from "../shapes";

interface PlayerComponent {
	direction: Vector;
	walking: boolean;
}

const isPlayer = (object: any): object is PlayerComponent => "direction" in object;

export default PlayerComponent;
export { isPlayer };
