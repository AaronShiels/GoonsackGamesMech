import { Loader, Texture } from "pixi.js";

const assets = {
	cyborg_stand_down: "assets/cyborg/stand_down.png"
};

const loadAssets = (): Promise<void> =>
	new Promise<void>((res) =>
		Loader.shared.add(Object.values(assets)).load((_) => res())
	);

const getTexture = (asset: string): Texture =>
	Loader.shared.resources[asset].texture;

export { assets, loadAssets, getTexture };
