import { getResource, Resource } from "../assets";
import { Tile } from "../entities";

interface TileMap {
	layers: TileLayer[];
	tilesets: TileSet[];
	tilewidth: number;
	tileheight: number;
}

interface TileLayer {
	name: string;
	type: string;
	data: number[];
	width: number;
	height: number;
}

interface TileSet {
	columns: number;
	tilewidth: number;
	tileheight: number;
}

const createMapTiles = (map: TileMap, layer: string, solid: boolean, zIndex: number = 0): Tile[] => {
	const tilesLayer = map.layers.filter((l) => l.name === layer)[0];
	const tileSet = map.tilesets[0];
	const textureAtlas = getResource(Resource.Map).texture;

	if (!tilesLayer || tilesLayer.type !== "tilelayer" || !tilesLayer.data || !tilesLayer.width || !tilesLayer.height)
		throw new Error("Invalid layer provided.");

	const tiles: Tile[] = [];
	for (let yIndex = 0; yIndex < tilesLayer.height; yIndex++)
		for (let xIndex = 0; xIndex < tilesLayer.width; xIndex++) {
			const tileBounds = {
				x: xIndex * map.tilewidth,
				y: yIndex * map.tileheight,
				width: map.tilewidth,
				height: map.tileheight
			};

			const index = xIndex + yIndex * tilesLayer.width;
			const tileValue = tilesLayer.data[index];
			if (!tileValue) continue;

			const textureAtlasIndex = tileValue - 1;
			const textureAtlasX = (textureAtlasIndex % tileSet.columns) * tileSet.tilewidth;
			const textureAtlasY = Math.trunc(textureAtlasIndex / tileSet.columns) * tileSet.tileheight;
			const textureAtlasFrame = {
				x: textureAtlasX,
				y: textureAtlasY,
				width: tileSet.tilewidth,
				height: tileSet.tileheight
			};

			const edges = { bottom: true, left: true, right: true, top: true };
			if (!solid || (yIndex < tilesLayer.height - 1 && tilesLayer.data[xIndex + (yIndex + 1) * tilesLayer.width])) edges.bottom = false;
			if (!solid || (xIndex > 0 && tilesLayer.data[xIndex - 1 + yIndex * tilesLayer.width])) edges.left = false;
			if (!solid || (xIndex < tilesLayer.width - 1 && tilesLayer.data[xIndex + 1 + yIndex * tilesLayer.width])) edges.right = false;
			if (!solid || (yIndex > 0 && tilesLayer.data[xIndex + (yIndex - 1) * tilesLayer.width])) edges.top = false;

			const tile = new Tile(textureAtlas, textureAtlasFrame, tileBounds, edges, zIndex);
			tiles.push(tile);
		}

	return tiles;
};

export { createMapTiles };
