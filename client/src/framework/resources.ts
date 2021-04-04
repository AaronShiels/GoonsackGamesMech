import { Loader, LoaderResource } from "pixi.js";
import * as demoMap from "../assets/maps/demo_map.json";

enum Resource {
	Cyborg = "cyborg",
	DemoMap = "demoMap",
	Zombie = "zombie"
}
const resourceLookup: Record<Resource, string> = {
	cyborg: "assets/cyborg/cyborg.json",
	demoMap: `assets/maps/${demoMap.tilesets[0].image}`,
	zombie: "assets/zombie/zombie.json"
};

const getResource = (resource: Resource): LoaderResource => Loader.shared.resources[resourceLookup[resource]];
const loadResources = (): Promise<void> =>
	new Promise<void>((res) => {
		const allResources = Object.values(resourceLookup);
		Loader.shared.add(allResources).load((_) => res());
	});

export { Resource, getResource, loadResources };
