import { AnimatedSprite, Sprite, Spritesheet, Texture } from "pixi.js";
import { add, divide, Vector } from "../shapes";
import { BaseComponent } from ".";

interface SpriteComponent extends BaseComponent {
	sprite: Sprite | AnimatedSprite | AnimatedSpriteSet;
}

const hasSprite = (object: any): object is SpriteComponent => "sprite" in object;

interface AnimatedSpriteDefinition {
	textures: Texture[];
	animationSpeed: number;
	loop: boolean;
}

class AnimatedSpriteSet extends AnimatedSprite {
	private _animatedSpriteDefinition: Record<string, AnimatedSpriteDefinition> = {};
	private _currentAnimation: string = "";

	constructor(animatedSpriteDefinitions: Record<string, AnimatedSpriteDefinition>) {
		super(animatedSpriteDefinitions[Object.keys(animatedSpriteDefinitions)[0]].textures);

		this._animatedSpriteDefinition = animatedSpriteDefinitions;
	}

	play(animation?: string): void {
		if (!animation || animation == this._currentAnimation) return;

		const { textures, animationSpeed, loop } = this._animatedSpriteDefinition[animation];
		if (!textures || !animationSpeed) throw new Error(`Invalid animation ${animation}.`);

		this._currentAnimation = animation;

		super.textures = textures;
		super.animationSpeed = animationSpeed;
		super.loop = loop;
		super.play();
	}
}

const getAnchor = (textureDimensions: Vector, centreOffset: Vector): Vector => {
	const textureCentre = divide(textureDimensions, 2);
	const adjustedTextureCentre = add(textureCentre, centreOffset);
	const anchor = divide(adjustedTextureCentre, textureDimensions);

	return anchor;
};

const createSprite = (texture: Texture, zIndex: number = 0, centreOffset: Vector = { x: 0, y: 0 }): Sprite => {
	const sprite = new Sprite(texture);

	const anchor = getAnchor({ x: texture.width, y: texture.height }, centreOffset);
	sprite.anchor.set(anchor.x, anchor.y);
	sprite.zIndex = zIndex;

	return sprite;
};

const createAnimatedSprite = (
	spriteSheet: Spritesheet | undefined,
	animationName: string,
	animationSpeed: number,
	zIndex: number = 0,
	centreOffset: Vector = { x: 0, y: 0 }
): AnimatedSprite => {
	if (!spriteSheet || !spriteSheet.animations) throw new Error(`Invalid sprite sheet ${spriteSheet}.`);

	const textures: Texture[] = spriteSheet.animations[animationName];
	if (!textures) throw new Error(`Invalid animation ${animationName} in ${spriteSheet}.`);

	const animatedSprite = new AnimatedSprite(textures);
	animatedSprite.animationSpeed = animationSpeed;
	animatedSprite.play();

	const anchor = getAnchor({ x: textures[0].width, y: textures[0].height }, centreOffset);
	animatedSprite.anchor.set(anchor.x, anchor.y);
	animatedSprite.autoUpdate = false;
	animatedSprite.zIndex = zIndex;

	return animatedSprite;
};

const createAnimatedSpriteSet = (
	spriteSheet: Spritesheet | undefined,
	animationDefinitions: { [key: string]: { animationSpeed: number; loop: boolean } },
	defaultAnimationName?: string,
	zIndex: number = 0,
	centreOffset: Vector = { x: 0, y: 0 }
): AnimatedSpriteSet => {
	if (!spriteSheet || !spriteSheet.animations) throw new Error(`Invalid sprite sheet ${spriteSheet}.`);

	const animations: { [key: string]: Texture[] } = spriteSheet.animations;
	const animatedSpriteDefinitions = Object.entries(animations).reduce<Record<string, AnimatedSpriteDefinition>>((cumm, [animationName, textures]) => {
		const animationSpeed = animationDefinitions[animationName].animationSpeed;
		if (!animationSpeed) throw new Error(`Invalid speed for animation ${animationName}.`);
		const loop = animationDefinitions[animationName].loop;

		cumm[animationName] = { textures, animationSpeed, loop };
		return cumm;
	}, {});

	const animatedSpriteSet = new AnimatedSpriteSet(animatedSpriteDefinitions);
	animatedSpriteSet.play(defaultAnimationName);

	if (animatedSpriteSet.textures[0] instanceof Texture) {
		const anchor = getAnchor({ x: animatedSpriteSet.textures[0].width, y: animatedSpriteSet.textures[0].height }, centreOffset);
		animatedSpriteSet.anchor.set(anchor.x, anchor.y);
	} else {
		animatedSpriteSet.anchor.set(0.5);
	}
	animatedSpriteSet.autoUpdate = false;
	animatedSpriteSet.zIndex = zIndex;

	return animatedSpriteSet;
};

const createSpriteComponent = (sprite: Sprite | AnimatedSprite | AnimatedSpriteSet): SpriteComponent => ({ sprite, destroyed: false });

export { SpriteComponent, AnimatedSpriteSet, hasSprite, createSprite, createAnimatedSprite, createAnimatedSpriteSet, createSpriteComponent };
