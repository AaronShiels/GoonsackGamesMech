import { Graphics } from "pixi.js";
import { Edges, Particle } from "../components";
import { Vector } from "../utilities";

class CannonBullet extends Graphics implements Particle {
	constructor(position: Vector, velocity: Vector, direction: number) {
		super();

		this.beginFill(0xf7dea0);
		this.drawEllipse(0, 0, 6, 1);
		this.endFill();

		this.position.set(position.x, position.y);
		this.velocity = velocity;
		this.rotation = direction;
	}

	public remainingSeconds: number = 1;
	public readonly velocity: Vector;
	public readonly acceleration: Vector = { x: 0, y: 0 };
	public friction: number = 0;
	public readonly size: Vector = { x: 2, y: 2 };
	public readonly edges: Edges = { bottom: false, left: false, right: false, top: false };
	public destroyed: boolean = false;
}

export { CannonBullet };
