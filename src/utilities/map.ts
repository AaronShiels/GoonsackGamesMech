import { Texture } from "pixi.js";
import { Rectangle } from "../utilities/rectangle.js";
import { Vector } from "../utilities/vector.js";
import { getResource, Resource } from "../assets/index.js";

interface TileMap {
	layers: Array<TileLayer | ObjectGroup>;
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

interface ObjectGroup {
	name: string;
	type: string;
	objects: any[];
}

interface TileSet {
	columns: number;
	tilewidth: number;
	tileheight: number;
}

interface TileData {
	textureAtlas: { texture: Texture; frame: Rectangle };
	position: Vector;
	size: Vector;
	neighbours: { bottom: boolean; left: boolean; right: boolean; top: boolean };
}

interface ObjectData {
	position: Vector;
	size: Vector;
	name: string;
	type: string;
}

const isTileLayer = (layer: any): layer is TileLayer => layer.type === "tilelayer";
const isObjectGroup = (layer: any): layer is ObjectGroup => layer.type === "objectgroup";

const generateTileData = (map: TileMap, layerName: string): TileData[] => {
	const layer = map.layers.filter((l) => l.name === layerName)[0];
	const tileSet = map.tilesets[0];
	const textureAtlasTexture = getResource(Resource.Map).texture;

	if (!isTileLayer(layer)) throw new Error("Invalid layer provided.");

	const tiles: TileData[] = [];
	for (let yIndex = 0; yIndex < layer.height; yIndex++)
		for (let xIndex = 0; xIndex < layer.width; xIndex++) {
			const position = {
				x: xIndex * map.tilewidth + map.tilewidth / 2,
				y: yIndex * map.tileheight + map.tileheight / 2
			};
			const size = {
				x: map.tilewidth,
				y: map.tileheight
			};

			const index = xIndex + yIndex * layer.width;
			const tileValue = layer.data[index];
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

			const neighbours = { bottom: false, left: false, right: false, top: false };
			if (yIndex < layer.height - 1 && layer.data[xIndex + (yIndex + 1) * layer.width]) neighbours.bottom = true;
			if (xIndex > 0 && layer.data[xIndex - 1 + yIndex * layer.width]) neighbours.left = true;
			if (xIndex < layer.width - 1 && layer.data[xIndex + 1 + yIndex * layer.width]) neighbours.right = true;
			if (yIndex > 0 && layer.data[xIndex + (yIndex - 1) * layer.width]) neighbours.top = true;

			const tileData = {
				textureAtlas: { texture: textureAtlasTexture, frame: textureAtlasFrame },
				position,
				size,
				neighbours
			};
			tiles.push(tileData);
		}

	return tiles;
};

const generateObjectData = (map: TileMap, layerName: string): ObjectData[] => {
	const layer = map.layers.filter((l) => l.name === layerName)[0];

	if (!isObjectGroup(layer)) throw new Error("Invalid layer provided.");

	return layer.objects.map((v) => ({
		position: { x: v.x + v.width / 2, y: v.y + v.height / 2 },
		size: { x: v.width, y: v.height },
		name: v.name,
		type: v.type
	}));
};

export { TileData, ObjectData, generateTileData, generateObjectData };
