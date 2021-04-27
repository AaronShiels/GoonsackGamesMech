import { Loader, LoaderResource } from "pixi.js";
import defaultMap from "./maps/default.json";

enum Resource {
	Mech = "mech",
	Map = "map"
}
const resourceLookup: Record<Resource, string> = {
	mech: "assets/black.png",
	map: "assets/maps/default.png"
};

const getResource = (resource: Resource): LoaderResource => Loader.shared.resources[resourceLookup[resource]];
const loadResources = (): Promise<void> =>
	new Promise<void>((res) => {
		const allResources = Object.values(resourceLookup);
		Loader.shared.add(allResources).load((_) => res());
	});

export { Resource, getResource, loadResources, defaultMap };
