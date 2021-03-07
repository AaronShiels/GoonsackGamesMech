import { Sprite } from "pixi.js";
import { MovingBody } from "../components";
import { assets, getTexture } from "../framework/assets";
import Vector from "../framework/Vector";

class Cyborg extends Sprite implements MovingBody {
	constructor() {
		const texture = getTexture(assets.cyborg_stand_down);
		super(texture);

		this.size = { x: 0, y: 0 };
		this.velocity = { x: 1, y: 0 };
		this.acceleration = { x: 0, y: 0 };
	}

	size: Vector;
	velocity: Vector;
	acceleration: Vector;
}

export default Cyborg;
