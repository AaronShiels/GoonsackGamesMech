import { Sprite } from "pixi.js";
import { getResource, Resource } from "../assets";
import { Side, Vector } from ".";

class ReticleHemisphere extends Sprite {
	constructor(side: Side, position: Vector) {
		super(getResource(Resource.HUD).spritesheet!.textures["reticle_hemisphere.png"]);

		this.anchor.set(1, 0.5);
		this.scale.x = side === Side.Left ? 1 : -1;
		this.zIndex = 10;

		this.position.x = position.x;
		this.position.y = position.y;
	}
}

class ReticlePointer extends Sprite {
	constructor(position: Vector) {
		super(getResource(Resource.HUD).spritesheet!.textures["reticle_pointer.png"]);

		this.anchor.set(0.5);
		this.zIndex = 10;

		this.position.x = position.x;
		this.position.y = position.y;
	}
}

export { ReticleHemisphere, ReticlePointer };
