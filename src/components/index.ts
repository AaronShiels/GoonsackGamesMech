import Vector from "../framework/Vector";

interface Entity extends Vector {}

interface Body extends Entity {
	size: Vector;
}

const isBody = (object: Entity): object is Body => "size" in object;

interface MovingBody extends Body {
	velocity: Vector;
	acceleration: Vector;
}

const isMovingBody = (object: Entity): object is MovingBody =>
	"velocity" in object && "acceleration" in object;

export { Entity, Body, isBody, MovingBody, isMovingBody };
