import { AnimatedSprite, Loader, Sprite, Texture } from "pixi.js";
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

const createSprite = (textureResource: string): Sprite => new Sprite(Loader.shared.resources[textureResource].texture);

const createAnimatedSprite = (spriteSheetResource: string, animationName: string, animationSpeed: number): AnimatedSprite => {
	const spriteSheet = Loader.shared.resources[spriteSheetResource].spritesheet;
	if (!spriteSheet || !spriteSheet.animations) throw new Error(`Invalid sprite sheet ${spriteSheetResource}.`);

	const textures: Texture[] = spriteSheet.animations[animationName];
	if (!textures) throw new Error(`Invalid animation ${animationName} in ${spriteSheetResource}.`);

	const animatedSprite = new AnimatedSprite(textures);
	animatedSprite.animationSpeed = animationSpeed;
	animatedSprite.play();

	return animatedSprite;
};

const createAnimatedSpriteSet = (
	spriteSheetResource: string,
	animationDefinitions: { [key: string]: number },
	defaultAnimationName?: string
): AnimatedSpriteSet => {
	const spriteSheet = Loader.shared.resources[spriteSheetResource].spritesheet;
	if (!spriteSheet || !spriteSheet.animations) throw new Error(`Invalid sprite sheet ${spriteSheetResource}.`);

	const animations: { [key: string]: Texture[] } = spriteSheet.animations;
	const animatedSpriteDefinitions = Object.entries(animations).reduce<Record<string, AnimatedSpriteDefinition>>((cumm, [animationName, textures]) => {
		const animationSpeed = animationDefinitions[animationName];
		if (!animationSpeed) throw new Error(`Invalid speed for animation ${animationName}`);

		cumm[animationName] = { textures, animationSpeed };
		return cumm;
	}, {});

	const animatedSpriteSet = new AnimatedSpriteSet(animatedSpriteDefinitions);
	animatedSpriteSet.play(defaultAnimationName);

	return animatedSpriteSet;
};

const createSpriteComponent = (sprite: Sprite | AnimatedSprite | AnimatedSpriteSet): SpriteComponent => ({ sprite, destroyed: false });

export default SpriteComponent;
export { AnimatedSpriteSet, hasSprite, createSprite, createAnimatedSprite, createAnimatedSpriteSet, createSpriteComponent };
