import { System } from ".";
import * as demoMap from "../assets/maps/demo_map.json";
import { BaseComponent, Edges, getBounds, hasBody } from "../components";
import { isPlayer } from "../components";
import { Tile, createTile } from "../entities";
import camera from "../framework/camera";
import gameState from "../framework/gameState";
import { getResource, Resource } from "../framework/resources";
import World from "../framework/world";
import { Rectangle, intersects } from "../shapes";

const areaLayer = demoMap.layers.filter((l) => l.name === "areas")[0];
if (!areaLayer || !areaLayer.objects) throw new Error("Invalid layer provided.");

const areas: ReadonlyArray<Rectangle> = areaLayer.objects;
const areaEntites: BaseComponent[][] = areas.map((_) => []);

const transitionDuration = 0.5;
let currentAreaIndex: number | undefined;
let previousAreaIndex: number | undefined;
let transitionElapsed: number = 0;

const areaSystem: System = (world, deltaSeconds) => {
	checkAreaTransition(world);
	applyAreaTransition(deltaSeconds);
};

const checkAreaTransition = (world: World): void => {
	for (const entity of world.entities) {
		if (!isPlayer(entity) || !hasBody(entity)) continue;

		const playerBounds = getBounds(entity);
		const newAreaIndex = areas.findIndex((area) => intersects(area, playerBounds));
		if (newAreaIndex < 0) break;

		// Check begin transition
		if (!gameState.transitioning && newAreaIndex !== currentAreaIndex) {
			gameState.transitioning = true;

			previousAreaIndex = currentAreaIndex;
			currentAreaIndex = newAreaIndex;
			transitionElapsed = 0;

			loadArea(world, currentAreaIndex);
		}

		// Check end transition
		if (gameState.transitioning && transitionElapsed > transitionDuration && typeof currentAreaIndex !== "undefined") {
			gameState.transitioning = false;

			camera.x = areas[currentAreaIndex].x;
			camera.y = areas[currentAreaIndex].y;

			if (typeof previousAreaIndex !== "undefined") unloadArea(previousAreaIndex);
		}
	}
};

const applyAreaTransition = (deltaSeconds: number): void => {
	if (!gameState.transitioning || typeof currentAreaIndex === "undefined") return;

	transitionElapsed += deltaSeconds;

	const progress = transitionElapsed / transitionDuration;
	const startArea = areas[typeof previousAreaIndex !== "undefined" ? previousAreaIndex : currentAreaIndex];
	const endArea = areas[currentAreaIndex];

	camera.x = startArea.x + (endArea.x - startArea.x) * progress;
	camera.y = startArea.y + (endArea.y - startArea.y) * progress;
};

const loadArea = (world: World, areaIndex: number): void => {
	const area = areas[areaIndex];
	const floorTiles = createTiles(area, "floor", false, 0);
	const wallTiles = createTiles(area, "walls", true, 1);
	const overlayTiles = createTiles(area, "overlay", false, 3);

	const newEntities = [...floorTiles, ...wallTiles, ...overlayTiles];
	areaEntites[areaIndex] = newEntities;
	world.addEntities(newEntities);
};

const createTiles = (area: Rectangle, layer: string, solid: boolean, zIndex: number): Tile[] => {
	const tilesLayer = demoMap.layers.filter((l) => l.name === layer)[0];
	const tileSet = demoMap.tilesets[0];
	const textureAtlas = getResource(Resource.DemoMap).texture;

	if (!tilesLayer || tilesLayer.type !== "tilelayer" || !tilesLayer.data || !tilesLayer.width || !tilesLayer.height)
		throw new Error("Invalid layer provided.");

	const tiles: Tile[] = [];
	for (let yIndex = 0; yIndex < tilesLayer.height; yIndex++)
		for (let xIndex = 0; xIndex < tilesLayer.width; xIndex++) {
			const tileBounds: Rectangle = {
				x: xIndex * demoMap.tilewidth,
				y: yIndex * demoMap.tileheight,
				width: demoMap.tilewidth,
				height: demoMap.tileheight
			};
			if (!intersects(area, tileBounds)) continue;

			const index = xIndex + yIndex * tilesLayer.width;
			const tileValue = tilesLayer.data[index];
			if (tileValue === 0) continue;

			const textureAtlasIndex = tileValue - 1;
			const textureAtlasX = (textureAtlasIndex % tileSet.columns) * tileSet.tilewidth;
			const textureAtlasY = Math.trunc(textureAtlasIndex / tileSet.columns) * tileSet.tileheight;
			const textureAtlasFrame: Rectangle = {
				x: textureAtlasX,
				y: textureAtlasY,
				width: tileSet.tilewidth,
				height: tileSet.tileheight
			};

			const edges: Edges = { down: false, left: false, right: false, up: false };

			const tile: Tile = createTile(textureAtlas, textureAtlasFrame, tileBounds, edges, zIndex);
			tiles.push(tile);
		}

	return tiles;
};

const unloadArea = (areaIndex: number): void => {
	areaEntites[areaIndex].forEach((entity) => (entity.destroyed = true));
	areaEntites[areaIndex] = [];
};

export default areaSystem;
