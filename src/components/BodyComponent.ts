import { Rectangle, Vector } from "../shapes";
import BaseComponent from "./BaseComponent";

interface Edges {
	down: boolean;
	left: boolean;
	right: boolean;
	up: boolean;
}

interface BodyComponent extends BaseComponent {
	position: Vector;
	size: Vector;
	edges: Edges;
}

const hasBody = (object: any): object is BodyComponent => "position" in object && "size" in object;
const getBounds = (entity: BodyComponent): Rectangle => ({ ...entity.position, width: entity.size.x, height: entity.size.y });

export default BodyComponent;
export { Edges, hasBody, getBounds };
