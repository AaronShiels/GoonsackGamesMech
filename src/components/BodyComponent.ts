import Vector from "../framework/Vector";
import BaseComponent from "./BaseComponent";

interface BodyComponent extends BaseComponent {
	position: Vector;
	size: Vector;
}

const hasBody = (object: any): object is BodyComponent => "position" in object && "size" in object;
const createBodyComponent = (): BodyComponent => ({ position: { x: 0, y: 0 }, size: { x: 0, y: 0 }, destroyed: false });

export default BodyComponent;
export { hasBody, createBodyComponent };
