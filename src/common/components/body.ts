import { Entity } from "../entities/entity.js";
import { Rectangle } from "../utilities/rectangle.js";
import { Vector } from "../utilities/vector.js";

interface Edges {
	readonly bottom: boolean;
	readonly left: boolean;
	readonly right: boolean;
	readonly top: boolean;
}

interface BodyComponent extends Entity {
	readonly position: Vector;
	readonly size: Vector;
	readonly edges: Edges;
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
