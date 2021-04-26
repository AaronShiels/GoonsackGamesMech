import { System } from ".";
import demoMap from "../assets/maps/demo_map.json";
import { BodyComponent, Edges, getBounds, hasBody, PlayerComponent } from "../components";
import { isPlayer } from "../components";
import { createTile, Entity } from "../entities";
import { createZombie } from "../entities/zombie";
import { getResource, Resource } from "../resources";
import { Rectangle, rectanglesIntersect, centre, liesWithin, timestampSeconds } from "../utilities";

const areaLayer = demoMap.layers.filter((l) => l.name === "areas")[0];
if (!areaLayer || !areaLayer.objects) throw new Error("Invalid layer provided.");

const areas: ReadonlyArray<Rectangle> = areaLayer.objects;
const areaEntites: Entity[][] = areas.map((_) => []);

const transitionDuration = 0.5;
let currentAreaIndex: number | undefined;
let previousAreaIndex: number | undefined;
let transitionStarted: number = 0;

const areaSystem: System = (game) => {
	const timestamp = timestampSeconds();
	const playerEntity = game.entities.filter((e) => isPlayer(e) && hasBody(e))[0] as (PlayerComponent & BodyComponent) | undefined;

	if (playerEntity) {
		const playerBounds = getBounds(playerEntity);
		const newAreaIndex = areas.findIndex((area) => rectanglesIntersect(area, playerBounds));

		// Check begin transition
		if (!game.state.transitioning && newAreaIndex !== currentAreaIndex && newAreaIndex >= 0) {
			game.state.transitioning = true;

			previousAreaIndex = currentAreaIndex;
			currentAreaIndex = newAreaIndex;
			transitionStarted = timestamp;

			loadArea(game.entities, currentAreaIndex);
		}

		// Check end transition
		if (game.state.transitioning && timestamp - transitionStarted > transitionDuration && typeof currentAreaIndex !== "undefined") {
			game.state.transitioning = false;

			game.camera.x = areas[currentAreaIndex].x;
			game.camera.y = areas[currentAreaIndex].y;

			if (typeof previousAreaIndex !== "undefined") unloadArea(previousAreaIndex);
		}
	}

	if (!game.state.transitioning || typeof currentAreaIndex === "undefined") return;

	const progress = (timestamp - transitionStarted) / transitionDuration;
	const startArea = areas[typeof previousAreaIndex !== "undefined" ? previousAreaIndex : currentAreaIndex];
	const endArea = areas[currentAreaIndex];

	game.camera.x = startArea.x + (endArea.x - startArea.x) * progress;
	game.camera.y = startArea.y + (endArea.y - startArea.y) * progress;
};

const loadArea = (entities: Entity[], areaIndex: number): void => {
	const area = areas[areaIndex];
	const floorTiles = createTiles(area, "floor", false, 0);
	const wallTiles = createTiles(area, "walls", true, 1);
	const overlayTiles = createTiles(area, "overlay", false, 3);
	const enemies = createEnemies(area);

	const newEntities = [...floorTiles, ...wallTiles, ...overlayTiles, ...enemies];
	areaEntites[areaIndex] = newEntities;
	entities.push(...newEntities);
};

const createTiles = (area: Rectangle, layer: string, solid: boolean, zIndex: number): Entity[] => {
	const tilesLayer = demoMap.layers.filter((l) => l.name === layer)[0];
	const tileSet = demoMap.tilesets[0];
	const textureAtlas = getResource(Resource.DemoMap).texture;

	if (!tilesLayer || tilesLayer.type !== "tilelayer" || !tilesLayer.data || !tilesLayer.width || !tilesLayer.height)
		throw new Error("Invalid layer provided.");

	const tiles: Entity[] = [];
	for (let yIndex = 0; yIndex < tilesLayer.height; yIndex++)
		for (let xIndex = 0; xIndex < tilesLayer.width; xIndex++) {
			const tileBounds: Rectangle = {
				x: xIndex * demoMap.tilewidth,
				y: yIndex * demoMap.tileheight,
				width: demoMap.tilewidth,
				height: demoMap.tileheight
			};
			if (!rectanglesIntersect(area, tileBounds)) continue;

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

			const tile: Entity = createTile(textureAtlas, textureAtlasFrame, tileBounds, edges, zIndex);
			tiles.push(tile);
		}

	return tiles;
};

const createEnemies = (area: Rectangle): Entity[] => {
	const enemiesLayer = demoMap.layers.filter((l) => l.name === "enemies")[0];

	if (!enemiesLayer || enemiesLayer.type !== "objectgroup" || !enemiesLayer.objects) throw new Error("Invalid layer provided.");

	const enemies: Entity[] = [];
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
