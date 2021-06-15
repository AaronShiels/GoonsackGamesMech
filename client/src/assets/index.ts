import { Loader, LoaderResource } from "pixi.js";
import defaultMap from "./maps/map.json";

enum Resource {
	Mech = "mech",
	Building = "building",
	HUD = "hud",
	Map = "map"
}
const resourceLookup: Record<Resource, string> = {
	mech: "assets/mech/mech.json",
	building: "assets/building/building.json",
	hud: "assets/hud/hud.json",
	map: "assets/maps/map.png"
};

const getResource = (resource: Resource): LoaderResource => Loader.shared.resources[resourceLookup[resource]];
const loadResources = (): Promise<void> =>
	new Promise<void>((res) => {
		const allResources = Object.values(resourceLookup);
		Loader.shared.add(allResources).load((_) => res());
	});

export { Resource, getResource, loadResources, defaultMap };
