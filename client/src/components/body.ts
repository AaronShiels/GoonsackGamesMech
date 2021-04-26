import { Entity } from "../entities";
import { Rectangle, Vector } from "../utilities";

interface Edges {
	bottom: boolean;
	left: boolean;
	right: boolean;
	top: boolean;
}

interface BodyComponent extends Entity {
	position: Vector;
	size: Vector;
	edges: Edges;
}

const hasBody = (object: any): object is BodyComponent => "position" in object && "size" in object && "edges" in object;
const hasEdges = (entity: BodyComponent): boolean => entity.edges.bottom || entity.edges.left || entity.edges.right || entity.edges.top;
const getBounds = (entity: BodyComponent): Rectangle => ({
	x: entity.position.x - entity.size.x / 2,
	y: entity.position.y - entity.size.y / 2,
	width: entity.size.x,
	height: entity.size.y
});

export { BodyComponent, Edges, hasBody, hasEdges, getBounds };
