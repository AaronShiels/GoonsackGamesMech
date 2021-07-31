import { AnimatedSprite } from "pixi.js";
import { getResource, Resource } from "../assets";
import { Edges, Particle } from "../components";
import { Vector } from "../utilities";

class ExplosionTiny extends AnimatedSprite implements Particle {
	constructor(position: Vector) {
		super(getResource(Resource.ExplosionTiny).spritesheet!.animations["explosion_tiny"]);

		this.position.set(position.x, position.y);
		this.anchor.set(0.5);
		this.animationSpeed = 2;
		this.autoUpdate = false;
		this.loop = false;
		this.play();
	}

	public remainingSeconds: number = 0.5;
	public readonly velocity: Vector = { x: 0, y: 0 };
	public readonly acceleration: Vector = { x: 0, y: 0 };
	public readonly friction: number = 0;
	public readonly size: Vector = { x: 0, y: 0 };
	public readonly edges: Edges = { bottom: false, left: false, right: false, top: false };
	public destroyed: boolean = false;
}

export { ExplosionTiny };
