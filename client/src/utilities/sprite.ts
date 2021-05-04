import { AnimatedSprite, Spritesheet } from "pixi.js";

class AnimatedSpriteCollection extends AnimatedSprite {
	private _spriteSheet: Spritesheet;

	constructor(spriteSheet: Spritesheet) {
		super(spriteSheet.animations[Object.keys(spriteSheet.animations)[0]]);

		this._spriteSheet = spriteSheet;
		this.currentAnimation = Object.keys(spriteSheet.animations)[0];
	}

	public currentAnimation: string;

	play(animation?: string): void {
		if (!animation || !this._spriteSheet.animations[animation] || !this._spriteSheet.animations[animation].length)
			throw new Error(`Invalid animation \"${animation}\".`);

		this.currentAnimation = animation;
		super.textures = this._spriteSheet.animations[animation];
		super.play();
	}
}

export { AnimatedSpriteCollection };
