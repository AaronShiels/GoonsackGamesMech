import { BuildingSegment, createBuilding } from "./building";
import { Mech } from "./mech";
import { ExplosionTiny } from "./explosion";
import { Tile } from "./tile";

interface Entity {
	destroyed: boolean;
}

const isEntity = (object: any): object is Entity => "destroyed" in object;

export { Entity, isEntity, Mech, Tile, BuildingSegment, createBuilding, ExplosionTiny };
