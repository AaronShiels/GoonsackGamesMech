import { Initialiser } from ".";
import { defaultMap } from "../assets";
import { Tile, createBuilding, Mech } from "../entities";
import { generateObjectData, generateTileData } from "../utilities";

const worldInit: Initialiser = (game) => {
	const tiles = generateTileData(defaultMap, "ground").map((td) => new Tile(td));
	const buildings = generateObjectData(defaultMap, "buildings").flatMap((od) => createBuilding(od));
	const mech = new Mech({ x: 80, y: 120 });

	game.world.addChild(...tiles, ...buildings, mech);
};

export { worldInit };
