import { AnimatedSprite, Texture } from "pixi.js";
import { MovingBody } from "../components";
import Vector from "../framework/Vector";

class Cyborg extends AnimatedSprite implements MovingBody {
	constructor() {
		const standDownTextures = standDownAnimationFrames.map((f) => Texture.from(f));

		super(standDownTextures);

		this.anchor.set(0.5);
		this.size = { x: 0, y: 0 };
		this.velocity = { x: 0.2, y: 0 };
		this.acceleration = { x: 0, y: 0 };
		this.animationSpeed = 0.05;
		this.play();
	}

	size: Vector;
	velocity: Vector;
	acceleration: Vector;
}

const standDownAnimationFrames: string[] = ["assets/cyborg/stand_down_1.png", "assets/cyborg/stand_down_2.png"];
const assets = standDownAnimationFrames;

export default Cyborg;
export { assets };
