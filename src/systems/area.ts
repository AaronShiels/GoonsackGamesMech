import { System } from ".";
import * as demoMap from "../assets/maps/demo_map.json";
import { BaseComponent, Edges, getBounds, hasBody } from "../components";
import { isPlayer } from "../components";
import { Tile, createTile } from "../entities";
import { createZombie } from "../entities/zombie";
import { camera } from "../framework/camera";
import { gameState } from "../framework/gameState";
import { getResource, Resource } from "../framework/resources";
import { Rectangle, intersects, centre, liesWithin } from "../shapes";

const areaLayer = demoMap.layers.filter((l) => l.name === "areas")[0];
if (!areaLayer || !areaLayer.objects) throw new Error("Invalid layer provided.");

const areas: ReadonlyArray<Rectangle> = areaLayer.objects;
const areaEntites: BaseComponent[][] = areas.map((_) => []);

const transitionDuration = 0.5;
let currentAreaIndex: number | undefined;
let previousAreaIndex: number | undefined;
let transitionElapsed: number = 0;

const areaSystem: System = (entities, _, deltaSeconds) => {
	checkAreaTransition(entities);
	applyAreaTransition(deltaSeconds);
};

const checkAreaTransition = (entities: BaseComponent[]): void => {
	for (const entity of entities) {
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

			loadArea(entities, currentAreaIndex);
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

const loadArea = (entities: BaseComponent[], areaIndex: number): void => {
	const area = areas[areaIndex];
	const floorTiles = createTiles(area, "floor", false, 0);
	const wallTiles = createTiles(area, "walls", true, 1);
	const overlayTiles = createTiles(area, "overlay", false, 3);
	const enemies = createEnemies(area);

	const newEntities = [...floorTiles, ...wallTiles, ...overlayTiles, ...enemies];
	areaEntites[areaIndex] = newEntities;
	entities.push(...newEntities);
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
			if (!tileValue) continue;

			const textureAtlasIndex = tileValue - 1;
			const textureAtlasX = (textureAtlasIndex % tileSet.columns) * tileSet.tilewidth;
			const textureAtlasY = Math.trunc(textureAtlasIndex / tileSet.columns) * tileSet.tileheight;
			const textureAtlasFrame: Rectangle = {
				x: textureAtlasX,
				y: textureAtlasY,
				width: tileSet.tilewidth,
				height: tileSet.tileheight
			};

			const edges: Edges = { bottom: true, left: true, right: true, top: true };
			if (!solid || (yIndex < tilesLayer.height - 1 && tilesLayer.data[xIndex + (yIndex + 1) * tilesLayer.width])) edges.bottom = false;
			if (!solid || (xIndex > 0 && tilesLayer.data[xIndex - 1 + yIndex * tilesLayer.width])) edges.left = false;
			if (!solid || (xIndex < tilesLayer.width - 1 && tilesLayer.data[xIndex + 1 + yIndex * tilesLayer.width])) edges.right = false;
			if (!solid || (yIndex > 0 && tilesLayer.data[xIndex + (yIndex - 1) * tilesLayer.width])) edges.top = false;

			const tile: Tile = createTile(textureAtlas, textureAtlasFrame, tileBounds, edges, zIndex);
			tiles.push(tile);
		}

	return tiles;
};

const createEnemies = (area: Rectangle): BaseComponent[] => {
	const enemiesLayer = demoMap.layers.filter((l) => l.name === "enemies")[0];

	if (!enemiesLayer || enemiesLayer.type !== "objectgroup" || !enemiesLayer.objects) throw new Error("Invalid layer provided.");

	const enemies: BaseComponent[] = [];
	for (const object of enemiesLayer.objects) {
		const objectCentre = centre(object);
		if (!liesWithin(objectCentre, area)) continue;

		if (object.type === "Zombie") {
			const zombie = createZombie(centre(object));
			enemies.push(zombie);
		}
	}

	return enemies;
};

const unloadArea = (areaIndex: number): void => {
	areaEntites[areaIndex].forEach((entity) => (entity.destroyed = true));
	areaEntites[areaIndex] = [];
};

export { areaSystem };
