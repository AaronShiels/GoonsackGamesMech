import { Loader } from "pixi.js";
import { assets as cyborgAssets } from "../entities/Cyborg";

const loadAssets = (): Promise<void> => {
	const assets = cyborgAssets;

	return new Promise<void>((res) => Loader.shared.add(assets).load((_) => res()));
};

export { loadAssets };
