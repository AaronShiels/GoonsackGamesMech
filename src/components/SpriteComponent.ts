import { AnimatedSprite, Loader, Sprite, Spritesheet, Texture } from "pixi.js";
import BaseComponent from "./BaseComponent";

interface SpriteComponent extends BaseComponent {
	sprite: Sprite | AnimatedSprite | AnimatedSpriteSet;
}

const hasSprite = (object: any): object is SpriteComponent => "sprite" in object;

interface AnimatedSpriteDefinition {
	textures: Texture[];
	animationSpeed: number;
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

		const { textures, animationSpeed } = this._animatedSpriteDefinition[animation];
		if (!textures || !animationSpeed) throw new Error(`Invalid animation ${animation}.`);

		this._currentAnimation = animation;

		super.textures = textures;
		super.animationSpeed = animationSpeed;
		super.play();
	}
}

const createSprite = (texture: Texture, zIndex: number = 0): Sprite => {
	const sprite = new Sprite(texture);
	sprite.anchor.set(0.5);
	sprite.zIndex = zIndex;

	return sprite;
};

const createAnimatedSprite = (spriteSheet: Spritesheet | undefined, animationName: string, animationSpeed: number, zIndex: number = 0): AnimatedSprite => {
	if (!spriteSheet || !spriteSheet.animations) throw new Error(`Invalid sprite sheet ${spriteSheet}.`);

	const textures: Texture[] = spriteSheet.animations[animationName];
	if (!textures) throw new Error(`Invalid animation ${animationName} in ${spriteSheet}.`);

	const animatedSprite = new AnimatedSprite(textures);
	animatedSprite.animationSpeed = animationSpeed;
	animatedSprite.play();

	animatedSprite.anchor.set(0.5);
	animatedSprite.autoUpdate = false;
	animatedSprite.zIndex = zIndex;

	return animatedSprite;
};

const createAnimatedSpriteSet = (
	spriteSheet: Spritesheet | undefined,
	animationDefinitions: { [key: string]: number },
	defaultAnimationName?: string,
	zIndex: number = 0
): AnimatedSpriteSet => {
	if (!spriteSheet || !spriteSheet.animations) throw new Error(`Invalid sprite sheet ${spriteSheet}.`);

	const animations: { [key: string]: Texture[] } = spriteSheet.animations;
	const animatedSpriteDefinitions = Object.entries(animations).reduce<Record<string, AnimatedSpriteDefinition>>((cumm, [animationName, textures]) => {
		const animationSpeed = animationDefinitions[animationName];
		if (!animationSpeed) throw new Error(`Invalid speed for animation ${animationName}.`);

		cumm[animationName] = { textures, animationSpeed };
		return cumm;
	}, {});

	const animatedSpriteSet = new AnimatedSpriteSet(animatedSpriteDefinitions);
	animatedSpriteSet.play(defaultAnimationName);

	animatedSpriteSet.anchor.set(0.5);
	animatedSpriteSet.autoUpdate = false;
	animatedSpriteSet.zIndex = zIndex;

	return animatedSpriteSet;
};

const createSpriteComponent = (sprite: Sprite | AnimatedSprite | AnimatedSpriteSet): SpriteComponent => ({ sprite, destroyed: false });

export default SpriteComponent;
export { AnimatedSpriteSet, hasSprite, createSprite, createAnimatedSprite, createAnimatedSpriteSet, createSpriteComponent };
