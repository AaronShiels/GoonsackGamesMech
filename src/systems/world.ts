import { defaultMap } from "../assets/index.js";
import { createBuilding } from "../entities/building.js";
import { Mech } from "../entities/mech.js";
import { Tile } from "../entities/tile.js";
import { generateObjectData, generateTileData } from "../utilities/map.js";
import { Initialiser } from "./system.js";

const worldInit: Initialiser = (game) => {
	const tiles = generateTileData(defaultMap, "ground").map((td) => new Tile(td));
	const buildings = generateObjectData(defaultMap, "buildings").flatMap((od) => createBuilding(od));
	const mech = new Mech();
	mech.position.x = 80;
	mech.position.y = 120;

	game.world.addChild(...tiles, ...buildings, mech);
};

export { worldInit };
